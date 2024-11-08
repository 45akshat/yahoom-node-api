// info
// Pe38Ahqp1g9OLSup

//mongodb+srv://info:OdWdNmRc7v9jC7uX@cluster0.cr3bn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require("express");
const cors = require("cors");

const rateLimit = require("express-rate-limit");

const app = express();



// Trust the proxy if your app is behind one (e.g., Nginx, Heroku)
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    return res.status(200).send({ message: "welcome to ecommerce api - node", status: true });
});


const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 5, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  });
  const limiter2 = rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      limit: 5, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
    });
  

// Apply the rate limiter only to the /auth/request-otp route
app.use("/auth/request-otp", limiter);
app.use("/auth/login", limiter2);

// Log the incoming request IP for debugging
app.use((req, res, next) => {
    console.log("Request IP:", req.ip); // or req.headers['x-forwarded-for']
    next();
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