import React from 'react';
import SportsCalendar from './components/SportsCalendar.jsx';

export default function App() {
  return (
    <div className="app-container">
      <style>
        {`
        :root {
          --bg-color: #110e20;
          --accent-glow: #00e0ff; /* Electric blue */
          --secondary-glow: #e000ff; /* Electric pink/purple */
          --card-bg: rgba(26, 26, 40, 0.8); /* Dark translucent card */
          --border-color: #333;
          --text-color: #f0f0f0;
          --text-secondary: #a0a0c0;
          --header-color: #ffffff;
          --modal-bg: #2a2a3e;

          /* Updated Sport-specific colors for events (consistent with lowercase/hyphenated names) */
          --f1-event-color: #E10600; 
          --motogp-event-color: #A60C2C; 
          --wec-event-color: #004D7C; 
          --cricket-event-color: #3C833D; 
          --football-event-color: #121212; /* Dark for football */
          --e-sports-event-color: #9b59b6; /* Purple */
          --americanfootball-event-color: #d35400; /* Orange */
          --baseball-event-color: #3498db; /* Blue */
          --hockey-event-color: #e74c3c; /* Red */
          --soccer-event-color: #2ecc71; /* Green */
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: var(--bg-color);
          position: relative;
          color: var(--text-color);
          min-height: 100vh;
        }
        
        body::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 15% 50%, var(--accent-glow) 0%, transparent 40%),
                      radial-gradient(circle at 85% 50%, var(--secondary-glow) 0%, transparent 40%);
          opacity: 0.15;
          pointer-events: none;
        }

        .app-container {
          padding: 32px 16px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .header {
          margin-bottom: 40px;
          text-align: center;
          text-shadow: 0 0 10px rgba(0,224,255,0.5);
        }

        .header h1 {
          font-size: 3.5rem;
          margin: 0;
          font-weight: 700;
          color: var(--header-color);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .header p {
          font-size: 1.1rem;
          margin-top: 8px;
          color: var(--text-secondary);
        }

        .calendar-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .calendar-card:hover {
          box-shadow: 0 15px 45px rgba(0,0,0,0.7), 0 0 20px var(--accent-glow);
          transform: translateY(-5px);
        }

        .fc {
          color: var(--text-color);
        }
        .fc-toolbar {
          margin-bottom: 20px !important;
          flex-wrap: wrap;
        }
        .fc .fc-toolbar-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--accent-glow);
          text-shadow: none;
        }
        .fc-button-primary {
          background-color: transparent !important;
          border: 1px solid var(--border-color) !important;
          color: var(--text-color) !important;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          transition: all 0.2s ease-in-out;
          border-radius: 8px;
          padding: 8px 15px;
        }
        .fc-button-primary:hover {
          background-color: var(--accent-glow) !important;
          border-color: var(--accent-glow) !important;
          color: var(--bg-color) !important;
          transform: translateY(-2px);
        }
        .fc-daygrid-day-number {
          color: var(--text-color);
          font-weight: 600;
        }
        .fc-day-today {
          background-color: rgba(0, 224, 255, 0.1) !important;
          border-radius: 8px;
        }
        .fc-daygrid-day {
          border-color: var(--border-color) !important;
        }

        /* Event class names (ensure consistency with getSportClassName) */
        .event-f1 { background-color: var(--f1-event-color); }
        .event-motogp { background-color: var(--motogp-event-color); }
        .event-wec { background-color: var(--wec-event-color); }
        .event-cricket { background-color: var(--cricket-event-color); }
        .event-football { background-color: var(--football-event-color); }
        .event-e-sports { background-color: var(--e-sports-event-color); }
        .event-americanfootball { background-color: var(--americanfootball-event-color); }
        .event-baseball { background-color: var(--baseball-event-color); }
        .event-hockey { background-color: var(--hockey-event-color); }
        .event-soccer { background-color: var(--soccer-event-color); }

        .fc-daygrid-event {
          color: #fff !important;
          font-weight: 500;
          font-size: 0.8rem;
          border-radius: 6px;
          padding: 4px 8px;
          margin-bottom: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          border: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fc-daygrid-event:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px currentColor;
          cursor: pointer;
        }
        /* Individual sport event hover glows */
        .event-f1:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--f1-event-color); }
        .event-motogp:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--motogp-event-color); }
        .event-wec:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--wec-event-color); }
        .event-cricket:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--cricket-event-color); }
        .event-football:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--football-event-color); }
        .event-e-sports:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--e-sports-event-color); }
        .event-americanfootball:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--americanfootball-event-color); }
        .event-baseball:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--baseball-event-color); }
        .event-hockey:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--hockey-event-color); }
        .event-soccer:hover { box-shadow: 0 6px 15px rgba(0,0,0,0.7), 0 0 15px var(--soccer-event-color); }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .filter-container {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
          margin-bottom: 30px;
          justify-content: center;
          align-items: center;
        }
        .filter-label {
          display: inline-flex;
          cursor: pointer;
          position: relative;
        }

        .sport-icon-box {
          width: 55px;
          height: 55px;
          border-radius: 12px;
          background-color: var(--card-bg);
          border: 2px solid var(--border-color);
          transition: all 0.2s ease-in-out;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          background-size: 60%;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        .sport-icon-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }

        .filter-label input[type="checkbox"]:checked + .sport-icon-box {
          border-color: var(--accent-glow);
          box-shadow: 0 0 15px var(--accent-glow), 0 0 25px var(--accent-glow);
          transform: scale(1.1) translateY(-5px);
        }

        /* Base64 SVG Icons for each sport */
        .sport-icon-f1 {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23E10600' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 2l-6 6h4l2-2 6 6h-4l2 2 4 4h2l2 2 2 2h-2l-2-2-2-2-2-2h2l-2-2-6-6zM14 6l-6 6-2-2 6-6z'/%3E%3C/svg%3E");
        }
        .sport-icon-motogp {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A60C2C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 18c-2.4 0-4.8-.8-6.7-2.3C11.4 14.2 10 12.3 10 10V6c0-2.2-.9-4.2-2.3-5.7C6.2 1.9 4 3 4 5.5v5.5c0 1.6.8 3.1 2.2 4.1L12 22l6.8-5.4c1.4-1.1 2.2-2.6 2.2-4.1V10c0-2.2-.9-4.2-2.3-5.7C17.7 2.2 15.6 1 13.5 1S9.3 2.2 7.7 3.7c-1.4 1.5-2.2 3.5-2.2 5.8V10c0 1.6.8 3.1 2.2 4.1L12 22l6.8-5.4c1.4-1.1 2.2-2.6 2.2-4.1z'/%3E%3C/svg%3E");
        }
        .sport-icon-wec {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23004D7C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 2l-6 6h4l2-2 6 6h-4l2 2 4 4h2l2 2 2 2h-2l-2-2-2-2-2-2h2l-2-2-6-6zM14 6l-6 6-2-2 6-6z'/%3E%3C/svg%3E");
        }
        .sport-icon-cricket {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233C833D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10.12 2.88a.997.997 0 0 0-1.41 0l-7 7a.997.997 0 0 0 0 1.41l7 7a.997.997 0 0 0 1.41 0L17 10.41V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-4.59l-7-7zM20 18h-2V6h2v12zM9 10.41l-5.59-5.59L9 2.41l5.59 5.59L9 10.41zM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'/%3E%3C/svg%3E");
        }
        .sport-icon-football {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 2c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z' fill='%23121212'/%3E%3Cpath d='M12 2c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z' fill='%23d1d1d1'/%3E%3Cpath d='M12 2l-6 6L12 12l6-6-6-6z' fill='%23121212'/%3E%3Cpath d='M12 12l6-6-6-6-6 6z' fill='%23121212'/%3E%3Cpath d='M12 12l-6-6-6 6 6 6z' fill='%23d1d1d1'/%3E%3Cpath d='M12 12l6 6-6 6-6-6z' fill='%23121212'/%3E%3Cpath d='M12 12l-6 6-6-6 6-6z' fill='%23121212'/%3E%3Cpath d='M12 12l6-6-6 6 6 6z' fill='%23121212'/%3E%3C/svg%3E");
          background-size: 70%;
        }
        .sport-icon-e-sports {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239b59b6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'/%3E%3Cpath d='M12 10l-4 4-2-2m6-2l-2 2-4-4'/%3E%3C/svg%3E");
        }
        .sport-icon-americanfootball {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d35400' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 10L12 2l-6 8 6 8 6-8z'/%3E%3Cpath d='M12 2v20'/%3E%3Cpath d='M12 20l4-4-4-4-4 4 4 4z'/%3E%3C/svg%3E");
        }
        .sport-icon-baseball {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233498db' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'/%3E%3Cpath d='M12 22s-2-2-4-2-4 2-4 2c0-2-2-4-2-4s2-2 4-2c2 0 4-2 4-2s2 2 4 2c2 0 4 2 4 2s-2 2-4 2-4-2-4-2z'/%3E%3C/svg%3E");
        }
        .sport-icon-hockey {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e74c3c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 2l-6 6h4l2-2 6 6h-4l2 2 4 4h2l2 2 2 2h-2l-2-2-2-2-2-2h2l-2-2-6-6zM14 6l-6 6-2-2 6-6z'/%3E%3C/svg%3E");
        }
        .sport-icon-soccer {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232ecc71' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 2c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z' fill='%23121212'/%3E%3Cpath d='M12 2c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z' fill='%23d1d1d1'/%3E%3Cpath d='M12 2l-6 6L12 12l6-6-6-6z' fill='%23121212'/%3E%3Cpath d='M12 12l6-6-6-6-6 6z' fill='%23121212'/%3E%3Cpath d='M12 12l-6-6-6 6 6 6z' fill='%23d1d1d1'/%3E%3Cpath d='M12 12l6 6-6 6-6-6z' fill='%23121212'/%3E%3Cpath d='M12 12l-6 6-6-6 6-6z' fill='%23121212'/%3E%3Cpath d='M12 12l6-6-6 6 6 6z' fill='%23121212'/%3E%3C/svg%3E");
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--modal-bg);
          color: var(--text-color);
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
          width: 90%;
          max-width: 500px;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-color);
          cursor: pointer;
        }

        .modal-body p {
          margin: 8px 0;
        }
        `}
      </style>
      <div className="header">
        <h1>Multi‑Sport Events Calendar</h1>
        <p>A global events calendar for all your favorite sports.</p>
      </div>
      <div className="calendar-card">
        <SportsCalendar />
      </div>
    </div>
  );
}
