import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    }],
    shippingAddress: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zipCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'PayPal', 'Cash on Delivery'], // Example payment methods
    },
    paymentResult: {
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    itemsPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        default: 'Processing',
    },
}, {
    timestamps: true,
});

export const Order = mongoose.model('Order', OrderSchema);


