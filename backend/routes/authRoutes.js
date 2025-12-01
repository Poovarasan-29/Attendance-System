const express = require('express');
const router = express.Router();
const { registerUser, registerManager, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/register/manager', registerManager);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile);

module.exports = router;
