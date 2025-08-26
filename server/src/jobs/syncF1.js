import 'dotenv/config';
import mongoose from 'mongoose';
import { upsertEvent } from '../utils/upsertEvent.js';


const API = (season) => `https://ergast.com/api/f1/${season}.json`;


async function fetchSeason(season) {
const res = await fetch(API(season));
if (!res.ok) throw new Error('Ergast API error');
const json = await res.json();
return json?.MRData?.RaceTable?.Races ?? [];
}


function toDate(dateStr, timeStr) {
// Ergast provides local date + time in UTC; if time missing, default noon.
const t = timeStr || '12:00:00Z';
return new Date(`${dateStr}T${t}`);
}


async function run() {
const season = new Date().getUTCFullYear();
await mongoose.connect(process.env.MONGO_URI);
const races = await fetchSeason(season);


for (const r of races) {
const start = toDate(r.date, r.time);
const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // rough 2h window


await upsertEvent({
externalId: `f1-${season}-${r.round}`,
title: `${r.raceName}`,
sport: 'f1',
start,
end,
venue: r.Circuit?.circuitName,
source: 'ergast',
meta: {
season,
round: r.round,
locality: r.Circuit?.Location?.locality,
country: r.Circuit?.Location?.country,
circuitId: r.Circuit?.circuitId
}
});
}


console.log(`Synced ${races.length} F1 races for ${season}.`);
process.exit(0);
}


run().catch((e) => { console.error(e); process.exit(1); });