let express = require('express');
const cors = require('cors');
let app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');

let ejsLayouts = require('express-ejs-layouts');
const { default: mongoose } = require('mongoose');
const Product = require('./models/product_model');

app.set("view engine", "ejs");

// Middleware
app.use(express.static("public"));
app.use(ejsLayouts);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/bscssp25',
        ttl: 14 * 24 * 60 * 60 // = 14 days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days
    }
}));

// Make user data available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use("/api/category", require("./routes/api/category_router"));
app.use("/api/product", require("./routes/api/product_router"));
app.use("/auth", require("./routes/auth"));

app.get("/", (req,res)=>{
    res.render("cv", {
        user: req.session.user
    });
});

app.get("/assignment_2", (req,res)=>{
    res.render('assignment_2', {
    title: 'assignment_2',
    script: '<script src="/Public/assign_2.js"></script>'
  });
});

app.get("/labtask_1", (req,res)=>{
    res.render('labtask_1', {
    title: 'labtask_1',
    script: '<script src="/Public/lbtsk_1.js"></script>'
  });
});

app.get("/labtask_2", (req,res)=>{
    res.render('labtask_2', {
    title: 'labtask_2',
    script: '<script src="/Public/lbtsk_2.js"></script>'
  });
});

app.get("/checkout", (req,res)=>{
    res.render('checkout', {
    title: 'checkout',
    script: '<script src="/Public/chkout.js"></script>'
  });
});

// Category routes
app.get("/clothing", async (req, res) => {
    try {
        const products = await Product.find({ category: "clothing" });
        res.render('clothing', {
            title: 'Clothing',
            products,
            script: ''
        });
    } catch (err) {
        res.status(500).send('Error fetching products');
    }
});

app.get("/accessories", async (req, res) => {
    try {
        const products = await Product.find({ category: "accessories" });
        res.render('accessories', {
            title: 'Accessories',
            products,
            script: ''
        });
    } catch (err) {
        res.status(500).send('Error fetching products');
    }
});

app.get("/footwear", async (req, res) => {
    try {
        const products = await Product.find({ category: "footwear" });
        res.render('footwear', {
            title: 'Footwear',
            products,
            script: ''
        });
    } catch (err) {
        res.status(500).send('Error fetching products');
    }
});

app.get("/journal", (req,res)=>{
    res.render('journal', {
        title: 'Journal'
    });
});

app.get("/about", (req,res)=>{
    res.render('about', {
        title: 'About'
    });
});

app.get("/early-access", (req,res)=>{
    res.render('early-access', {
        title: 'Early Access'
    });
});

app.listen(3000, () =>{
    console.log("Server started at port: 3000");
});

let dbConnectionString = "mongodb://localhost:27017/bscssp25";

mongoose.connect(dbConnectionString).then(()=>{
    console.log("Database connected");
});