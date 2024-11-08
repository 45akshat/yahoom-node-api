const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller.js");


// Routes
router.post("/signup", authController.register);
router.post("/signin", authController.login);


// Apply the rate limiter only to /request-otp route
router.post("/request-otp", authController.requestOtp);

module.exports = router;
