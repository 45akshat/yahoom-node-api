const axios = require('axios');

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUzNTE1NDEsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzMwOTc5MDc1LCJqdGkiOiI4QmhZNE0wd25mYlJEakZvIiwiaWF0IjoxNzMwMTE1MDc1LCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTczMDExNTA3NSwiY2lkIjo0ODk5NjkzLCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.NzRelXsmfUuDeWAh22_VWedocRaba3uzlxQPI35qfkA'; // Your token here

// Function to create a Shiprocket order with retry in the try block
async function startShiprocketOrder(orderDetails) {
    const url = 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc';

    try {
       //console.log(orderDetails)
        // Attempt to create the order with "1" first
        let response = await axios.post(url, orderDetails, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        
        let data = response.data;
        let awbResponse;

        try {
            // Try to generate the AWB with "1"
            awbResponse = await generateAwb(data.shipment_id, "1", authToken);
        } catch (error) {
            // If generating AWB with "1" fails, retry with "10" directly in the try block
           //console.log('Retrying AWB generation with attempt "10"');
            awbResponse = await generateAwb(data.shipment_id, "10", authToken);
        }
        
        return data;

    } catch (error) {
        // Log and throw error if the entire process fails
        console.error('Error creating order:', error.response ? error.response.data : error.message);
        throw new Error(`Order creation failed: ${error.response ? error.response.data.message : error.message}`);
    }
}


// Function to generate AWB for a shipment
async function generateAwb(shipmentId, courierId) {
    const url = 'https://apiv2.shiprocket.in/v1/external/courier/assign/awb';

    const payload = {
        shipment_id: shipmentId,
        courier_id: courierId
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error generating AWB:', error.response ? error.response.data : error.message);
        throw new Error(`AWB generation failed: ${error.response ? error.response.data.message : error.message}`);
    }
}

module.exports = {
    startShiprocketOrder,
    generateAwb,
};
