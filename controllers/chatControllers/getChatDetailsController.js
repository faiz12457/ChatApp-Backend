import { Chat } from "../../models/ChatSchema.js";

export const getChatDetailsController = async (req, res) => {
  try {
    const { id: chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    let chat;

    if (req.query.populate === "true") {
      chat = await Chat.findById(chatId)
        .populate("participants", "userName email avatar") // populate specific fields
        .populate("creater", "userName email avatar");
    } else {
      chat = await Chat.findById(chatId);
    }

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({
      success: true,
      chat,
    });

  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Server error while fetching chat details",
      error: error.message,
    });
  }
};
