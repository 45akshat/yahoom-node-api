const express = require('express');
const cartItemController = require('../controller/cart.controller');
const router = express.Router();

// Route to create a new cart item
router.post('/', cartItemController.createCartItem);

// Route to update an existing cart item
router.put('/:id', cartItemController.updateCartItem);

// Route to get a cart item by ID
router.get('/:id', cartItemController.getCartItemById);

// Route to get all cart items for a user
router.get('/user/:userId', cartItemController.getCartItemsByUserId);

// Route to remove a cart item
router.delete('/:id', cartItemController.removeCartItem);

// Route to exchange a cart item
router.post('/exchange/:id', cartItemController.exchangeCartItem);

module.exports = router;
