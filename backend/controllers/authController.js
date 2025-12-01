const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, employeeId, department } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        employeeId,
        department,
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
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
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
};

// @desc    Get all employees
// @route   GET /api/users
// @access  Private/Manager
const getAllEmployees = async (req, res) => {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
};

// @desc    Get all departments
// @route   GET /api/users/departments
// @access  Private
const getDepartments = async (req, res) => {
    const users = await User.find({});
    const departments = [...new Set(users.map(user => user.department))];
    res.json(departments);
};

module.exports = { registerUser, authUser, getUserProfile, getAllEmployees, getDepartments };
