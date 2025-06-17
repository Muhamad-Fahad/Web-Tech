const express = require('express');
const router = express.Router();
const Product = require('../models/product_model');
const Order = require('../models/order_model');
const mongoose = require('mongoose');

// Middleware to initialize cart in session if it doesn't exist
const initCart = (req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
};

// Add to cart
router.post('/add/:productId', initCart, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('back');
        }

        const cartItem = req.session.cart.find(item => item.productId.toString() === req.params.productId);
        
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            req.session.cart.push({
                productId: product._id,
                title: product.title,
                price: product.price,
                quantity: 1
            });
        }

        req.flash('success', 'Product added to cart');
        res.redirect('/cart');
    } catch (error) {
        req.flash('error', 'Error adding product to cart');
        res.redirect('back');
    }
});

// View cart
router.get('/', initCart, (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('cart', { cart, total });
});

// Update cart item quantity
router.post('/update/:productId', initCart, (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = req.session.cart.find(item => item.productId.toString() === req.params.productId);
        
        if (cartItem) {
            cartItem.quantity = parseInt(quantity);
            if (cartItem.quantity <= 0) {
                req.session.cart = req.session.cart.filter(item => item.productId.toString() !== req.params.productId);
            }
        }
        
        req.flash('success', 'Cart updated');
        res.redirect('/cart');
    } catch (error) {
        req.flash('error', 'Error updating cart');
        res.redirect('/cart');
    }
});

// Remove item from cart
router.post('/remove/:productId', initCart, (req, res) => {
    try {
        req.session.cart = req.session.cart.filter(item => item.productId.toString() !== req.params.productId);
        req.flash('success', 'Item removed from cart');
        res.redirect('/cart');
    } catch (error) {
        req.flash('error', 'Error removing item from cart');
        res.redirect('/cart');
    }
});

// Checkout page
router.get('/checkout', initCart, (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        req.flash('error', 'Your cart is empty');
        return res.redirect('/cart');
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('checkout', { cart, total });
});

// Place order
router.post('/place-order', initCart, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const cart = req.session.cart || [];
        
        if (cart.length === 0) {
            req.flash('error', 'Your cart is empty');
            return res.redirect('/cart');
        }

        // Validate required fields
        if (!name || !phone || !address) {
            req.flash('error', 'Please fill in all required fields');
            return res.redirect('/cart/checkout');
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = new Order({
            user: {
                userId: req.session.user.id,
                name,
                phone,
                address
            },
            items: cart.map(item => ({
                product: item.productId,
                title: item.title,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: total,
            status: 'pending'
        });

        const savedOrder = await order.save();
        req.session.cart = []; // Clear cart
        req.flash('success', 'Order placed successfully!');
        res.redirect('/order-success');
    } catch (error) {
        console.error('Order placement error:', error);
        req.flash('error', 'Error placing order. Please try again.');
        res.redirect('/cart/checkout');
    }
});

// Test route to create an order and verify collection
router.get('/test-order', async (req, res) => {
    try {
        const testOrder = new Order({
            user: {
                name: "Test User",
                phone: "1234567890",
                address: "Test Address"
            },
            items: [{
                product: new mongoose.Types.ObjectId(),
                title: "Test Product",
                quantity: 1,
                price: 99.99
            }],
            totalPrice: 99.99,
            status: 'pending'
        });

        console.log('Attempting to create test order...');
        const savedOrder = await testOrder.save();
        console.log('Test order saved:', savedOrder);
        
        res.json({ 
            message: 'Test order created successfully',
            order: savedOrder
        });
    } catch (error) {
        console.error('Error creating test order:', error);
        res.status(500).json({ 
            message: 'Error creating test order',
            error: error.message
        });
    }
});

// Route to manually create orders collection
router.get('/create-collection', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        console.log('Creating orders collection...');
        
        // Create the collection
        await db.createCollection('orders');
        console.log('Orders collection created');
        
        // Create indexes
        await db.collection('orders').createIndex({ createdAt: -1 });
        console.log('Orders collection index created');
        
        res.json({ message: 'Orders collection created successfully' });
    } catch (error) {
        console.error('Error creating orders collection:', error);
        res.status(500).json({ 
            message: 'Error creating orders collection',
            error: error.message
        });
    }
});

module.exports = router; 