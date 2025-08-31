# AI-Hub

AI-Hub is a full-stack AI-powered document management platform. It allows users to create documents, automatically generate summaries and tags, perform semantic search, ask team Q&A, and track version history.

---

## 🚀 Features
--------------------------------------------------------
- **User Authentication:** Secure login and registration with JWT.
- **Document Management:**
  - Create, edit, and delete documents
  - Auto-summary generation
  - Auto-tagging
- **Semantic Search:** Find documents using natural language queries.
- **Team Q&A:** Ask questions and get answers from team members.
- **Version History:** Track changes to documents over time.

---

## 📂 Project Structure
-------------------------------------------------------
AI-Hub/
├── client/ # React frontend
├── server/ # Node.js backend
├── .env.example # Sample environment variables
└── README.md

💻 Tech Stack
-------------------------------------------------------
Frontend: React, HTML, CSS, JavaScript
Backend: Node.js, Express
Database: MongoDB
AI Integration: Google Gemini API
Authentication: JWT

---

## ⚙️ Setup Instructions
------------------------------------------------------
1. Clone the repository:

IN bash 
git clone https://github.com/yourusername/AI-Hub.git 
cd AI-Hub

2. Create your .env file:

IN bash
cp .env.example .env

3. Fill in your real keys in .env:

MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000

5. Install dependencies:

Backend:
cd server
npm install

Frontend:
cd ../client
npm install

6.Run the project:

Backend:
cd ../server
npm run dev

Frontend:
cd ../client
npm start
----------------------------------------------------------------------------------------------



🎬 Demo Video
-------------------------------------------------------
The demo video showcases the full workflow:
User login → Create document → Auto-summary + tags
Semantic search
Team Q&A
Version history

Create and manage documents with automatic summaries and smart tagging
Search semantically using natural language queries
Collaborate through team Q&A for knowledge sharing
Track version history to monitor document changes over time

📌 Version History
v1.0 – Initial demo release with full functionality showcased in demo video.


📌 Note: Due to large file size the video must be downloaded to view.
[Download video](https://github.com/Pooja-AR18/AI-Hub/releases/download/v1.0/Screen.Recording.2025-08-31.220337.mp4)
