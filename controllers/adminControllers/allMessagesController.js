import { Message } from "../../models/MessageSchema.js";

export const allMessagesController = async (req, res) => {
  try {
    const messages = await Message.find({})
      .populate("sender", "userName profilePic")
      .populate("chat", "IsGroupChat");

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
