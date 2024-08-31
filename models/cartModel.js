import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
  products: [{
      productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
      },
      productDetails: {
          title: String,
          description: String,
          price: Number,
          category: String,
          image: [String],
          shopName: String,
          rating: Number,
          quantity: Number,
      },
  }],
  totalPrice: {
      type: Number,
      required: true,
      default: 0, 
  },
}, {
  timestamps: true,
});


export const Cart = mongoose.model('Cart', CartSchema);


