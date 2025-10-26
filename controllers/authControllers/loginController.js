import { User } from "../../models/UserSchema.js";
import { cookieOptions } from "../../utils/cookieOptions.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = await User.findOne({ email});
    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
     user.refreshToken=refreshToken;

     await user.save();

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",

        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          profilePic: user.profilePic,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          accessToken,
        },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
