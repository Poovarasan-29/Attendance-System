const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @route   POST /api/attendance/checkin
const checkIn = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const date = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

        const existingAttendance = await Attendance.findOne({ userId, date });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const checkInTime = new Date();
        const checkInHour = checkInTime.getHours();

        // Determine status based on check-in time
        // Late if after 9 AM (09:00)
        let status = 'present';
        if (checkInHour >= 9 && checkInTime.getMinutes() > 0) {
            status = 'late';
        } else if (checkInHour > 9) {
            status = 'late';
        }

        const attendance = await Attendance.create({
            userId,
            date,
            checkInTime,
            status,
        });

        res.status(201).json(attendance);
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ message: 'Server error during check-in' });
    }
};

// @route   POST /api/attendance/checkout
const checkOut = async (req, res) => {
    try {
        const userId = req.user._id;
        const date = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({ userId, date });

        if (!attendance) {
            return res.status(400).json({ message: 'No check-in record found for today' });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        attendance.checkOutTime = new Date();

        // Calculate total hours
        const duration = attendance.checkOutTime - attendance.checkInTime;
        attendance.totalHours = parseFloat((duration / (1000 * 60 * 60)).toFixed(2));

        // Update status to half-day if less than 4 hours
        if (attendance.totalHours < 4) {
            attendance.status = 'half-day';
        }

        await attendance.save();

        res.json(attendance);
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ message: 'Server error during check-out' });
    }
};

// @route   GET /api/attendance/my-history
const getMyHistory = async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/attendance/my-summary
const getMySummary = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

        const attendance = await Attendance.find({
            userId: req.user._id,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const summary = {
            present: attendance.filter(a => a.status === 'present').length,
            absent: attendance.filter(a => a.status === 'absent').length,
            late: attendance.filter(a => a.status === 'late').length,
            halfDay: attendance.filter(a => a.status === 'half-day').length,
            totalHours: parseFloat(attendance.reduce((acc, curr) => acc + (curr.totalHours || 0), 0).toFixed(2))
        };

        res.json(summary);
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/attendance/today
const getTodayStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const date = new Date().toISOString().split('T')[0];
        const attendance = await Attendance.findOne({ userId, date });
        res.json(attendance || { status: 'not-marked' });
    } catch (error) {
        console.error('Get today status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/attendance/all
const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({})
            .populate('userId', 'name email employeeId department')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        console.error('Get all attendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/attendance/employee/:id
const getEmployeeAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.params.id })
            .populate('userId', 'name email employeeId department')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        console.error('Get employee attendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/attendance/summary
const getTeamSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};
        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendance = await Attendance.find(query)
            .populate('userId', 'name email employeeId department');

        const summary = {
            totalRecords: attendance.length,
            present: attendance.filter(a => a.status === 'present').length,
            absent: attendance.filter(a => a.status === 'absent').length,
            late: attendance.filter(a => a.status === 'late').length,
            halfDay: attendance.filter(a => a.status === 'half-day').length,
        };

        res.json(summary);
    } catch (error) {
        console.error('Get team summary error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/attendance/export
const exportAttendance = async (req, res) => {
    try {
        const { startDate, endDate, employeeId } = req.query;

        const query = {};
        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }
        if (employeeId) {
            query.userId = employeeId;
        }

        // Filter by department if provided
        if (req.query.department) {
            const usersInDept = await User.find({ department: req.query.department, role: 'employee' });
            const userIds = usersInDept.map(u => u._id);
            if (query.userId) {
                const isUserInDept = userIds.some(id => id.toString() === query.userId.toString());
                if (!isUserInDept) {
                    return res.status(200).send('Employee ID,Name,Department,Date,Check In,Check Out,Total Hours,Status\n');
                }
            } else {
                query.userId = { $in: userIds };
            }
        }

        const attendance = await Attendance.find(query)
            .populate('userId', 'name email employeeId department')
            .sort({ date: -1 });

        let csv = 'Employee ID,Name,Department,Date,Check In,Check Out,Total Hours,Status\n';

        attendance.forEach(record => {
            const checkIn = record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A';
            const checkOut = record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A';
            const hours = record.totalHours || 0;

            csv += `${record.userId.employeeId},${record.userId.name},${record.userId.department},${record.date},${checkIn},${checkOut},${hours},${record.status}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export attendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/attendance/today-status
const getTodayTeamStatus = async (req, res) => {
    try {
        const now = new Date();
        const date = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        const todayAttendance = await Attendance.find({ date })
            .populate('userId', 'name email employeeId department');

        const allEmployees = await User.find({ role: 'employee' });

        const presentEmployees = todayAttendance.filter(a => a.status === 'present' || a.status === 'late');
        const lateEmployees = todayAttendance.filter(a => a.status === 'late');

        const presentEmployeeIds = todayAttendance.map(a => a.userId._id.toString());
        const absentEmployees = allEmployees.filter(emp => !presentEmployeeIds.includes(emp._id.toString()));

        res.json({
            date,
            totalEmployees: allEmployees.length,
            present: presentEmployees.length,
            absent: absentEmployees.length,
            late: lateEmployees.length,
            presentEmployees: presentEmployees.map(a => ({
                _id: a.userId._id,
                name: a.userId.name,
                employeeId: a.userId.employeeId,
                department: a.userId.department,
                checkInTime: a.checkInTime,
                status: a.status
            })),
            lateEmployees: lateEmployees.map(a => ({
                _id: a.userId._id,
                name: a.userId.name,
                employeeId: a.userId.employeeId,
                department: a.userId.department,
                checkInTime: a.checkInTime
            })),
            absentEmployees: absentEmployees.map(emp => ({
                _id: emp._id,
                name: emp.name,
                employeeId: emp.employeeId,
                department: emp.department
            }))
        });
    } catch (error) {
        console.error('Get today team status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
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
};
