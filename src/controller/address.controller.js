const addressService = require("../services/address.service.js");

// Create a new address for a user
const createAddress = async (req, res) => {
    try {
        const addressData = req.body;
        const newAddress = await addressService.createAddress(addressData);
        return res.status(201).json(newAddress);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update an existing address by ID
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const addressData = req.body;
        const updatedAddress = await addressService.updateAddress(addressId, addressData);
        return res.status(200).json(updatedAddress);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete an address by ID
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        await addressService.deleteAddress(addressId);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get an address by ID
const getAddressById = async (req, res) => {
    try {
        const { addressId } = req.params;
        const address = await addressService.getAddressById(addressId);
        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all addresses for a user by their user ID
const getAddressesByUserId = async (req, res) => {
    try {
        
        const jwt = req.headers.authorization?.split(" ")[1];

        if (!jwt) {
            return res.status(404).send({ error: "token not found" });
        }

        const user = await userService.getUserProfileByToken(jwt);

        const { userId } = req.params;
        if(userId == user._id){
            const addresses = await addressService.getAddressesByUserId(userId);
            return res.status(200).json(addresses);
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
    getAddressesByUserId
};
