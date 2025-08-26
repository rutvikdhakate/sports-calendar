import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Get filtered events
router.get('/', async (req, res) => {
  try {
    // Log the incoming request to help with debugging
    console.log("Received a request to /api/events with query:", req.query);

    const { from, to, sports } = req.query;

    let query = {};

    // Filter by date range
    if (from && to) {
      query.start = { $gte: new Date(from), $lte: new Date(to) };
    }

    // Filter by selected sports
    if (sports) {
      const sportsArray = sports.split(',');
      query.sport = { $in: sportsArray };
    }

    // Filter by source to only get seeded data
    query.source = 'seed';

    const events = await Event.find(query);

    // Log the data fetched from the database
    console.log(`Found ${events.length} events from the database.`);
    
    // FullCalendar requires specific fields like `title`, `start`, `end`, and `extendedProps`
    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: {
        sport: event.sport,
        venue: event.venue,
        meta: event.meta,
        source: event.source,
      },
    }));

    res.json(formattedEvents);
    console.log("Successfully sent events to the frontend.");
  } catch (err) {
    console.error("An error occurred in the /api/events route:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;