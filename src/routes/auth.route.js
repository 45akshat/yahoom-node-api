const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authController = require("../controller/auth.controller.js");

// Rate limiter for /auth/request-otp route
const otpRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        message: "Too many OTP requests from this IP, please try again after 10 minutes.",
        status: false
    }
});

// Routes
router.post("/signup", authController.register);
router.post("/signin", authController.login);

// Apply the rate limiter only to /request-otp route
router.post("/request-otp", otpRequestLimiter, authController.requestOtp);

module.exports = router;
