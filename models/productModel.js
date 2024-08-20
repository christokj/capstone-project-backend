import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: { 
        type: Number,
         required: true,
        unique: true,
        min: 1,
    },
    title: {
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
          trim: true,
           required: true 
        },
    image: {
        type: String, 
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
}, {
    timestamps: true,
});

export const Product = mongoose.model('Product', ProductSchema);

