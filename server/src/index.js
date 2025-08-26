import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import eventsRoute from './routes/events.js';


const app = express();
app.use(cors());
app.use(express.json());


app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/events', eventsRoute);


const PORT = process.env.PORT || 4000;


mongoose
.connect(process.env.MONGO_URI)
.then(() => {
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
})
.catch((err) => {
console.error('Mongo connection error', err);
process.exit(1);
});