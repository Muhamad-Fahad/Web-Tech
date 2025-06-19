const express = require('express');
const router = express.Router();
const Order = require('../models/order_model');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    req.flash('error', 'Access denied. Admin privileges required.');
    res.redirect('/');
};

// Get user's orders (admin only)
router.get('/my-orders', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.session.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product');
        
        res.render('my-orders', { 
            orders,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        req.flash('error', 'Error fetching your orders');
        res.redirect('/');
    }
});

module.exports = router; 