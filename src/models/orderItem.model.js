const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
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
        ref: "users",
        required: true,
    },
    exchangeEligible: {
        type: Boolean,
        default: true,
    },
    exchangeStatus: {
        type: String,
        enum: ['NOT_REQUESTED', 'PENDING', 'APPROVED', 'REJECTED'],
        default: 'NOT_REQUESTED',
    },
    replacementProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
});

const OrderItems = mongoose.model('orderItems', orderItemSchema);
module.exports = OrderItems;
