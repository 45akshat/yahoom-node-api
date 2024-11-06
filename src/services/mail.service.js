const nodemailer = require('nodemailer');

const sendOrderConfirmationEmail = async (orderDetails) => {
    try {
        const mailTransporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'info@yahoom.in', // Your email address
                pass: 'ojuk qorm iusv fvdv', // Your email password or App Password
            },
        });

        // Extracting email and order items
        const email = orderDetails.billing_email;
        const orderItems = orderDetails.order_items;

        // Constructing the email content
        const orderItemsHtml = orderItems.map(item => 
            `<tr>
                <td style="border: none; padding: 8px; text-align: left;">
                    <img src="${item.imageSrc}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 4px; border: 1px solid #ddd; object-fit: cover;">

                </td>
                <td style="border: none; padding: 8px; text-align: left;">${item.name}</td>
                <td style="border: none; padding: 8px; text-align: center;">${item.units}</td>
                <td style="border: none; padding: 8px; text-align: right;">₹${parseFloat(item.selling_price).toFixed(2)}</td>
            </tr>`
        ).join('');

        const mailDetails = {
            from: "Yahoom",
            to: email,
            subject: `Order Confirmation - Order ID: ${orderDetails.order_id}`,
            html: `
                <style>
                    /* Default styles */
                    h1 { font-size: 28px; }
                    h2 { font-size: 22px; }
                    h3 { font-size: 20px; }
                    p { font-size: 16px; }
                    .total-amount { font-size: 18px; }
        
                    /* Responsive styles for mobile view */
                    @media only screen and (max-width: 600px) {
                        h1 { font-size: 24px; }
                        h2 { font-size: 20px; }
                        h3 { font-size: 18px; }
                        p { font-size: 14px; }
                        .total-amount { font-size: 16px; }
                    }
                </style>
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f8f8f8;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h1 style="font-weight: bold; color: #000; text-align: center; padding: 20px 0; margin: 0; border-bottom: 2px solid #000;">Yahoom</h1>
                        <div style="padding: 20px;">
                            <p>Thank you for your purchase!</p>
                            <p>We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
                            <a href="https://yahoom.in/account" style="display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px;">View your order</a>
                            <p style="margin-top: 10px;"><a href="https://yahoom.in" style="color: #000; text-decoration: underline;">Visit our store</a></p>
        
                            <h2 style="margin-top: 30px; font-weight: bold;">Order Summary</h2>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                <thead>
                                    <tr style="background-color: #f4f4f4;">
                                        <th style="border: none; padding: 8px; text-align: left;">Image</th>
                                        <th style="border: none; padding: 8px; text-align: left;">Item</th>
                                        <th style="border: none; padding: 8px; text-align: center;">Quantity</th>
                                        <th style="border: none; padding: 8px; text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orderItemsHtml}
                                </tbody>
                            </table>
                            <p style="margin-top: 20px; text-align: right; font-weight: bold;" class="total-amount">Total Amount: ₹${parseFloat(orderDetails.sub_total).toFixed(2)}</p>
        
                            <h3 style="margin-top: 30px; font-weight: bold;">Customer Information</h3>
                            <div style="border-top: 1px solid #000; padding-top: 10px;">
                                <p><strong>Shipping Address:</strong><br>
                                ${orderDetails.billing_customer_name} ${orderDetails.billing_last_name}<br>
                                ${orderDetails.billing_address}, ${orderDetails.billing_city}, ${orderDetails.billing_state}, ${orderDetails.billing_pincode}, India</p>
                                <p><strong>Billing Address:</strong><br>
                                Same as shipping address</p>
                            </div>
                            <p style="margin-top: 30px; font-size: 12px; color: #555;">If you have any questions, feel free to contact our support team.</p>
                        </div>
                    </div>
                </div>
            `,
        };
        

        // Send the order confirmation email
        await mailTransporter.sendMail(mailDetails);

        return {
            success: true,
            message: 'Order confirmation email sent successfully',
        };
    } catch (error) {
        console.error('Error occurred while sending email:', error);
        return {
            success: false,
            message: 'Error occurred while sending email',
        };
    }
};

// Export the function
module.exports = { sendOrderConfirmationEmail };
