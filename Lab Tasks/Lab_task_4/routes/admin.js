const express = require('express');
const router = express.Router();
const Product = require('../models/product_model');
const Order = require('../models/order_model');
const User = require('../models/User');

// Admin middleware
const isAdmin = async (req, res, next) => {
    // Check if user is logged in
    if (!req.session.user) {
        req.flash('error', 'Please login to access admin panel');
        return res.redirect('/auth/login');
    }

    // Check if user has admin privileges in session
    if (!req.session.user.isAdmin) {
        req.flash('error', 'Access denied. Admin privileges required.');
        return res.redirect('/');
    }
    
    try {
        // Double check admin status in database
        const user = await User.findById(req.session.user._id);
        if (!user || !user.isAdmin) {
            // If user is not admin in database, update session
            req.session.user.isAdmin = false;
            req.flash('error', 'Access denied. Admin privileges required.');
            return res.redirect('/');
        }
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        req.flash('error', 'An error occurred while checking admin privileges');
        res.redirect('/');
    }
};

// Admin dashboard
router.get('/', isAdmin, async (req, res) => {
    try {
        const products = await Product.find();
        const orders = await Order.find().populate('user');
        res.render('admin/dashboard', { products, orders });
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

// Product management routes
router.get('/products', isAdmin, async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/products', { products });
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

router.get('/products/add', isAdmin, (req, res) => {
    res.render('admin/add-product');
});

router.post('/products/add', isAdmin, async (req, res) => {
    try {
        const { title, price, description, imageUrl, category } = req.body;
        const product = new Product({
            title,
            price,
            description,
            imageUrl,
            category
        });
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

router.get('/products/edit/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/edit-product', { product });
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

router.post('/products/edit/:id', isAdmin, async (req, res) => {
    try {
        const { title, price, description, imageUrl, category } = req.body;
        await Product.findByIdAndUpdate(req.params.id, {
            title,
            price,
            description,
            imageUrl,
            category
        });
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

router.post('/products/delete/:id', isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

// Order management routes
router.get('/orders', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user');
        res.render('admin/orders', { orders });
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

router.post('/orders/update-status/:id', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.redirect('/admin/orders');
    } catch (error) {
        res.status(500).render('error', { message: 'Server error' });
    }
});

module.exports = router; 