import { ResetToken } from "../../models/passwordResetToken.js";
import { User } from "../../models/UserSchema.js";
import bcrypt from "bcrypt";

export const resetPasswordController = async (req, res) => {
  try {
    const { password, token, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const resetToken = await ResetToken.findOne({ user: user._id });

    if (!resetToken) {
      return res.status(404).json({ message: "Reset Link is Not Valid" });
    }

    if (resetToken.expiresAt < new Date()) {
      await ResetToken.findByIdAndDelete(resetToken._id);
      return res.status(404).json({ message: "Reset Link has been expired" });
    }
    const isMatch = await bcrypt.compare(token, resetToken.token);

    if (token && resetToken.expiresAt > new Date() && isMatch) {
      await ResetToken.findByIdAndDelete(resetToken._id);

      const hashed = await user.hashedPassword(password);
      await User.findByIdAndUpdate(user._id, { password: hashed });

      return res.status(200).json({ message: "Password Updated Successfuly" });
    }

    return res.status(404).json({ message: "Reset Link has been expired" });
  } catch (error) {
    
    res
      .status(500)
      .json({
        message:
          "Error occured while resetting the password, please try again later",
      });
  }
};
