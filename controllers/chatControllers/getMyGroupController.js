import { Chat } from "../../models/ChatSchema.js";


export const getMyGroupController =async (req, res) => {
  try {
    const chats = await Chat.find({ creater: req.user._id,IsGroupChat:true })
      .populate("creater")
      .populate("participants");

    return res.status(200).json(chats);
  } catch (error) {
    return res.status(200).json({ message: "Error while getting chats" });
  }
};
