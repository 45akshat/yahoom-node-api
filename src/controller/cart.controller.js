const CartItem = require("../models/cartItem.model");
const Cart = require("../models/cart.model");

// Create a new cart item
const createCartItem = async (req, res) => {
    try {
        const { cart, product, size, quantity, price, discountedPrice, userId } = req.body;

        const newCartItem = new CartItem({
            cart,
            product,
            size,
            quantity,
            price,
            discountedPrice,
            userId
        });

        const savedCartItem = await newCartItem.save();
        res.status(201).json(savedCartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing cart item
const updateCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCartItem = await CartItem.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        res.status(200).json(updatedCartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a cart item by ID
const getCartItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const cartItem = await CartItem.findById(id).populate('product');

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all cart items for a user
const getCartItemsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const cartItems = await CartItem.find({ userId }).populate('product');
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove a cart item
const removeCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCartItem = await CartItem.findByIdAndDelete(id);

        if (!deletedCartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exchange a cart item
const exchangeCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        const cartItem = await CartItem.findById(id);

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        // Here you can implement logic to process the exchange, such as updating the cart item or creating a new exchange request

        // For example, you might want to update the quantity or mark it for exchange
        // cartItem.quantity -= 1; // Example: reduce quantity
        // await cartItem.save(); // Save changes

        res.status(200).json({ message: "Cart item exchange processed", cartItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCartItem,
    updateCartItem,
    getCartItemById,
    getCartItemsByUserId,
    removeCartItem,
    exchangeCartItem
};
