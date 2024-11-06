const express = require("express");
const {
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
    getAddressesByUserId,
} = require("../controller/address.controller");

const router = express.Router();

// Create a new address
router.post("/", createAddress);

// Update an existing address by ID
router.put("/:addressId", updateAddress);

// Delete an address by ID
router.delete("/:addressId", deleteAddress);

// Get an address by ID
router.get("/:addressId", getAddressById);

// Get all addresses for a user by their user ID
router.get("/user/:userId", getAddressesByUserId);

module.exports = router;
