import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    _id: false, // Prevents automatic creation of _id for subdocuments
});

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One cart per user
    },
    items: [CartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    totalQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
}, {
    timestamps: true,
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
