const Address = require("../models/address.model.js");

// Create a new address for a user
const createAddress = async (addressData) => {
    try {
        const address = new Address(addressData);
        await address.save();
        return address;
    } catch (error) {
        console.error(`Error creating address: ${error.message}`);
        throw new Error(error.message);
    }
};

// Update an existing address by ID
const updateAddress = async (addressId, addressData) => {
    try {
        const address = await Address.findByIdAndUpdate(addressId, addressData, { new: true });
        if (!address) {
            throw new Error(`Address not found with ID: ${addressId}`);
        }
        return address;
    } catch (error) {
        console.error(`Error updating address: ${error.message}`);
        throw new Error(error.message);
    }
};

// Delete an address by ID
const deleteAddress = async (addressId) => {
    try {
        const address = await Address.findByIdAndDelete(addressId);
        if (!address) {
            throw new Error(`Address not found with ID: ${addressId}`);
        }
        return address;
    } catch (error) {
        console.error(`Error deleting address: ${error.message}`);
        throw new Error(error.message);
    }
};

// Get an address by ID
const getAddressById = async (addressId) => {
    try {
        const address = await Address.findById(addressId).populate('user');
        if (!address) {
            throw new Error(`Address not found with ID: ${addressId}`);
        }
        return address;
    } catch (error) {
        console.error(`Error fetching address: ${error.message}`);
        throw new Error(error.message);
    }
};

// Get all addresses for a user by their user ID
const getAddressesByUserId = async (userId) => {
    try {
        const addresses = await Address.find({ user: userId }).populate('user');
        if (!addresses.length) {
            throw new Error(`No addresses found for user with ID: ${userId}`);
        }
        return addresses;
    } catch (error) {
        console.error(`Error fetching addresses for user: ${error.message}`);
        throw new Error(error.message);
    }
};

module.exports = { createAddress, updateAddress, deleteAddress, getAddressById, getAddressesByUserId };
