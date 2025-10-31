const express=require("express");

const router=express.Router();
const signupcontroller=require("../controllers/auth.controller");
const protectroute= require("../middleware/auth.middleware.js").protectroute;

router.post("/signup", signupcontroller.signup);

router.post("/login", signupcontroller.login);

router.post("/logout", signupcontroller.logout);

router.put("/update-profile", protectroute, signupcontroller.updateProfile);

router.get("/check", protectroute, signupcontroller.checkAuth);

module.exports=router;