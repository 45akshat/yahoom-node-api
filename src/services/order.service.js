const Order = require('../models/order.model.js');
const OrderItems = require('../models/orderItem.model.js');


// Create a new order
const createOrder = async (orderData) => {
    try {
        // Step 1: Create each OrderItem and save it
        const orderItems = await Promise.all(orderData.orderItems.map(async (item) => {
            const newOrderItem = new OrderItems({
                product: item.productId,
                size: item.size.name,
                quantity: item.quantity,
                title: item.title,
                imageSrc: item.imageSrc,
                price: item.price,
                discountedPrice: item.discountedPrice,
                userId: orderData.user
            });
            await newOrderItem.save();
            return newOrderItem._id; // Return the ID of the saved order item
        }));

        // Step 2: Use the created OrderItem IDs in the order data
        const newOrder = new Order({
            _id: orderData._id,
            user: orderData.user,
            orderItems: orderItems, // Array of OrderItem IDs
            shippingAddress: orderData.shippingAddress,
            paymentDetails: orderData.paymentDetails,
            discount: orderData.discount,
            totalPrice: orderData.totalPrice,
            totalDiscountedPrice: orderData.totalDiscountedPrice,
            totalItem: orderItems.length, // Number of items in the order,
            awb: "empty"
        });

        // Step 3: Save the order
        await newOrder.save();
        return newOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};


// Get orders by user ID
const getOrdersByUserId = async (userId) => {
    return await Order.find({ user: userId })
        .populate('orderItems')
        .populate('shippingAddress');
};

// Get order details by order ID
const getOrderById = async (orderId) => {
    return await Order.findById(orderId)
        .populate('orderItems')
        .populate('shippingAddress');
};

// Request an exchange for an order item
const requestExchange = async (orderItemId, replacementProductId) => {
    const orderItem = await OrderItems.findById(orderItemId);
    if (!orderItem) {
        throw new Error('Order item not found');
    }

    // Set the exchange information
    orderItem.exchangeStatus = 'REQUESTED'; // Assuming you have an `exchangeStatus` field
    orderItem.replacementProduct = replacementProductId; // Assuming you have a `replacementProduct` field
    await orderItem.save();
    return orderItem;
};

// Update the exchange status
const updateExchangeStatus = async (orderItemId, status) => {
    const orderItem = await OrderItems.findById(orderItemId);
    if (!orderItem) {
        throw new Error('Order item not found');
    }

    orderItem.exchangeStatus = status; // Update to 'APPROVED' or 'REJECTED'
    await orderItem.save();
    return orderItem;
};


// Update the exchange status
const updateAwb = async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order item not found');
    }

    order.awb = status; // Update to 'APPROVED' or 'REJECTED'
    await order.save();
    return order;
};

// Get all orders (for admin)
const getAllOrders = async () => {
    return await Order.find()
        .populate('user')
        .populate('orderItems');
};

module.exports = {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    requestExchange,
    updateExchangeStatus,
    getAllOrders,
    updateAwb,
};
