// controllers/userController.js
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

// Register User
const registerUser = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = req.body;

    try {
        let userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            password,
            role: 'User'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
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

// Login User
const loginUser = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload Assignment Validation Schema
const uploadSchema = Joi.object({
    task: Joi.string().max(500).required(),
    admin: Joi.string().required()
});

// Upload Assignment
const uploadAssignment = async (req, res) => {
    const { error } = uploadSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { task, admin } = req.body;

    try {
        const adminUser = await User.findOne({ username: admin, role: 'Admin' });
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const assignment = await Assignment.create({
            user: req.user._id,
            task,
            admin: adminUser._id
        });

        res.status(201).json(assignment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Admins
const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' }).select('-password');
        res.json(admins);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, uploadAssignment, getAdmins };
