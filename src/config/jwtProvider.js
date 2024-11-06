const jwt= require("jsonwebtoken");
const SECRET_KEY = "asssssssdsadhshd";
const generateToken=(userId)=>{
    const token = jwt.sign({userId}, SECRET_KEY, {expiresIn: "48h"})
    return token;
}


const getUserIdFromToken=(token)=>{
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return decodedToken.userId;
}

module.exports={generateToken, getUserIdFromToken};


// flow

// SEND otp via whatsapp/email, tally both otp and provide a jwt token. verify the jwt whenever user opens website. once verified. 
// Load products from background, instock, etc, etc...
// cart data of a user
// order history.