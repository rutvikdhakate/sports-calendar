import mongoose from 'mongoose';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Event from '../models/Events.js'; // Updated import to use 'Events.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const APIS = {
    API_SPORTS: {
        baseUrl: 'https://v3.football.api-sports.io',
        headers: {
            'X-API-Key': process.env.API_SPORTS_KEY
        }
    },
    ESPN: {
        baseUrl: 'https://site.api.espn.com/apis/site/v2/sports',
        headers: {}
    },
    SPORTRADAR: { // Note: Sportradar not fully implemented in this example
        baseUrl: 'https://api.sportradar.us',
        apiKey: process.env.SPORTRADAR_API_KEY
    },
    THESPORTSDB: {
        baseUrl: 'https://www.thesportsdb.com/api/v1/json/',
        apiKey: process.env.THESPORTSDB_API_KEY || '2' 
    }
};

const SPORTS_CONFIG = {
    f1: { 
        api: 'THESPORTSDB',
        search_query: 'Formula 1',
        endpoint: '/eventsnext.php',
        sportName: 'f1'
    },
    motogp: {
        api: 'THESPORTSDB',
        search_query: 'MotoGP',
        endpoint: '/eventsnext.php',
        sportName: 'motogp'
    },
    wec: {
        api: 'THESPORTSDB',
        search_query: 'WEC', 
        endpoint: '/eventsnext.php',
        sportName: 'wec'
    },
    cricket: {
        api: 'THESPORTSDB',
        search_query: 'ICC Cricket World Cup',
        endpoint: '/eventsnext.php',
        sportName: 'cricket'
    },
    football: { 
        api: 'ESPN',
        endpoint: '/soccer/eng.1/scoreboard',
        sportName: 'football'
    },
    'e-sports': { // Consistent naming
        api: 'THESPORTSDB',
        search_query: 'esports',
        endpoint: '/eventsnext.php',
        sportName: 'e-sports'
    },
    americanfootball: { // Consistent naming
        api: 'ESPN',
        endpoint: '/football/nfl/scoreboard',
        sportName: 'americanfootball'
    },
    baseball: { // Consistent naming
        api: 'ESPN',
        endpoint: '/baseball/mlb/scoreboard',
        sportName: 'baseball'
    },
    hockey: { // Consistent naming
        api: 'ESPN',
        endpoint: '/hockey/nhl/scoreboard',
        sportName: 'hockey'
    },
    soccer: { // Consistent naming
        api: 'ESPN',
        endpoint: '/soccer/eng.1/scoreboard',
        sportName: 'soccer'
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully for data sync.');
    } catch (err) {
        if (!process.env.MONGO_URI) {
            console.error('Failed to connect to MongoDB: MONGO_URI is not defined in the .env file.');
        } else {
            console.error('Failed to connect to MongoDB:', err.message);
        }
        process.exit(1);
    }
};

const fetchData = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching from ${url}:`, error.message);
        return null;
    }
};

const getLeagueIdByNameTheSportsDB = async (leagueName) => {
    const url = `${APIS.THESPORTSDB.baseUrl}${APIS.THESPORTSDB.apiKey}/search_all_leagues.php?s=${encodeURIComponent(leagueName)}`;
    const data = await fetchData(url);
    if (data && data.countrys && data.countrys.length > 0) {
        // Find exact match for the league name
        const league = data.countrys.find(l => l.strLeague === leagueName);
        if (league) {
            return league.idLeague;
        }
    }
    return null;
};

const fetchFromTheSportsDB = async (leagueId, config) => {
    if (!leagueId) {
        console.warn(`TheSportsDB: No league ID provided for ${config.search_query}. Skipping.`);
        return [];
    }
    const url = `${APIS.THESPORTSDB.baseUrl}${APIS.THESPORTSDB.apiKey}${config.endpoint}?id=${leagueId}`;
    const data = await fetchData(url);
    return data?.events || [];
};

const fetchFromAPISports = async (config) => {
    const url = `${APIS.API_SPORTS.baseUrl}${config.endpoint}`;
    const options = { headers: APIS.API_SPORTS.headers };
    const data = await fetchData(url, options);
    return data?.response || [];
};

const fetchFromESPN = async (config) => {
    const url = `${APIS.ESPN.baseUrl}${config.endpoint}`;
    const data = await fetchData(url);
    return data?.events || [];
};

const transformTheSportsDBEvent = (apiEvent, sport) => {
    // Ensure event.dateEvent and event.strTime exist before constructing Date
    const startDateTime = apiEvent.dateEvent && apiEvent.strTime ? `${apiEvent.dateEvent}T${apiEvent.strTime}` : null;
    return {
        title: apiEvent.strEvent || 'Unknown Event',
        start: startDateTime ? new Date(startDateTime) : new Date(), // Fallback to current date if invalid
        end: null, // TheSportsDB doesn't typically provide end times for individual events
        sport: sport,
        category: apiEvent.strLeague || 'Unknown',
        description: apiEvent.strDescriptionEN || 'No description available.',
        source: 'TheSportsDB',
        externalId: apiEvent.idEvent || `${sport}-${apiEvent.strEvent}-TheSportsDB` // Create unique ID if missing
    };
};

const transformAPISportsEvent = (apiEvent) => {
    return {
        title: `${apiEvent.teams.home.name} vs ${apiEvent.teams.away.name}`,
        start: new Date(apiEvent.fixture.date),
        end: new Date(new Date(apiEvent.fixture.date).getTime() + (2 * 60 * 60 * 1000)), // Assuming 2 hour duration
        sport: 'football', 
        category: apiEvent.league.name,
        description: `${apiEvent.league.name} - Round ${apiEvent.league.round}`,
        source: 'API-Sports',
        externalId: apiEvent.fixture.id.toString()
    };
};

const transformESPNEvent = (apiEvent, sport) => {
    const competition = apiEvent.competitions?.[0];
    const homeTeam = competition?.competitors.find(c => c.homeAway === 'home');
    const awayTeam = competition?.competitors.find(c => c.homeAway === 'away');
    
    return {
        title: `${homeTeam?.team?.displayName || 'Unknown'} vs ${awayTeam?.team?.displayName || 'Unknown'}`,
        start: new Date(apiEvent.date),
        end: apiEvent.endDate ? new Date(apiEvent.endDate) : new Date(new Date(apiEvent.date).getTime() + (2 * 60 * 60 * 1000)), // Default 2 hours
        sport: sport,
        category: apiEvent.season?.type?.name || 'Regular Season',
        description: apiEvent.name || 'No description available',
        source: 'ESPN',
        externalId: apiEvent.id
    };
};

const fetchEventsForSport = async (sportKey, config) => {
    console.log(`Fetching ${sportKey} events...`);
    
    let events = [];
    let transformedEvents = [];

    try {
        switch (config.api) {
            case 'THESPORTSDB':
                const leagueId = await getLeagueIdByNameTheSportsDB(config.search_query);
                events = await fetchFromTheSportsDB(leagueId, config);
                transformedEvents = events.map(event => transformTheSportsDBEvent(event, sportKey));
                break;
            case 'API_SPORTS':
                events = await fetchFromAPISports(config);
                transformedEvents = events.map(event => transformAPISportsEvent(event));
                break;
            case 'ESPN':
                events = await fetchFromESPN(config);
                transformedEvents = events.map(event => transformESPNEvent(event, config.sportName || sportKey));
                break;
            case 'SPORTRADAR':
                console.warn('Sportradar API integration is not fully implemented in this example.');
                break;
            default:
                console.warn(`Unknown API: ${config.api}`);
        }

        // Filter future events only and ensure valid dates
        const now = new Date();
        const futureEvents = transformedEvents.filter(event => event.start && !isNaN(event.start.getTime()) && event.start > now);
        
        console.log(`Found ${futureEvents.length} upcoming ${sportKey} events.`);
        return futureEvents;

    } catch (error) {
        console.error(`Error processing ${sportKey} events:`, error.message);
        return [];
    }
};

const syncEvents = async () => {
    await connectDB();

    console.log('Starting event synchronization...');

    try {
        // Only delete events that originated from an API sync to preserve seeded data
        await Event.deleteMany({ source: { $ne: 'seed' } }); 
        console.log('Successfully deleted all existing non-seeded events.');
    } catch (err) {
        console.error('Failed to delete existing non-seeded events:', err.message);
    }

    const allTransformedEvents = [];

    for (const [sportKey, config] of Object.entries(SPORTS_CONFIG)) {
        const events = await fetchEventsForSport(sportKey, config);
        allTransformedEvents.push(...events);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Remove duplicates based on externalId (if available). Filter out events without externalId after fetching
    const uniqueEvents = allTransformedEvents.filter((event, index, self) => 
        event.externalId && index === self.findIndex(e => e.externalId === event.externalId)
    );

    if (uniqueEvents.length > 0) {
        try {
            await Event.insertMany(uniqueEvents);
            console.log(`Successfully added ${uniqueEvents.length} new events to the database.`);
        } catch (err) {
            console.error('Failed to insert new events:', err.message);
        }
    } else {
        console.log('No new events to add to the database from API sources.');
    }

    console.log('Event synchronization complete.');
    console.log(`Total events processed from APIs: ${allTransformedEvents.length}`);
    console.log(`Unique events saved from APIs: ${uniqueEvents.length}`);
    
    mongoose.disconnect();
};

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    mongoose.disconnect(); 
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    mongoose.disconnect(); 
    process.exit(1);
});

syncEvents();
