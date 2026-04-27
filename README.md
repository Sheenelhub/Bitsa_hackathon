# BITSA Club Platform

A full-stack student platform built with **Next.js (frontend)** and **Express + MongoDB (backend)**.
The system allows students to interact with events, blogs, galleries, and announcements in a centralized platform.


##  Features

 User authentication (JWT-based)
 Blog posts & announcements
 Events management
 Image gallery uploads
 Contact system
 Admin dashboard


##  Tech Stack

Frontend: Next.js, React
Backend: Node.js, Express
Database: MongoDB (Mongoose)
 Authentication: JWT + Cookies


# Installation & Setup

# 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Install dependencies

```bash
npm install
cd backend && npm install
```


##  Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

##  Running the App

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
npm run dev
```

##  Access the App

Open your browser:

```
http://localhost:3000
```


##  Notes

* Ensure MongoDB is running or use MongoDB Atlas
* Replace environment variables with your own values


##  Author

Developed and customized by Shereen


