import Event from '../models/Event.js';


export async function upsertEvent({ externalId, title, sport, start, end, venue, source, meta }) {
const doc = await Event.findOneAndUpdate(
{ externalId, sport },
{ title, sport, start, end, venue, source, meta },
{ upsert: true, new: true, setDefaultsOnInsert: true }
);
return doc;
}