const User= require("../models/user.model");
const Message= require("../models/message.model");
const cloudinary= require("../lib/cloudinary");
const { getRecieverSocketId,io } = require("../lib/socket");

const getUsersForSidebar= async(req,res)=>{
    try{
        const loggedInUser= req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUser}}).select("-password");
        res.status(200).json({filteredUsers});
    }
    catch(err){
        res.status(500).json({message:"internal server error"});
    }
}

const getAllMessages= async(req,res)=>{
    try{
        const {id:userToChatId}= req.params;
        const senderId= req.user._id;

        const messages= await Message.find({
            $or:[
                {senderId:senderId, recieverId:userToChatId},
                {senderId:userToChatId, recieverId:senderId}
            ]
        })
        res.status(200).json({messages});
    }
    catch(err){
        res.status(500).json({message:"internal server error"});
    }
}

const sendMessage= async(req,res)=>{
    try{
        const {id:recieverId}= req.params;
        const senderId= req.user._id;
        const{ text, image}= req.body;

        let imageUrl;
        if(image){
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        res.status(201).json(newMessage);

        //iplementing real-time communication using socket.io

        const recieverSocketId= getRecieverSocketId(recieverId);
        if(recieverId){
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }
        
    }
    catch(err){
        res.status(500).json({message:"internal server error"});
    }

}

module.exports={getUsersForSidebar, getAllMessages, sendMessage};