import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserSchema.js";

dotenv.config();

export const verifyAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const urlToken = req.params.token; 

  
    const accessToken = urlToken || (authHeader && authHeader.split(" ")[1]);
  
    if (!accessToken) {
      return res.status(400).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    
 
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
