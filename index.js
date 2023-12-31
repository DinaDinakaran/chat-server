const express = require("express")
const cors = require("cors")
const connection = require("./Uitils/Dbconnection/connection")
const AuthRoute = require("./Router/UserAuthRoute");
const MessageRouter = require("./Router/MessagRoute");
const Socket = require("socket.io")
require("dotenv").config()

const app =  express();
app.use(cors({
  origin:"*"
}));
app.use(express.json())
app.use("/api/auth",AuthRoute)
app.use("/api/message",MessageRouter)
connection();
let port = process.env.PORT || 80

const server = app.listen(port,()=>{
    console.log("Server runs at"+port)
})

const io = Socket(server,{
        cors:{
            origin:"https://teal-muffin-11bd09.netlify.app",
            Credential:true
        }
})

global.onlineUsers = new Map();
 
io.on("connection",(socket)=>{
  global.chatSocket = socket;
  socket.on("add-user",(Userid)=>{
     onlineUsers.set(Userid,socket.id)
  })

  socket.on("send-msg",(data)=>{
    const senduser = onlineUsers.get(data.to);
    if(senduser){
        socket.to(senduser).emit("msg-reciever",data.message)
    }
  })
})
