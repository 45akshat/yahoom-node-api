const orderService = require('../services/order.service.js');
const userService = require("../services/user.service.js");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await orderService.createOrder(orderData);
        return res.status(201).send(newOrder);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.split(" ")[1];

        if (!jwt) {
            return res.status(404).send({ error: "token not found" });
        }

        const user = await userService.getUserProfileByToken(jwt);

        const { userId } = req.params;
        if(userId == user._id){

        const {userId} = req.params; // Assuming user ID is stored in req.user
        const orders = await orderService.getOrdersByUserId(userId);
        return res.status(200).send(orders);
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get order details by order ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Request an exchange for an order item
const requestExchange = async (req, res) => {
    try {
        const { orderItemId } = req.params;
        const { replacementProductId } = req.body; // Assuming the new product ID for exchange is provided in the request body
        const updatedOrderItem = await orderService.requestExchange(orderItemId, replacementProductId);
        return res.status(200).send(updatedOrderItem);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Approve or reject an exchange request
const updateExchangeStatus = async (req, res) => {
    try {
        const { orderItemId } = req.params;
        const { status } = req.body; // The new status should be provided in the request body ('APPROVED' or 'REJECTED')
        const updatedOrderItem = await orderService.updateExchangeStatus(orderItemId, status);
        return res.status(200).send(updatedOrderItem);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get all orders for admin (optional)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    requestExchange,
    updateExchangeStatus,
    getAllOrders,
};
