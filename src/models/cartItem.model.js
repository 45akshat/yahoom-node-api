const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  // New field to indicate exchange option
  exchange: {
    type: Boolean,
    required: true,
    default: false, // Default to false; can be set to true if the item is eligible for exchange
  },
  exchangeReason: {
    type: String,
    default: null, // Optional field to store the reason for exchange
  },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;
