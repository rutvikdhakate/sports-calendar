import mongoose from 'mongoose';
import Event from '../models/Events.js'; // Updated import to use 'Events.js'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sports_calendar_db';

const seedEvents = async () => {
    console.log('Starting to seed the database with initial events...');
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection successful for seed job.');

        // Clear existing events to prevent duplicates on each run
        await Event.deleteMany({}); 
        console.log('Existing events cleared.');

        // All events and sport names are now lowercase and hyphenated for consistency
        const dummyEvents = [
            { title: 'Italian Grand Prix', sport: 'f1', start: new Date('2025-09-07T13:00:00Z'), end: new Date('2025-09-07T15:00:00Z'), venue: 'Monza', source: 'seed', externalId: 'seed-f1-italy' },
            { title: 'MotoGP Qatar', sport: 'motogp', start: new Date('2025-03-16T16:00:00Z'), end: new Date('2025-03-16T18:00:00Z'), venue: 'Lusail', source: 'seed', externalId: 'seed-motogp-qatar' },
            { title: 'WEC 6 Hours of Spa', sport: 'wec', start: new Date('2025-05-10T10:00:00Z'), end: new Date('2025-05-10T16:00:00Z'), venue: 'Spa', source: 'seed', externalId: 'seed-wec-spa' },
            { title: 'IND vs AUS ODI', sport: 'cricket', start: new Date('2025-11-15T09:00:00Z'), end: new Date('2025-11-15T17:00:00Z'), venue: 'Mumbai', source: 'seed', meta: { format: 'ODI' }, externalId: 'seed-cricket-indiaaus' },
            { title: 'UCL Group Match', sport: 'football', start: new Date('2025-10-21T19:00:00Z'), end: new Date('2025-10-21T21:00:00Z'), venue: 'Madrid', source: 'seed', externalId: 'seed-ucl-match' },
            { title: 'E-Sports League Finals', sport: 'e-sports', start: new Date('2025-09-05T18:00:00Z'), end: new Date('2025-09-05T22:00:00Z'), venue: 'Online Arena', source: 'seed', externalId: 'seed-esports-final', category: 'Gaming' },
            { title: 'American Football Championship', sport: 'americanfootball', start: new Date('2025-09-10T15:30:00Z'), end: new Date('2025-09-10T19:00:00Z'), venue: 'Allegiant Stadium', source: 'seed', externalId: 'seed-nfl-champ', category: 'NFL' },
            { title: 'Baseball World Series Game 1', sport: 'baseball', start: new Date('2025-10-21T19:00:00Z'), end: new Date('2025-10-21T23:00:00Z'), venue: 'Dodger Stadium', source: 'seed', externalId: 'seed-mlb-ws1', category: 'MLB' },
            { title: 'Hockey Stanley Cup Finals Game 3', sport: 'hockey', start: new Date('2025-06-12T20:00:00Z'), end: new Date('2025-06-12T23:00:00Z'), venue: 'Madison Square Garden', source: 'seed', externalId: 'seed-nhl-scf3', category: 'NHL' },
            { title: 'Soccer World Cup Qualifiers', sport: 'soccer', start: new Date('2025-10-01T14:00:00Z'), end: new Date('2025-10-01T16:00:00Z'), venue: 'Camp Nou', source: 'seed', externalId: 'seed-soccer-qual', category: 'International' }
        ];
        
        await Event.insertMany(dummyEvents);
        console.log(`${dummyEvents.length} events seeded successfully.`);

    } catch (error) {
        console.error('An error occurred during seeding:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected. Seeding complete.');
        process.exit();
    }
};

seedEvents();
