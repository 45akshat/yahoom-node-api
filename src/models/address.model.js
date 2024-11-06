const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    streetAddr: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: { // New state field
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
    },
    mobile: {
        type: Number,
        required: true,
    },
    email: { // New email field
        type: String,
        required: true,
        match: /.+\@.+\..+/, // Basic email validation
    },
});

const Address = mongoose.model('addresses', AddressSchema);
module.exports = Address;
