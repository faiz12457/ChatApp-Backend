import {sendEmail} from "../../config/sendEmail.js"
import { ResetToken } from "../../models/passwordResetToken.js";
import { User } from "../../models/UserSchema.js";
import bcrypt from "bcrypt";

import dotenv from 'dotenv'
dotenv.config();

export const forgetPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email});
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = user.generateAccessToken();

    const hashedToken = await bcrypt.hash(token, 10);
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await ResetToken.deleteMany({ user: user._id });

    const newToken = new ResetToken({
      user: user._id,
      token: hashedToken,
      expiresAt: new Date(expires),
    });

    await newToken.save();

    await sendEmail({
      to: email,
      subject: `Password Reset Link for Dear ${user.userName} `,
      html: `We received a request to reset the password for your account. If you initiated this request, please use the following link to reset your password:</p>
        
        <p><a href=${process.env.LOCAL_URL}/reset-password/${user._id}?token=${token} target="_blank">Reset Password</a></p>
        
        <p>This link is valid for only 5 minutes. If you did not request a password reset, please ignore this email. Your account security is important to us.
        
        Thank you,
          QUICK CHAT</p>`,
    });

    res
      .status(200)
      .json({ message: `Password Reset link sent to ${user.email}` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured while sending password reset mail" });
  }
};
