const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, getAllEmployees, getDepartments, registerManager } = require('../controllers/authController');
const { protect, manager } = require('../middleware/authMiddleware');

router.post('/auth/register', registerUser);
router.post('/auth/register/manager', registerManager);
router.post('/auth/login', authUser);
router.get('/auth/me', protect, getUserProfile);

// User management routes
router.get('/users', protect, manager, getAllEmployees);
router.get('/users/departments', protect, getDepartments);

module.exports = router;
