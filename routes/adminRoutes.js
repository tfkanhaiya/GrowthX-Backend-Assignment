// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin Registration
router.post('/register', registerAdmin);

// Admin Login
router.post('/login', loginAdmin);

// Get Assignments Tagged to Admin
router.get('/assignments', protect, admin, getAssignments);

// Accept Assignment
router.post('/assignments/:id/accept', protect, admin, acceptAssignment);

// Reject Assignment
router.post('/assignments/:id/reject', protect, admin, rejectAssignment);

module.exports = router;
