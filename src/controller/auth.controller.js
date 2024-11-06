const userService = require("../services/user.service.js");
const jwtProvider = require("../config/jwtProvider.js");
const cartService = require("../services/cart.service.js")

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtProvider.generateToken(user._id);
       //console.log(jwt);
        await cartService.createCart(user); 
        // Assuming cartService is defined
        return res.status(200).send({ jwt, message: "register success" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const requestOtp = async (req, res) => {
    const { email } = req.body;
     // Generate a 4-digit random number
     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a number between 1000 and 9999

    try{
        const statusOfOtp = await userService.sendOtp(email, otp)


       //console.log("save otp to db")
       //console.log("send mail otp")
        return res.status(200).send(statusOfOtp)
    }catch(error){
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal Server Error" });
    }
}


const login = async (req, res) => {
    //otp verification
    const { password, email } = req.body;

    try {
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).send({ message: "User not found with this email", email });
        }

        // Direct comparison of plain password
        const isPasswordValid = password === user.password;

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid OTP..." });
        }

        const jwt = jwtProvider.generateToken(user._id);

        return res.status(200).send({ jwt, message: "Login successful" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports={register, login, requestOtp};