const User = require("../models/user.model");
const jwtProvider = require("../config/jwtProvider.js");
const nodemailer = require("nodemailer");

const createUser = async (userData) => {
    try {
        const { firstName, lastName, email, password, mobile } = userData;  // Don't forget password
        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new Error(`User already exists with email: ${email}`);
        }

        const user = await User.create({ firstName, lastName, email, password, mobile });
        //console.log("Created user: ", user);

        return user;
    } catch (error) {
        console.error(error.message);
        throw error;  // Rethrow the error for further handling
    }
};



const sendOtp = async (email, password) => {
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

        const mailDetails = {
            from: "Yahoom",
            to: email,
            subject: "Your OTP Code",
            html: `<p>Your OTP code is: <strong>${password}</strong></p>`,
        };

        // Find the user by email
        let user = await User.findOne({ email });
        
        // If user does not exist, create a new one
        if (!user) {
            user = await User.create({ firstName: "empty", lastName: "empty", email, password, mobile: "empty" });
            //console.log(`New user created with email: ${email}`);
        }
        // Update the user's password
        user.password = password;

        // Save the updated user
        await user.save();


        await mailTransporter.sendMail(mailDetails);
        

        
        return {
            success: true,
            message: 'Email sent successfully',
        };
    } catch (error) {
        console.error('Error occurs while sending email:', error);
        return {
            success: false,
            message: 'Error occurs while sending email',
        };
    }
};


const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId).populate('address');
        if (!user) {
            throw new Error(`User not found with id: ${userId}`);
        }
        return user;
    } catch (error) {
        console.error(error.message);
        throw error;  // Rethrow the error for further handling
    }
};

const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(`User not found with email: ${email}`);
        }
        return user;
    } catch (error) {
        console.error(error.message);
        throw error;  // Rethrow the error for further handling
    }
};

const getUserProfileByToken = async (token) => {
    try {
        const userId = jwtProvider.getUserIdFromToken(token);
        const user = await findUserById(userId);

        return user;  // User will be returned or an error will be thrown
    } catch (error) {
        console.error(error.message);
        throw error;  // Rethrow the error for further handling
    }
};

const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
};

module.exports = { createUser, findUserById, findUserByEmail, getUserProfileByToken, getAllUsers, sendOtp };
