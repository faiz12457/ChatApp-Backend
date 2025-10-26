import { OTP } from "../../models/otpSchema.js";
import { User } from "../../models/UserSchema.js";

export const verifyOtpController=async(req,res)=>{
 try {
   const { email, otp } = req.body;
      
   const user = await User.findOne({ email});
   if (!user) return res.status(404).json({ message: "User not found" });
 
   const otpDoc = await OTP.findOne({
     user: user._id,
     otp,
     expiresAt: { $gt: Date.now() }, 
   });
 
   if (!otpDoc) {
     return res.status(400).json({ message: "Invalid or expired OTP" });
   }
  
  
   user.isVerified=true;

   await  user.save();
   await OTP.deleteMany({ user: user._id });
 
   res.json({ message: "OTP verified" });
 } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error" });
 }
};

