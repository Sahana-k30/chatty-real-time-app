const express=require("express");
const router=express.Router();
const protectroute= require("../middleware/auth.middleware").protectroute;
const {getUsersForSidebar, getAllMessages,sendMessage}= require("../controllers/msg.controller");

router.get("/user",protectroute, getUsersForSidebar);

router.get("/:id", protectroute, getAllMessages);

router.post("/send/:id", protectroute, sendMessage);

module.exports=router;
