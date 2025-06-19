let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// Basic route for testing
router.get('/product', (req, res) => {
    res.json({ message: 'Product API is working' });
});

module.exports = router;
