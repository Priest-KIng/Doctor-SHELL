# Doctor-Patient Chat Application

A full-stack MERN application that enables communication between doctors and patients.

## Features
- Doctor can view all patients
- Patient can view and chat with doctors
- Real-time chat functionality
- Secure authentication
- User role management (Doctor/Patient)

## Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Real-time Communication: Socket.io

## Project Structure
```
doctor-patient-chat/
├── client/             # React frontend
├── server/             # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to server directory: `cd server`
2. Install dependencies: `npm install`
3. Create .env file with required environment variables
4. Start server: `npm start`

### Frontend Setup
1. Navigate to client directory: `cd client`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Environment Variables
Create a .env file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
``` 