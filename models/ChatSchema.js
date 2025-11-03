import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  name: {
    type: String,
  },

  IsGroupChat: {
    type: Boolean,
    default: false,
  },

  groupChatPic:{
    url:String,
    public_id:String
  },

  creater: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},{timestamps:true});

export const Chat = model("chat", chatSchema);
