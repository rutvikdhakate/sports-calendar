import 'dotenv/config';
import mongoose from 'mongoose';
import Event from '../models/Event.js';


await mongoose.connect(process.env.MONGO_URI);


await Event.deleteMany({ source: 'seed' });
await Event.insertMany([
{ title: 'Italian Grand Prix', sport: 'f1', start: new Date('2025-09-07T13:00:00Z'), end: new Date('2025-09-07T15:00:00Z'), venue: 'Monza', source: 'seed' },
{ title: 'MotoGP Qatar', sport: 'motogp', start: new Date('2025-03-16T16:00:00Z'), end: new Date('2025-03-16T18:00:00Z'), venue: 'Lusail', source: 'seed' },
{ title: 'WEC 6 Hours of Spa', sport: 'wec', start: new Date('2025-05-10T10:00:00Z'), end: new Date('2025-05-10T16:00:00Z'), venue: 'Spa', source: 'seed' },
{ title: 'IND vs AUS ODI', sport: 'cricket', start: new Date('2025-11-15T09:00:00Z'), end: new Date('2025-11-15T17:00:00Z'), venue: 'Mumbai', source: 'seed', meta: { format: 'ODI' } },
{ title: 'UCL Group Match', sport: 'football', start: new Date('2025-10-21T19:00:00Z'), end: new Date('2025-10-21T21:00:00Z'), venue: 'Madrid', source: 'seed' }
]);


console.log('Seeded seed events.');
process.exit(0);