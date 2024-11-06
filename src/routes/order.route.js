const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller.js');


// Route to create a new order
router.post('/', orderController.createOrder);

// Route to get all orders for the authenticated user
router.get('/user/:userId', orderController.getUserOrders);

// Route to get order details by order ID
router.get('/order/:orderId', orderController.getOrderById);

// Route to request an exchange for an order item
router.post('/exchange/:orderItemId', orderController.requestExchange);

// Route to update the exchange status
router.put('/exchange/:orderItemId/status', orderController.updateExchangeStatus);

// Optional: Route to get all orders for admin
// router.get('/allOrders', orderController.getAllOrders);

module.exports = router;
