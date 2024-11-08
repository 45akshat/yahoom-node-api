// info
// Pe38Ahqp1g9OLSup

//mongodb+srv://info:OdWdNmRc7v9jC7uX@cluster0.cr3bn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require("express");
const cors = require("cors");

const app = express();


// Enable trust proxy to correctly identify client IP
app.set('trust proxy', true);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    return res.status(200).send({ message: "welcome to ecommerce api - node", status: true });
});

const authRouters = require("./routes/auth.route.js");
app.use("/auth", authRouters);

const userRouters = require("./routes/user.route.js");
app.use("/users", userRouters);


const productsRouters = require("./routes/product.route.js");
app.use("/products", productsRouters);


const addressRouters = require("./routes/address.route.js");
app.use("/address", addressRouters);


const orderRouters = require("./routes/order.route.js");
app.use("/order", orderRouters);


// Import and use payment route
const paymentRouters = require("./routes/payment.route.js");
app.use("/payment", paymentRouters);  // Register the payment route

// Import and use payment route
const watiShipRouters = require("./routes/wat-ship.route.js");
app.use("/wati-ship", watiShipRouters);  // Register the payment route


module.exports = app;