const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Helper function to generate next sequential employeeId
const generateNextEmployeeId = async () => {
    const lastUser = await User.findOne({ employeeId: /^EMP\d+$/ })
        .sort({ employeeId: -1 })
        .limit(1);

    if (!lastUser) {
        return 'EMP001';
    }

    // Extract the number from the employeeId (e.g., "EMP001" -> 1)
    const lastNumber = parseInt(lastUser.employeeId.replace('EMP', ''));
    const nextNumber = lastNumber + 1;

    return `EMP${String(nextNumber).padStart(3, '0')}`;
};

// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const employeeId = await generateNextEmployeeId();
        const user = await User.create({
            name,
            email,
            password,
            department,
            employeeId,
            role: 'employee', 
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                employeeId: user.employeeId,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @route   POST /api/auth/register/manager
const registerManager = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const employeeId = await generateNextEmployeeId();

        const user = await User.create({
            name,
            email,
            password,
            department,
            employeeId,
            role: 'manager', 
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                employeeId: user.employeeId,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Manager registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @route   POST /api/auth/login
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email/employeeId and password' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.findOne({ employeeId: email });
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                employeeId: user.employeeId,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @route   GET /api/auth/me
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                employeeId: user.employeeId,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, registerManager, authUser, getUserProfile };
