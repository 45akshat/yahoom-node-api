const Cart = require("../models/cart.model");

const CartItem = require('../models/cartItem.model');

async function createCart(user) {
    try {
        const cart = new Cart({ user });
        const createdCart = await cart.save();
        return createdCart;
    } catch (error) {
        throw new Error(error.message);
    }
}



// Create a new cart item
const createCartItem = async (cartItemData) => {
    try {
        const cartItem = await CartItem.create(cartItemData);
        return cartItem;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error creating cart item: ' + error.message);
    }
};

// Update an existing cart item (including exchange options)
const updateCartItem = async (cartItemId, updateData) => {
    try {
        const updatedCartItem = await CartItem.findByIdAndUpdate(cartItemId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedCartItem) {
            throw new Error(`Cart item not found with id: ${cartItemId}`);
        }

        return updatedCartItem;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error updating cart item: ' + error.message);
    }
};

// Find a cart item by ID
const findCartItemById = async (cartItemId) => {
    try {
        const cartItem = await CartItem.findById(cartItemId).populate('product');

        if (!cartItem) {
            throw new Error(`Cart item not found with id: ${cartItemId}`);
        }

        return cartItem;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error finding cart item: ' + error.message);
    }
};

// Get all cart items for a user
const getCartItemsByUserId = async (userId) => {
    try {
        const cartItems = await CartItem.find({ userId }).populate('product');
        return cartItems;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error retrieving cart items: ' + error.message);
    }
};

// Remove a cart item
const removeCartItem = async (cartItemId) => {
    try {
        const deletedCartItem = await CartItem.findByIdAndDelete(cartItemId);

        if (!deletedCartItem) {
            throw new Error(`Cart item not found with id: ${cartItemId}`);
        }

        return deletedCartItem;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error deleting cart item: ' + error.message);
    }
};

// Example method to handle exchanges
const exchangeCartItem = async (cartItemId, reason) => {
    try {
        const updatedCartItem = await CartItem.findByIdAndUpdate(
            cartItemId,
            { exchange: true, exchangeReason: reason },
            { new: true, runValidators: true }
        );

        if (!updatedCartItem) {
            throw new Error(`Cart item not found with id: ${cartItemId}`);
        }

        return updatedCartItem;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error processing exchange: ' + error.message);
    }
};

module.exports = {
    createCart,
    createCartItem,
    updateCartItem,
    findCartItemById,
    getCartItemsByUserId,
    removeCartItem,
    exchangeCartItem,
};
