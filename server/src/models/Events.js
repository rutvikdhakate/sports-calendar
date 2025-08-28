import mongoose from 'mongoose';

// Define the schema for the Event model
const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date // End date is optional, but good to have
    },
    sport: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    source: {
        type: String,
        required: true,
        trim: true
    },
    externalId: { // This helps in preventing duplicates when syncing from APIs
        type: String,
        required: false, // Make it optional for manually seeded events
        unique: false    // Do not enforce unique if some sources don't provide it
    },
    venue: { // Keep venue for seed events
        type: String,
        trim: true
    },
    meta: { // Keep meta for seed events
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Create and export the Event model as the default export
const Event = mongoose.model('Event', EventSchema);

export default Event;
