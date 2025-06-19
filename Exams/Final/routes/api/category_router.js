let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// Category routes
router.get("/clothing", (req,res)=>{
    res.render('clothing', {
        title: 'Clothing',
        script: ''
    });
});

router.get("/accessories", (req,res)=>{
    res.render('accessories', {
        title: 'Accessories'
    });
});

router.get("/footwear", (req,res)=>{
    res.render('footwear', {
        title: 'Footwear'
    });
});

router.get("/journal", (req,res)=>{
    res.render('journal', {
        title: 'Journal'
    });
});

router.get("/about", (req,res)=>{
    res.render('about', {
        title: 'About'
    });
});

router.get("/early-access", (req,res)=>{
    res.render('early-access', {
        title: 'Early Access'
    });
});

module.exports = router;




