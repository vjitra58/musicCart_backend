import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product count in stock"],
    },
    images : {
        type: [String],
    },
    category: {
        type: String,
        required: [true, "Please enter product category"],
    },
    color:{
        type: String,
        required: [true, "Please enter product color"],
    },
    brand: {
        type: String,
        required: [true, "Please enter product brand"],
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    }

});

export const Product = mongoose.model("Product", schema);