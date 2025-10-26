import { Chat } from "../../models/ChatSchema.js";

export const getMyChatsController = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("creater")
      .populate("participants");

    return res.status(200).json({chats});
  } catch (error) {
    return res.status(200).json({ message: "Error while getting chats" });
  }
};
