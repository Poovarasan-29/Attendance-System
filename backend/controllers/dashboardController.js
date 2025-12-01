const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @route   GET /api/dashboard/employee
const getEmployeeStats = async (req, res) => {
    try {
        const today = new Date();
        const formatDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

        const startOfMonth = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        const endOfMonth = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        const todayDate = formatDate(today);

        const monthlyAttendance = await Attendance.find({
            userId: req.user._id,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ date: -1 });

        const todayStatus = await Attendance.findOne({ userId: req.user._id, date: todayDate });

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const last7Days = await Attendance.find({
            userId: req.user._id,
            date: { $gte: sevenDaysAgo.toISOString().split('T')[0], $lte: todayDate }
        }).sort({ date: -1 });

        const presentDays = monthlyAttendance.length;
        const daysElapsed = today.getDate();
        const absentDays = Math.max(0, daysElapsed - presentDays);

        const summary = {
            present: presentDays,
            absent: absentDays,
            late: monthlyAttendance.filter(a => a.status === 'late').length,
            halfDay: monthlyAttendance.filter(a => a.status === 'half-day').length,
            totalHours: parseFloat(monthlyAttendance.reduce((acc, curr) => acc + (curr.totalHours || 0), 0).toFixed(2)),
            todayStatus: todayStatus || { status: 'not-marked' },
            recentAttendance: last7Days
        };

        res.json(summary);
    } catch (error) {
        console.error('Get employee stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/dashboard/manager
const getManagerStats = async (req, res) => {
    try {
        const today = new Date();
        const formatDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const todayDate = formatDate(today);

        const totalEmployees = await User.countDocuments({ role: 'employee' });
        const todayAttendance = await Attendance.find({ date: todayDate })
            .populate('userId', 'name email employeeId department');

        const presentCount = todayAttendance.filter(a => ['present', 'late', 'half-day'].includes(a.status)).length;
        const lateCount = todayAttendance.filter(a => a.status === 'late').length;
        const absentCount = totalEmployees - presentCount;

        const allEmployees = await User.find({ role: 'employee' });
        const presentEmployeeIds = todayAttendance.map(a => a.userId._id.toString());
        const absentEmployees = allEmployees.filter(emp => !presentEmployeeIds.includes(emp._id.toString()));

        const lateEmployees = todayAttendance.filter(a => a.status === 'late').map(a => ({
            _id: a.userId._id,
            name: a.userId.name,
            employeeId: a.userId.employeeId,
            department: a.userId.department,
            checkInTime: a.checkInTime
        }));

        const weeklyTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayAttendance = await Attendance.find({ date: dateStr });
            const dayPresentCount = dayAttendance.filter(a => ['present', 'late', 'half-day'].includes(a.status)).length;

            weeklyTrend.push({
                date: dateStr,
                present: dayPresentCount,
                absent: totalEmployees - dayPresentCount,
                late: dayAttendance.filter(a => a.status === 'late').length
            });
        }

        const departments = {};
        todayAttendance.forEach(a => {
            const dept = a.userId.department;
            if (!departments[dept]) {
                departments[dept] = { present: 0, total: 0 };
            }
            departments[dept].present++;
        });

        allEmployees.forEach(emp => {
            if (!departments[emp.department]) {
                departments[emp.department] = { present: 0, total: 0 };
            }
            departments[emp.department].total++;
        });

        const departmentStats = Object.keys(departments).map(dept => ({
            department: dept,
            present: departments[dept].present,
            total: departments[dept].total,
            absent: departments[dept].total - departments[dept].present
        }));

        res.json({
            totalEmployees,
            todayStats: {
                present: presentCount,
                absent: absentCount,
                late: lateCount
            },
            absentEmployees: absentEmployees.map(emp => ({
                _id: emp._id,
                name: emp.name,
                employeeId: emp.employeeId,
                department: emp.department,
                email: emp.email
            })),
            lateEmployees,
            weeklyTrend,
            departmentStats,
            allEmployeesList: allEmployees.map(emp => ({
                _id: emp._id,
                name: emp.name,
                employeeId: emp.employeeId,
                department: emp.department,
                email: emp.email,
                doj: emp.createdAt 
            }))
        });
    } catch (error) {
        console.error('Get manager stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getEmployeeStats, getManagerStats };
