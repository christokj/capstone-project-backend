import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    images: [{
        type: String, 
        required: true,
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
