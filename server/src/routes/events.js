import express from 'express';
import Event from '../models/Events.js'; // Updated import to use 'Events.js'

const router = express.Router();

// Get filtered events
router.get('/', async (req, res) => {
  try {
    const { from, to, sports } = req.query;

    let query = {};

    // Filter by date range
    if (from && to) {
      query.start = { $gte: new Date(from), $lte: new Date(to) };
    }

    // Filter by selected sports (case-insensitive for robustness)
    if (sports) {
      // Split sports string into an array, and create regex for case-insensitive matching
      const sportsArray = sports.split(',').map(s => new RegExp(`^${s}$`, 'i')); 
      query.sport = { $in: sportsArray };
    }

    // Fetch all events that match the query
    const events = await Event.find(query);

    // FullCalendar expects event objects directly.
    // Ensure `id`, `title`, `start`, `end`, and other properties are at the top level.
    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.start,
      end: event.end, 
      // Directly expose other properties for FullCalendar and modal
      sport: event.sport,
      category: event.category,
      venue: event.venue,
      meta: event.meta,
      source: event.source,
    }));

    res.json(formattedEvents);
    console.log(`Successfully sent ${formattedEvents.length} events to the frontend.`);
  } catch (err) {
    console.error("An error occurred in the /api/events route:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
