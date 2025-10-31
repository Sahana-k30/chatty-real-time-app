const { generateToken } = require("../lib/utils");
const User=require("../models/user.model");
const bcryptjs= require("bcryptjs");
const cloudinary= require("../lib/cloudinary");

const signup = async (req,res)=>{
    const {email,fullName,password}= req.body;
    try{
        if(password.length <6){
            return res.status(400).json({message:"Password must be atleast 6 characters long"});
        }
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User with the email already exist"});
        }
        const salt= await bcryptjs.genSalt(10);
        const hashedPassword= await bcryptjs.hash(password,salt);
        const newUser= new User({
            email,
            fullName,
            password:hashedPassword,
        })

        if(newUser){
            //generate jwt token
            generateToken(newUser._id,res);
            await newUser.save();
            return res.status(201).json({message:"user registered successfully"});

        }else{
            res.status(400).json({message: "Invalid user data"});
        }
    }catch(err){
        res.status(500).json({message:"internal server error"});
    }
}

const login=async(req,res)=>{
    const{email,password}= req.body;
    try{
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const ispwdmatch= await bcryptjs.compare(password,user.password);
        if(!ispwdmatch){
            return res.status(400).json({message:"Invalid email or password"});
        }

        generateToken(user._id,res);
        res.status(200).json({message:"login successfull"});
    }
    catch(err){
        res.status(500).json({message:"internal server error"});
    }
};

const logout= async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logout successful"});
    }
    catch(err){
        res.status(500).json({message:"internal server error"});
    }
}

const updateProfile= async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId = req.user._id;
        console.log("req.user:", req.user);

        if(!profilePic){
            return res.status(400).json({message:"profile pic is required"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "user_profiles"
        });

        const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json(updatedUser);
    }
    catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "internal server error", error: err.message })

    }
}

const checkAuth= async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("error in chackauth controller");
        res.status(500).json({message: "internal server error"});
    }
}
module.exports={signup,login,logout,updateProfile,checkAuth};