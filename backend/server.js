const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const attendanceRoutes = require('./routes/attendanceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', userRoutes); // Handles /api/auth/* and /api/users/*
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/data', dataRoutes); // Public data endpoints

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
