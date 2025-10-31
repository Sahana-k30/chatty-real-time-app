const mongoose= require("mongoose");
require("dotenv").config();

const connectDB= async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI);
            console.log("Mongodb connected successfuly");
        }
    catch(err){
        console.log("Mongodb connection error");
    }
};

module.exports=connectDB;
