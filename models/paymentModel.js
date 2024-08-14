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
        enum: ['Credit Card', 'PayPal', 'Stripe', 'Cash on Delivery'], // Example payment methods
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    receiptUrl: {
        type: String, // URL or path to the payment receipt
        trim: true,
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
