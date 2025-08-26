import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const SPORT_LIST = ['cricket', 'football', 'f1', 'motogp', 'wec'];
const API_BASE_URL = 'http://localhost:4000/api';

export default function SportsCalendar() {
  const [selected, setSelected] = useState([...SPORT_LIST]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);

  async function loadEvents() {
    console.log("Attempting to load events...");
    setLoading(true);
    setError(null);

    try {
      // Find the earliest event date and navigate the calendar to it
      const allEventsResponse = await fetch(`${API_BASE_URL}/events?sports=${SPORT_LIST.join(',')}`);
      if (!allEventsResponse.ok) {
        throw new Error('Failed to fetch initial events');
      }
      const allEvents = await allEventsResponse.json();
      setEvents(allEvents);
      console.log("Events fetched successfully:", allEvents);

      if (allEvents.length > 0) {
        // Find the earliest event date and navigate the calendar to it
        const sortedEvents = allEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
        const firstEventDate = sortedEvents[0].start;
        
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.gotoDate(firstEventDate);
        }
      } else {
        console.log("No events found in the database.");
      }
    } catch (err) {
      console.error("An error occurred while fetching events:", err);
      setError("Failed to load events. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function toggleSport(sportToToggle) {
    const newSelected = selected.includes(sportToToggle)
      ? selected.filter(s => s !== sportToToggle)
      : [...selected, sportToToggle];
    setSelected(newSelected);
  }

  // Filter events locally based on selected sports
  const filteredEvents = events.filter(event => selected.includes(event.extendedProps.sport));

  function handleEventClick(info) {
    const e = info.event;
    const { sport, venue, meta, source } = e.extendedProps || {};
    alert(`${e.title}\n\nSport: ${sport?.toUpperCase()}\nVenue: ${venue || 'N/A'}\nSource: ${source || 'N/A'}\nMeta: ${meta ? JSON.stringify(meta, null, 2) : 'N/A'}`);
  }

  function renderEventContent(arg) {
    const title = arg.event.title.replace(/\[.*?\]\s*/, '');
    return (
      <div title={arg.event.title}>
        {title}
      </div>
    );
  }

  function getEventClassNames(arg) {
    const sport = arg.event.extendedProps?.sport;
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
    </div>
  );
}
