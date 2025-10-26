import { User } from "../../models/UserSchema.js";
import bcrypt from "bcrypt";
import { cookieOptions } from "../../utils/cookieOptions.js";

export const signUpController = async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    if (!email || !userName || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({
        message: "User is Already Exist",
      });
    }

    const newUser = new User({
      email,
      userName,
      
    });

    const hashed = await newUser.hashedPassword(password);
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    newUser.password = hashed;
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: "User successfully created",
       
        user: {
          id: newUser._id,
          userName: newUser.userName,
          email: newUser.email,
          profilePic:newUser.profilePic,
          isVerified:newUser.isVerified,
          isAdmin:newUser.isAdmin,
          accessToken,
        },
      });
  } catch (error) {
  
    res.status(500).json({ message: error.message });
  }
};
