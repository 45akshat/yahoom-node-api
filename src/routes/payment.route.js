const express = require("express");
const Razorpay = require("razorpay");
const orderService = require('../services/order.service');
const productService = require('../services/product.service');
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const { startShiprocketOrder } = require("./ship.route");
const { sendTemplateMessage } = require("../services/whatsapp.service");
const { sendOrderConfirmationEmail } = require("../services/mail.service");
const router = express.Router();

// Initialize Razorpay with your key_id and key_secret
const razorpayInstance = new Razorpay({
  key_id: "rzp_live_pYcxgNYPOVVg6s", // Replace with your Razorpay key_id
  key_secret: "QyiRITqU6lFdNbrf13QTIKdl", // Replace with your Razorpay key_secret
});

// Route to create an order
//aa

// Create order route
router.post("/createOrder", async (req, res) => {
  const { orderItems } = req.body;
  let totalAmount = 0;

  try {
      // Iterate over orderItems to get the price of each product
      console.log(orderItems)
      for (const item of orderItems) {
          const product = await productService.getProductById(item.productId);
          // Calculate total price (you can adjust based on quantity or other factors)
          totalAmount += product.discountedPrice * item.quantity;
      }

      // Convert totalAmount to smallest currency unit (paise for INR)
      const amount = totalAmount * 100; // Assuming the price is in INR, multiply by 100 to convert to paise
      const currency = "INR"; // Currency for the payment
      const receipt = `receipt_${new Date().getTime()}`; // Example receipt ID (customize as needed)

      const options = {
          amount, // Amount in paise
          currency,
          receipt,
      };

      // Create the Razorpay order
      const order = await razorpayInstance.orders.create(options);
      res.json({ orderId: order.id });
  } catch (error) {
      console.error("Error creating order:", error.message);
      res.status(500).json({ error: error.message });
  }
});
// Function to get the current date and time formatted
function getCurrentDateTime() {
  const currentDate = new Date();
  return currentDate.toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:MM'
}

    function generateRandomAlphaNumeric(length = 7) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          result += chars[randomIndex];
      }
      return result;
  }
// Route to verify payment and save the order
router.post("/verifyPayment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user, orderItems, shippingAddress, paymentDetails, discount, totalPrice, totalDiscountedPrice } = req.body;

  // Validate payment
  const paymentStatusFromRZP = await validatePaymentVerification({ order_id: razorpay_order_id, payment_id: razorpay_payment_id }, razorpay_signature, 'QyiRITqU6lFdNbrf13QTIKdl');
  if (paymentStatusFromRZP !== true) {
      return res.send({ status: "failure" });
  }
  //aksh

  // Adjust total prices for payment processing
  const adjustedTotalPrice = totalPrice / 100;
  const adjustedTotalDiscountedPrice = totalDiscountedPrice / 100;
  const order_id = "YM1038" + generateRandomAlphaNumeric();

  // Create order data
  const orderData = {
      _id: order_id,
      user,
      orderItems,
      shippingAddress,
      paymentDetails,
      discount,
      totalPrice: adjustedTotalPrice,
      totalDiscountedPrice: adjustedTotalDiscountedPrice,
  };

  try {
      // Save the order first
      const newOrder = await orderService.createOrder(orderData);

      // Fetch the saved order from the database
      const orderDataFromDb = await orderService.getOrderById(order_id);

      if (!orderDataFromDb) {
        return res.status(404).json({ error: "Order not found after saving." });
      }
      const numberOfItems = orderDataFromDb.orderItems.length

      // Example usage of the fetched order
      const orderDetails = {
          order_id: order_id,
          order_date: getCurrentDateTime(),
          pickup_location: "Home",
          channel_id: "",
          comment: "Order via Automation",
          billing_customer_name: orderDataFromDb.shippingAddress.firstName,
          billing_last_name: orderDataFromDb.shippingAddress.lastName,
          billing_address: orderDataFromDb.shippingAddress.streetAddr,
          billing_city: orderDataFromDb.shippingAddress.city,
          billing_pincode: orderDataFromDb.shippingAddress.pincode.toString(),
          billing_state: orderDataFromDb.shippingAddress.state,
          billing_country: "India",
          billing_email: orderDataFromDb.shippingAddress.email,
          billing_phone: orderDataFromDb.shippingAddress.mobile.toString(),
          shipping_is_billing: true,
          order_items: orderDataFromDb.orderItems.map(item => ({
              name: item.title,
              imageSrc: item.imageSrc,
              sku: item.product+"-"+item.size,
              units: item.quantity,
              selling_price: item.discountedPrice.toString(),
              hsn: 6205,
          })),
          payment_method: "prepaid",
          shipping_charges: 0,
          total_discount: 0,
          sub_total: adjustedTotalDiscountedPrice.toString(),
          length: 25*numberOfItems,
          breadth: 20*numberOfItems,
          height: 2.5*numberOfItems,
          weight: 0.5*numberOfItems,
      };
        
      const reduceOrderItemsQuantities = async (orderItems) => {
        try {
            // Map through orderItems and execute reduceProductQuantity for each item concurrently
            await Promise.all(
                orderItems.map(item =>
                    productService.reduceProductQuantity(
                        item.productId,
                        item.size.name,
                        item.quantity
                    )
                )
            );
    
        } catch (error) {
            console.error("Error reducing quantities for order items:", error.message);
            throw error;
        }
    };

    await reduceOrderItemsQuantities(orderItems)
    

      // Call Shiprocket API after saving order
      startShiprocketOrder(orderDetails)
        .then(async response => {
            // let awb_code = response.awb_code
            // orderService.updateAwb(order_id, awb_code);
            
           //console.log('Order created successfully on Shiprocket:', response);
            
            const parameters = [
              { name: "name", value: orderDataFromDb.shippingAddress.firstName },
              { name: "order_number", value: order_id },
              { name: "id", value: order_id }
              ];
            
            await sendTemplateMessage(orderDataFromDb.shippingAddress.mobile, 'order_placed_3', 'order_placed_3', parameters);
            await sendOrderConfirmationEmail(orderDetails);
        })
        .catch(error => {
            console.error('Failed to create Shiprocket order:', error);
        });

      return res.send({ status: "success", order: newOrder });
  } catch (error) {
      console.error("Failed to save order:", error.message);
      return res.status(500).send({ error: "Failed to save order: " + error.message });
  }
});


module.exports = router;

