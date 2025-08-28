# 👋 Multi-Sport Events Calendar

---

## 🚀 Overview  
The **Multi-Sport Events Calendar** is a dynamic web application designed to centralize and display sporting events from a diverse range of categories in an interactive calendar format. Users can effortlessly explore events by their respective sport, delve into comprehensive event details, and remain thoroughly updated on upcoming competitions.  

This project seamlessly integrates a **React-based frontend** to deliver a highly engaging and responsive user experience, coupled with a **robust Node.js/Express backend** for efficient API services and streamlined database management.  

---

## ✨ Key Features  

- 📅 **Interactive Calendar** – Navigate effortlessly through months and days to explore a comprehensive view of events.  
- 🎯 **Sport Filtering** – Customize your calendar view by displaying only the sports that matter most to you.  
- ℹ️ **Event Details Modal** – Gain in-depth insights into each event, including its title, date, venue, category, and data source.  
- 🔗 **API Integration** – Stays up-to-date with real-time event data synchronized from various external sports APIs.  
- 🗄️ **Database Support** – All event information is securely stored and efficiently managed using MongoDB.  
- 📱 **Responsive Design** – Enjoy an optimal and visually appealing experience across all devices, from desktops to mobile phones.  

---

## 🛠️ Tech Stack  

### **Frontend**  
- ⚛️ React.js – A leading JavaScript library for crafting engaging user interfaces.  
- 📆 FullCalendar – A robust JavaScript library for highly customizable and interactive calendars.  
- 🌐 Axios – A widely used promise-based HTTP client for seamless API requests.  
- 🎨 HTML5 & CSS3 – The foundational languages for structuring and styling the web interface.  

### **Backend**  
- 🟢 Node.js – The JavaScript runtime environment powering the server-side logic.  
- 🚀 Express.js – A fast, minimalist web framework for building efficient APIs with Node.js.  
- 🍃 MongoDB – A flexible NoSQL database for scalable and efficient data storage.  
- 📝 Mongoose – An elegant ODM (Object Data Modeling) library for MongoDB and Node.js.  

### **Other Tools & Libraries**  
- 🔄 Nodemon – A development utility that automatically restarts the Node.js server upon file changes.  
- 🔑 Dotenv – Manages environment variables, keeping sensitive information secure and separate.  
- 🌍 Axios / Node-Fetch – Used for making HTTP requests in the backend, primarily for external API integrations.  

---

## 🚀 Getting Started  

### ✅ Prerequisites  
Before you begin, ensure you have the following installed:  

- [Node.js & npm](https://nodejs.org/)  
- [MongoDB](https://www.mongodb.com/) (locally or via MongoDB Atlas)  

---

### ⚙️ Installation  

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-username/sports-calendar.git
   cd sports-calendar

2. **Create a .env file inside the server directory and add the following:**
   ```bash
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/sports_calendar_db?retryWrites=true&w=majority&appName=Cluster0
   PORT=4000
   NODE_ENV=development
   THESPORTSDB_API_KEY=2 # Free public key is '2'
   API_SPORTS_KEY=your_api_sports_key_here
   RAPIDAPI_KEY=your_rapidapi_key_here
   SPORTRADAR_API_KEY=your_sportradar_api_key_here

### 💡 Usage

- 📅 Browse the Calendar: See an interactive calendar populated with events.
- 🎯 Filter Events: Toggle sport icons at the top to filter specific sports.
- ℹ️ View Details: Click on events to view more info in a modal popup.

### 📈 Future Enhancements

- 🔐 User Authentication & Personalized Calendars
- 📝 Event Creation and Editing
- 🔔 Push Notifications for Upcoming Matches
- 🔍 Advanced Search & Filtering (date range, venue, keywords)
- 🌍 Multi-Time Zone Support

### 📜 License

- This project is licensed under the MIT License.
See the LICENSE
 file for details.

### 📧 Contact & Support
- 💬 Open an issue on this GitHub repository.
- 🍴 Fork and submit a pull request to contribute.


