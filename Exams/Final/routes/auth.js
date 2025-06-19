const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('register', { 
                error: 'Username or email already exists',
                username,
                email
            });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        // Do not set session here. Redirect to login page with a success message.
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/auth/login');
    } catch (error) {
        res.render('register', { 
            error: 'Error creating user',
            username: req.body.username,
            email: req.body.email
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { 
                error: 'Invalid email or password',
                email
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { 
                error: 'Invalid email or password',
                email
            });
        }

        // Set session with correct _id and isAdmin status
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        };

        // Redirect based on user type
        if (user.isAdmin) {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.render('login', { 
            error: 'Error logging in',
            email: req.body.email
        });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/auth/login');
    });
});

// Get login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
});

// Get register page
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', { error: null });
});

module.exports = router; 