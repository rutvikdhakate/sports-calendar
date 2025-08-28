import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import eventsRouter from './routes/events.js'; 
import Event from './models/Events.js'; // Corrected: import from 'Events.js' (uppercase E)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server root (one level up from src)
dotenv.config({ path: path.resolve(__dirname, '../.env') }); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sports_calendar_db';
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

app.use('/api/events', eventsRouter);

// --- Seeding Route (for quick dev/test via browser) ---
// This route now also uses Event.deleteMany({ source: 'seed' }) to avoid clearing API-synced data
app.get('/api/seed-api-route', async (req, res) => {
    console.log('Attempting to seed database via API route...');
    try {
        await connectDB(); 

        // Clear ONLY events that have 'seed' as their source to preserve API-synced data
        await Event.deleteMany({ source: 'seed' }); 
        console.log('Existing seeded events cleared for re-seeding.');
        
        // Define sample events to match frontend expectations and consistent naming
        const sampleEvents = [
            {
                title: 'Italian Grand Prix',
                start: new Date('2025-09-07T13:00:00Z'),
                end: new Date('2025-09-07T15:00:00Z'),
                sport: 'f1', // Consistent naming
                category: 'Formula 1',
                source: 'seed',
                venue: 'Monza',
                meta: { race: 'Italian GP' },
                externalId: 'seed-f1-italy'
            },
            {
                title: 'MotoGP Qatar',
                start: new Date('2025-03-16T16:00:00Z'), 
                end: new Date('2025-03-16T18:00:00Z'),
                sport: 'motogp', 
                category: 'MotoGP',
                source: 'seed',
                venue: 'Lusail',
                meta: { race: 'Qatar GP' },
                externalId: 'seed-motogp-qatar'
            },
            {
                title: 'WEC 6 Hours of Spa',
                start: new Date('2025-05-10T10:00:00Z'), 
                end: new Date('2025-05-10T16:00:00Z'),
                sport: 'wec', 
                category: 'WEC',
                source: 'seed',
                venue: 'Spa',
                meta: { race: '6 Hours of Spa' },
                externalId: 'seed-wec-spa'
            },
            {
                title: 'IND vs AUS ODI',
                start: new Date('2025-11-15T09:00:00Z'),
                end: new Date('2025-11-15T17:00:00Z'),
                sport: 'cricket', 
                category: 'ODI',
                source: 'seed',
                venue: 'Mumbai',
                meta: { format: 'ODI' },
                externalId: 'seed-cricket-indiaaus'
            },
            {
                title: 'UCL Group Match',
                start: new Date('2025-10-21T19:00:00Z'),
                end: new Date('2025-10-21T21:00:00Z'),
                sport: 'football', 
                category: 'UEFA Champions League',
                source: 'seed',
                venue: 'Madrid',
                meta: { teams: 'Real Madrid vs PSG' },
                externalId: 'seed-ucl-match'
            },
            {
                title: 'E-Sports League Finals',
                start: new Date('2025-09-05T18:00:00Z'),
                end: new Date('2025-09-05T22:00:00Z'),
                sport: 'e-sports', 
                category: 'Gaming',
                source: 'seed',
                venue: 'Online Arena',
                meta: { game: 'Valorant' },
                externalId: 'seed-esports-final'
            },
            {
                title: 'American Football Championship',
                start: new Date('2025-09-10T15:30:00Z'),
                end: new Date('2025-09-10T19:00:00Z'),
                sport: 'americanfootball', 
                category: 'NFL',
                source: 'seed',
                venue: 'Allegiant Stadium',
                meta: { teams: 'Chiefs vs 49ers' },
                externalId: 'seed-nfl-champ'
            },
            {
                title: 'Baseball World Series Game 1',
                start: new Date('2025-10-21T19:00:00Z'),
                end: new Date('2025-10-21T23:00:00Z'),
                sport: 'baseball', 
                category: 'MLB',
                source: 'seed',
                venue: 'Dodger Stadium',
                meta: { series: 'World Series' },
                externalId: 'seed-mlb-ws1'
            },
            {
                title: 'Hockey Stanley Cup Finals Game 3',
                start: new Date('2025-06-12T20:00:00Z'), 
                end: new Date('2025-06-12T23:00:00Z'),
                sport: 'hockey', 
                category: 'NHL',
                source: 'seed',
                venue: 'Madison Square Garden',
                meta: { series: 'Stanley Cup' },
                externalId: 'seed-nhl-scf3'
            },
            {
                title: 'Soccer World Cup Qualifiers', 
                start: new Date('2025-10-01T14:00:00Z'),
                end: new Date('2025-10-01T16:00:00Z'),
                sport: 'soccer', 
                category: 'International',
                source: 'seed',
                venue: 'Camp Nou',
                meta: { teams: 'Brazil vs Argentina' },
                externalId: 'seed-soccer-qual'
            }
        ];
        
        await Event.insertMany(sampleEvents);
        res.send(`Database seeded successfully with ${sampleEvents.length} events!`);
        console.log(`Database seeded successfully with ${sampleEvents.length} events via API route.`);
    } catch (err) {
        console.error('Error seeding database via API route:', err);
        res.status(500).send(`Server error during seeding: ${err.message}`);
    }
});


const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`You can visit http://localhost:${PORT}/api/seed-api-route to quickly seed the database with sample data.`);
    });
};

startServer();
