let mongoose = require("mongoose");
let schema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    in_stock: Boolean,
    category: String
});

let Model = new mongoose.model("Product", schema);

module.exports = Model;