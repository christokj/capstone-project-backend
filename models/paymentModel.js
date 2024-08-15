import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'PayPal', 'Cash on Delivery'], // Example payment methods
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
