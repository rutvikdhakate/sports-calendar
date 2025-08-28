Multi-Sport Events Calendar 👋
🚀 Overview
The Multi-Sport Events Calendar is a dynamic web application designed to centralize and display sporting events from a diverse range of categories in an interactive calendar format. Users can effortlessly explore events by their respective sport, delve into comprehensive event details, and remain thoroughly updated on upcoming competitions.

This project seamlessly integrates a React-based frontend to deliver a highly engaging and responsive user experience, coupled with a robust Node.js/Express backend for efficient API services and streamlined database management.

✨ Key Features
📅 Interactive Calendar – Navigate effortlessly through months and days to explore a comprehensive view of events.

🎯 Sport Filtering – Customize your calendar view by displaying only the sports that matter most to you.

ℹ️ Event Details Modal – Gain in-depth insights into each event, including its title, date, venue, category, and data source.

🔗 API Integration – Stays up-to-date with real-time event data synchronized from various external sports APIs.

🗄️ Database Support – All event information is securely stored and efficiently managed using MongoDB.

📱 Responsive Design – Enjoy an optimal and visually appealing experience across all devices, from desktops to mobile phones.

🛠️ Tech Stack
This project is built leveraging a modern and powerful web development stack:

Frontend:
React.js – A leading JavaScript library for crafting engaging user interfaces.

FullCalendar – A robust JavaScript library for highly customizable and interactive calendars.

Axios – A widely used promise-based HTTP client for seamless API requests.

HTML5 & CSS3 – The foundational languages for structuring and styling the web interface.

Backend:
Node.js – The JavaScript runtime environment powering the server-side logic.

Express.js – A fast, minimalist web framework for building efficient APIs with Node.js.

MongoDB – A flexible NoSQL database for scalable and efficient data storage.

Mongoose – An elegant ODM (Object Data Modeling) library for MongoDB and Node.js.

Other Tools & Libraries:
Nodemon – A development utility that automatically restarts the Node.js server upon file changes.

Dotenv – Manages environment variables, keeping sensitive information secure and separate.

Axios/Node-Fetch – Used for making HTTP requests in the backend, primarily for external API integrations.

🚀 Getting Started
Follow these steps to set up and run the Multi-Sport Events Calendar on your local machine.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js & npm: Download and install from nodejs.org.

MongoDB: Install locally or set up a cloud instance (e.g., MongoDB Atlas).

Installation
Clone the repository:

git clone https://github.com/your-username/sports-calendar.git
cd sports-calendar

Setup the Backend:

cd server
npm install

📝 Important: Create a .env file in the server directory. Populate it with your MongoDB connection URI and any necessary API keys from the external sports services (e.g., THESPORTSDB_API_KEY, API_SPORTS_KEY, RAPIDAPI_KEY, SPORTRADAR_API_KEY).

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/sports_calendar_db?retryWrites=true&w=majority&appName=Cluster0
PORT=4000
NODE_ENV=development
THESPORTSDB_API_KEY=2 # Free public key is '2'
API_SPORTS_KEY=your_api_sports_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
SPORTRADAR_API_KEY=your_sportradar_api_key_here 

Setup the Frontend:

cd ../web
npm install

▶️ Running the Application
To get the application up and running, you'll need to start both the backend server and the frontend development server.

Start the Backend Server:
Navigate to the server directory:

cd sports-calendar/server

Execute the development script:

npm run dev

You should see console output indicating that MongoDB is connected and the server is running on http://localhost:4000. Keep this terminal window open.

Start the Frontend Application:
Navigate to the web directory:

cd ../web

Execute the start script:

npm start

This command will launch the React development server and automatically open the application in your default web browser, typically at 👉 http://localhost:3000.

💡 Usage
Browse the Calendar: Upon launching, you'll see an interactive calendar populated with sporting events.

Filter Events by Sport: Utilize the distinct sport icons at the top of the calendar to dynamically filter events. Click an icon to toggle the visibility of its corresponding sport.

View Event Details: Click on any event displayed on the calendar to reveal a modal containing comprehensive details about that specific event.

📈 Future Enhancements
We envision several exciting additions to enhance the functionality and user experience of the Multi-Sport Events Calendar:

User Authentication & Personalized Calendars: Implement user login/registration to allow for personalized event tracking and custom calendar views.

Event Creation and Editing: Empower users to add, modify, or delete their own custom events directly through the application.

Push Notifications for Upcoming Matches: Integrate notification services to alert users about impending events they are interested in.

Advanced Search and Filtering: Develop more sophisticated search capabilities and filtering options (e.g., by date range, venue, category keywords).

Multi-Time Zone Support: Provide options for users to view events in their local time zones, regardless of the event's origin time.

📜 License
This project is proudly licensed under the MIT License. For more details, see the LICENSE file in the root of the repository.

📧 Contact & Support
If you have any questions, encounter issues, or would like to contribute, please feel free to:

Open an issue on this GitHub repository.

Fork the repository and submit a pull request.
