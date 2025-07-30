# 💬 AI Chatbot Web App

A full-stack chatbot application that mimics ChatGPT functionality using **React.js (Frontend)** and **Node.js + Express (Backend)**, powered by **Gemini (Google Generative AI)** and integrated with **Firebase Authentication**.

---

## 🚀 Features Implemented

### 🧠 Chat Functionality

* Chat interface powered by **Gemini AI** via REST API
* Auto-scroll chat interface as messages come in
* Auto-generate chat titles

### 🔐 Authentication

* **Login / Signup** using **Firebase Authentication**
* **JWT token generation** and **backend token verification** using `firebase-admin`

### 🗂️ Sidebar with Chat Management

* View past chats
* **Hover actions**: Rename, Delete, Save (PDF download)
* Sidebar auto-updates with new chats

### 📦 Chat Notes & Search

* Real-time **live search** with text highlight
* Clears search results when text is erased

### 📄 Export to PDF

* Download chat as a **PDF file**
* Shows loading/download indicator

---

## 🧱 Tech Stack

### Frontend (React.js)

* React
* Tailwind CSS
* Firebase SDK
* React Router
* html2pdf.js

### Backend (Node.js + Express)

* Express.js
* CORS, dotenv
* @google/generative-ai (Gemini)
* firebase-admin

---

## 🔐 Firebase Integration

* Firebase used for **Authentication** (email-password)
* Auth token passed from frontend to backend
* Backend uses `firebase-admin` to **verify ID tokens**

---

## 🔄 Future Features

* Persistent chat saving (backend storage or Firestore)
* File Upload Widget: Convert document and download
* Chat retrieval on returning from other pages (e.g., Dashboard)
* More user-friendly error handling (Gemini/Network errors)
* Production Deployment:

  * Frontend: Vercel / Netlify
  * Backend: Render / Railway / Cyclic

---

## 📁 Folder Structure

```
project-root/
├── backend/
│   ├── server.js
│   ├── firebaseAdmin.js
│   └── middleware/
│       └── authMiddleware.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── geminiService.js
│   │   ├── pages/
│   │   └── App.jsx
├── .env
└── package.json
```

---

## 🛠️ Setup Instructions

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📞 Need Help?

Ping @Bhushan Mane for project understanding and contributions. 🎯
