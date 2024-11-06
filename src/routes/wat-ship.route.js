const express = require('express');
const { sendTemplateMessage } = require('../services/whatsapp.service');
const router = express.Router();
const orderService = require('../services/order.service.js');


// Webhook endpoint to listen for Shiprocket tracking updates
router.post('/get-updates', async (req, res) => {
    // Log the incoming request for debugging
    //console.log('Received a webhook event:', req.body);

    // Validate the received data
    const { awb, courier_name, current_status, order_id } = req.body;
    
    if (!awb || !courier_name || !current_status || !order_id) {
        return res.status(400).send('Missing required fields');
    }

    // Process the received data as needed
    // For example, update your database with the new tracking information

    // Respond with a 200 status to acknowledge receipt

    // Example usage

    if(req.body.order_id == 'dummpy shiprocket order id 123'){
        let parameters = [
            { name: "name", value:  "Aksh test"},
            { name: "order_number", value: req.body.order_id },
            { name: "id", value: req.body.order_id }
            ];
        
        await sendTemplateMessage('9022559233', 'order_arrived_3', 'order_arrived_3', parameters);
       return res.status(200).send({'mobile':'9022559233', 'awb': req.body.order_id, 'order_id': req.body.order_id, 'shipment_status': req.body.shipment_status});

    }


    const order = await orderService.getOrderById(req.body.order_id)
    //console.log(order.shippingAddress.mobile)
    if (!order) {
        return res.status(404).send({ error: 'Order not found' });
    }

    const parameters = [
        { name: "name", value:  order.shippingAddress.firstName},
        { name: "order_number", value: req.body.order_id },
        { name: "id", value: req.body.order_id }
        ];
    // hello
    
    // order_placed_2

    if(req.body.shipment_status == 'Delivered'){
        await sendTemplateMessage(order.shippingAddress.mobile, 'order_arrived_3', 'order_arrived_3', parameters);
    }

    res.status(200).send({'mobile':order.shippingAddress.mobile, 'awb': req.body.awb, 'order_id': req.body.order_id, 'shipment_status': req.body.shipment_status});
});

module.exports = router;