// controllers/adminController.js
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Registration Validation Schema
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

// Register Admin
const registerAdmin = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = req.body;

    try {
        let adminExists = await User.findOne({ username });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await User.create({
            username,
            password,
            role: 'Admin'
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                username: admin.username,
                role: admin.role,
                token: generateToken(admin._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Validation Schema
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

// Login Admin
const loginAdmin = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = req.body;

    try {
        const admin = await User.findOne({ username, role: 'Admin' });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                role: admin.role,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Assignments Tagged to Admin
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ admin: req.user._id })
            .populate('user', 'username')
            .populate('admin', 'username')
            .sort({ submittedAt: -1 });

        res.json(assignments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Accept Assignment
const acceptAssignment = async (req, res) => {
    const assignmentId = req.params.id;

    try {
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to modify this assignment' });
        }

        if (assignment.status !== 'Pending') {
            return res.status(400).json({ message: `Assignment already ${assignment.status}` });
        }

        assignment.status = 'Accepted';
        await assignment.save();

        res.json({ message: 'Assignment accepted', assignment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reject Assignment
const rejectAssignment = async (req, res) => {
    const assignmentId = req.params.id;

    try {
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to modify this assignment' });
        }

        if (assignment.status !== 'Pending') {
            return res.status(400).json({ message: `Assignment already ${assignment.status}` });
        }

        assignment.status = 'Rejected';
        await assignment.save();

        res.json({ message: 'Assignment rejected', assignment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getAssignments,
    acceptAssignment,
    rejectAssignment
};
