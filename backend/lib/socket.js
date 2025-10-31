const { Server } = require("socket.io");

const express= require("express");
const http=require("http");

const app=express();
const server= http.createServer(app);

const io=new Server(server,{
    cors:{
        origin: ["http://localhost:5173"]
    }
})

function getRecieverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap={

}

io.on("connection", (socket)=>{
    console.log("a user connected", socket.id);

    const userId= socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }
    // io.emit() t send to all clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("a user disconnected", socket.id);
        delete userSocketMap[userId];
    })
});
module.exports={io,app,server, getRecieverSocketId};
