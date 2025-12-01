# Employee Attendance System

A full-stack Employee Attendance System built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows employees to mark their attendance and managers to view reports and manage their teams.

## Features

*   **Employee Dashboard**: Check-in/Check-out, view attendance history, and monthly summary.
*   **Manager Dashboard**: View team attendance, employee stats, and export reports.
*   **Authentication**: Secure login and registration for employees and managers.
*   **Real-time Updates**: Instant status updates on dashboards.
*   **Responsive Design**: Modern UI built with Tailwind CSS.

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   **Node.js**: Installed on your machine.
*   **MongoDB**: A local installation or a MongoDB Atlas account.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ujvalujval/Attendance-System
cd Attendance
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

You need to set up environment variables for both the backend and frontend.

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_key_here
```

*   `PORT`: The port on which the backend server will run (default: 5000).
*   `MONGO_URI`: Your MongoDB connection string (Local or Atlas).
*   `JWT_SECRET`: A secret key used for signing JSON Web Tokens.

### Frontend (.env)

Create a `.env` file in the `frontend` directory with the following variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

*   `VITE_API_BASE_URL`: The base URL of your backend API.

## Manager Registration

To create a manager account, you need to use the following API endpoint since there is no public registration page for managers.

**Endpoint:** `POST https://attendance-system-bf7b.onrender.com/api/auth/register/manager`

**JSON Body:**

```json
{
    "name": "Manager Name",
    "email": "manager@example.com",
    "password": "securepassword",
    "department": "Engineering"
}
```

## How to Run

To run the application, you need to start both the backend and frontend servers.

### 1. Start the Backend Server

Open a terminal, navigate to the `backend` directory, and run:

```bash
cd backend
npm start
```

The server should start on `http://localhost:5000` (or your specified port).

### 2. Start the Frontend Development Server

Open a new terminal, navigate to the `frontend` directory, and run:

```bash
cd frontend
npm run dev
```

The frontend application will typically run on `http://localhost:5173`. Open this URL in your browser to use the application.

## Project Structure

```
Attendance/
├── backend/            # Node.js/Express Backend
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware (auth, etc.)
│   └── server.js       # Entry point
│
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── layouts/    # Page layouts
│   │   ├── pages/      # Application pages
│   │   ├── store/      # Redux store and slices
│   │   └── App.jsx     # Main component
│   └── index.html
│
└── README.md
```
