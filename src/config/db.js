const  mongoose = require("mongoose")

const mondbUrl = "mongodb+srv://info:OdWdNmRc7v9jC7uX@cluster0.cr3bn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb=()=>{
    return mongoose.connect(mondbUrl);
}

module.exports={connectDb}