import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(`${process.env.CONNECTION_STRING}/QuickChat`).then(()=>{
    console.log('Connected')
}).catch((err)=>{
    console.log('Err',err)
})

export default mongoose.connection;