const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
  },
  discountPercent: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
  },
  color: {
    type: String,
  },
  sizes: [{
    name: {
      type: String,
    },
    quantity: {
      type: Number,
    },
  }],
  imageUrls: [{  // Modified field to store multiple image URLs
    type: String,
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
