// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, uploadAssignment, getAdmins } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');
const { protect } = require('../middleware/authMiddleware');

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Upload Assignment
router.post('/upload', protect, uploadAssignment);

// Get All Admins
router.get('/admins', protect, getAdmins);

module.exports = router;
