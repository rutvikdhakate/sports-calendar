// server/src/models/Event.js

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
  },
  venue: {
    type: String,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
  },
  source: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;