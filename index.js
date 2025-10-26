import express from 'express'
import http from "http"
import {Server} from "socket.io"
import cors from 'cors'
import "./config/mongoDB-CONNECTION.js"
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'


import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import { NEW_CHAT, NEW_MESSAGE_ALERT, NEW_NOTIFICATION, NEWMESSAGE } from './constraint/event.js'
import { v4 as uuid } from 'uuid'
import { getSockets } from './utils/getSockets.js'
import { userSocketIds } from './utils/store.js'
import { Message } from './models/MessageSchema.js'


const app=express();


const server=http.createServer(app);


const port = process.env.PORT||3000;

app.use(
  cors({
    origin:[process.env.LOCAL_URL,process.env.FRONT_END_URL],//  React frontend URL
    credentials: true,
  })
);


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/user",userRoute);
app.use("/chat",chatRoutes)
app.use("/admin",adminRoutes);

app.get("/", (req, res) => {
  res.send("running");
});


const io=new Server(server,{
  cors:{
    origin:process.env.LOCAL_URL,
    credentials:true
  }
});

  io.use((socket, next)=>{
     const token = socket.handshake.auth?.token;

     if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    socket.user = decoded; 
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
  })




io.on("connection", (socket) => {

  const user=socket.user;
 
userSocketIds.set(user.id.toString(),socket.id)


 socket.on(NEWMESSAGE,async({participants,message})=>{

   const membersSocketsIds= getSockets(participants);
  io.to(membersSocketsIds).emit(NEWMESSAGE,message);
  io.to(membersSocketsIds).emit(NEW_MESSAGE_ALERT,message.chat)

 })


 socket.on(NEW_NOTIFICATION,({request,id})=>{

  const membersSocketsIds= getSockets([id]);

  socket.to(membersSocketsIds).emit(NEW_NOTIFICATION,request)

 })


 socket.on(NEW_CHAT,(data)=>{
  const participants=data.participants.map((p)=>p._id)
   const membersSocketsIds= getSockets(participants);
 // console.log(data);

  
  io.to(membersSocketsIds).emit(NEW_CHAT,data)
 })



  socket.on("disconnect",()=>{
      userSocketIds.delete(user.id.toString())
  })
 
});



server.listen(port,()=>{
  console.log('Server is running on port '+ port)
})


