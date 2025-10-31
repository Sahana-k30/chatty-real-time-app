const jwt=require("jsonwebtoken");
const User= require("../models/user.model");
require("dotenv").config();

const protectroute= async(req,res,next)=>{
    try {
    const token = req.cookies.jwt;

    // 1️⃣ Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access - No token" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized access - Invalid token" });
    }

    // 3️⃣ Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports={protectroute};