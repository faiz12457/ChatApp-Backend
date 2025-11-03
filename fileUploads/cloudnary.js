import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileExtensions } from "./fileExtensions.js";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




   

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

     const ext = localFilePath.split('.').pop();


    const resourceType=fileExtensions[ext]||'auto'


  
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type:resourceType,
      folder:'uploads'
    });
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    
   return {
      url: res.secure_url,
      public_id: res.public_id,
      resource_type: res.resource_type,
      format: res.secure_url.split(".").pop() ,
      bytes: res.bytes,
      width: res.width || null,
      height: res.height || null,
      duration: res.duration || null, // for video/audio
      original_filename: res.original_filename,
      ext,
      
      created_at: res.created_at,
    };








  } catch (error) {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};


export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    
    throw new Error("Failed to delete file from Cloudinary");
  }
};