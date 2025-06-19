const express = require('express');
const router = express.Router();
const Product = require('../models/product_model');
const Order = require('../models/order_model');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const Vehicle = require('../models/vehicle_model');

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

// Multer setup for vehicle image uploads
const vehicleStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../Public/vehicles'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const uploadVehicle = multer({ storage: vehicleStorage });

const uploadProductImage = multer({ storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../Public/vehicles'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
}) });

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

router.post('/products/add', isAdmin, uploadProductImage.single('vehicleImage'), async (req, res) => {
    try {
        const { title, price, description, imageUrl, category, brand, type } = req.body;
        if (category === 'vehicle') {
            if (!req.file) throw new Error('Vehicle image is required');
            await Vehicle.create({
                name: title,
                brand,
                price,
                type,
                image: '/vehicles/' + req.file.filename
            });
            return res.redirect('/admin/vehicles');
        } else {
            const product = new Product({
                title,
                price,
                description,
                imageUrl,
                category
            });
            await product.save();
            return res.redirect('/admin/products');
        }
    } catch (error) {
        res.status(500).render('error', { message: error.message || 'Server error' });
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

// List all vehicles (admin view)
router.get('/vehicles', isAdmin, async (req, res) => {
    const vehicles = await Vehicle.find();
    res.render('admin/vehicles', { title: 'Manage Vehicles', vehicles });
});

// Show create vehicle form
router.get('/vehicles/new', isAdmin, (req, res) => {
    res.render('admin/add-vehicle', { title: 'Add Vehicle' });
});

// Handle create vehicle
router.post('/vehicles', isAdmin, uploadVehicle.single('image'), async (req, res) => {
    try {
        const { name, brand, price, type } = req.body;
        if (!req.file) throw new Error('Image is required');
        await Vehicle.create({
            name,
            brand,
            price,
            type,
            image: '/vehicles/' + req.file.filename
        });
        req.flash('success', 'Vehicle added');
        res.redirect('/admin/vehicles');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/admin/vehicles/new');
    }
});

// Show edit vehicle form
router.get('/vehicles/:id/edit', isAdmin, async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.redirect('/admin/vehicles');
    res.render('admin/edit-vehicle', { title: 'Edit Vehicle', vehicle });
});

// Handle edit vehicle
router.post('/vehicles/:id', isAdmin, uploadVehicle.single('image'), async (req, res) => {
    try {
        const { name, brand, price, type } = req.body;
        const update = { name, brand, price, type };
        if (req.file) update.image = '/vehicles/' + req.file.filename;
        await Vehicle.findByIdAndUpdate(req.params.id, update);
        req.flash('success', 'Vehicle updated');
        res.redirect('/admin/vehicles');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/admin/vehicles/' + req.params.id + '/edit');
    }
});

// Handle delete vehicle
router.post('/vehicles/:id/delete', isAdmin, async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        req.flash('success', 'Vehicle deleted');
    } catch (err) {
        req.flash('error', err.message);
    }
    res.redirect('/admin/vehicles');
});

module.exports = router; 