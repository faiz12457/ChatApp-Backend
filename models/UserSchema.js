import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
    },

    email: {
      type: String,
    },
    refreshToken: {
      type: String,
    },

    bio: {
      type: String,
      default: "Hey there i m using Quick Chat",
    },

    profilePic: {
       public_id:String,
       url:String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);



// userSchema.pre("save",async function(next) {
//   const saltRounds=10;
//        this.password=await bcrypt.hash(password, saltRounds);
// })
        
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.hashedPassword = async function (password, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "1d",
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "30d",
  });
};

export const User = model("User", userSchema);
