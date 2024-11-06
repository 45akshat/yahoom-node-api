const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({

  _id: {type: String}, // Specify the _id field as a String
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderItems',
    }],
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    deliveryDate: {
        type: Date,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses',
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
        },
        paymentId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            default: "COMPLETE",
        },
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    totalDiscountedPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "PENDING",
    },
    totalItem: {
        type: Number,
        required: true,
        default: 0,
    },
    awb: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('orders', orderSchema);
module.exports = Order;
