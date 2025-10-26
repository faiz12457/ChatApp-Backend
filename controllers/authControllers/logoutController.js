import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/UserSchema.js";
dotenv.config();

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(400).json({ message: "No token provided" });

    const decoded = jwt.verify(token,process.env.REFRESH_TOKEN_KEY);

    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
 
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    
      res.status(400).json({ message: "Invalid token" ,error:error.message });
  }
};
