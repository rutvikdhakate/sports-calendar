import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

// SportsCalendar component
export default function SportsCalendar() {
  // Updated SPORT_LIST to match both seeded and synced data
  // All names are lowercase and hyphenated for consistent CSS class generation
  const SPORT_LIST = [
    'f1', 'motogp', 'wec', 'cricket', 'football', 
    'e-sports', 'americanfootball', 'baseball', 'hockey', 'soccer' 
  ];
  // Frontend connects to backend at port 4000
  const API_BASE_URL = 'http://localhost:4000/api'; 

  const [selected, setSelected] = useState(SPORT_LIST); // All selected by default
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);
  const calendarRef = useRef(null);

  // Function to map backend sport names to CSS class names (lowercase, no spaces, no periods)
  // This is crucial for consistent styling and filtering
  const getSportClassName = (sportName) => {
    return sportName.toLowerCase().replace(/\s/g, '-').replace('.', '');
  };

  async function loadEvents() {
    console.log("Attempting to load events...");
    setLoading(true);
    setError(null);

    try {
      // Pass selected sports to the backend for filtering
      // Ensure the query parameter also uses the consistent lowercase/hyphenated names
      const sportsQueryParam = selected.map(s => s).join(','); // `selected` already has formatted names
      const response = await axios.get(`${API_BASE_URL}/events?sports=${sportsQueryParam}`);
      const allEvents = response.data;
      
      // Filter out events that are entirely in the past or have invalid dates
      const now = new Date();
      const futureAndPresentEvents = allEvents.filter(event => {
        try {
          const eventStart = new Date(event.start);
          // Check if eventStart is a valid date and is not entirely in the past (by day)
          return !isNaN(eventStart.getTime()) && eventStart >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } catch (e) {
          console.warn(`Invalid date format for event: ${event.title}`, event.start);
          return false; // Exclude events with invalid dates
        }
      });

      // Format events for FullCalendar
      const formattedEvents = futureAndPresentEvents.map(event => ({
        ...event,
        start: new Date(event.start), // Ensure FullCalendar gets Date objects
        end: event.end ? new Date(event.end) : null, // Also format end date if it exists
        // Ensure the sport property itself is consistently formatted for the calendar (lowercase/hyphenated)
        sport: getSportClassName(event.sport) 
      }));
      
      console.log("Events fetched successfully and formatted for calendar:");
      console.table(formattedEvents);

      setEvents(formattedEvents);

      if (formattedEvents.length > 0) {
        // Find the earliest event date and navigate the calendar to it
        const sortedEvents = formattedEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
        const firstEventDate = sortedEvents[0].start;
        
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.gotoDate(firstEventDate);
        }
      } else {
        console.log("No events found in the database or all events are in the past.");
      }
    } catch (err) {
      console.error("An error occurred while fetching events:", err);
      setError("Failed to load events. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  }

  // Refetch events when selected sports change
  useEffect(() => {
    loadEvents();
  }, [selected]); // Dependency array includes 'selected'

  function toggleSport(sportToToggle) {
    const newSelected = selected.includes(sportToToggle)
      ? selected.filter(s => s !== sportToToggle)
      : [...selected, sportToToggle];
    setSelected(newSelected);
  }

  // Filter events locally based on selected sports (this will filter based on the 'sport' property of the event, which is now consistently formatted)
  const filteredEvents = events.filter(event => selected.includes(event.sport));

  function handleEventClick(info) {
    setModalEvent(info.event);
    setModalOpen(true);
  }

  function renderEventContent(arg) {
    return (
      <div title={arg.event.title}>
        {arg.event.title}
      </div>
    );
  }

  function getEventClassNames(arg) {
    const sport = arg.event.sport; // `event.sport` is already formatted
    return `event-${sport}`;
  }

  return (
    <div>
      <div className="filter-container">
        {SPORT_LIST.map(s => (
          <label key={s} className="filter-label">
            <input
              type="checkbox"
              className="sr-only"
              checked={selected.includes(s)}
              onChange={() => toggleSport(s)}
            />
            {/* Using the consistent sport name for icon generation */}
            <div className={`sport-icon-box sport-icon-${s}`} title={s.toUpperCase()}></div>
          </label>
        ))}
      </div>

      {loading && <div className="text-center p-4">Loading events...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        eventClassNames={getEventClassNames}
        timeZone="local"
        height="auto"
      />

      {modalOpen && modalEvent && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalEvent.title}</h2>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Sport:</strong> {modalEvent.sport}</p>
              <p><strong>Category:</strong> {modalEvent.category}</p>
              <p><strong>Date:</strong> {new Date(modalEvent.start).toLocaleString()}</p>
              {modalEvent.end && <p><strong>End Date:</strong> {new Date(modalEvent.end).toLocaleString()}</p>}
              {modalEvent.venue && <p><strong>Venue:</strong> {modalEvent.venue}</p>}
              {modalEvent.meta && <p><strong>Details:</strong> {JSON.stringify(modalEvent.meta, null, 2)}</p>}
              <p><strong>Source:</strong> {modalEvent.source}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
