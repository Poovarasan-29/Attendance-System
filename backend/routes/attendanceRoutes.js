const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut,
    getMyHistory,
    getMySummary,
    getTodayStatus,
    getAllAttendance,
    getEmployeeAttendance,
    getTeamSummary,
    exportAttendance,
    getTodayTeamStatus
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// Employee routes
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/my-summary', protect, getMySummary);
router.get('/today', protect, getTodayStatus);

// Manager routes
router.get('/all', protect, getAllAttendance);
router.get('/employee/:id', protect, getEmployeeAttendance);
router.get('/summary', protect, getTeamSummary);
router.get('/export', protect, exportAttendance);
router.get('/today-status', protect, getTodayTeamStatus);

module.exports = router;
