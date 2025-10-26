import { Chat } from "../../models/ChatSchema.js";
import { Message } from "../../models/MessageSchema.js";

export const getAllChatsController = async (req, res) => {
  try {
    
    const chats = await Chat.find({})
      .populate("participants", "userName email profilePic")
      .populate("creater", "userName profilePic");

    // Transform each chat
    const transformChats = await Promise.all(
      chats.map(async (chat) => {
        const totalMessages = await Message.countDocuments({ chat: chat._id });

        return {
          ...chat.toObject(),
          totalMembers: chat.participants.length,
          avatar: chat.participants.slice(0,3).map((u) => u.profilePic),
          totalMessages, 
        };
      })
    );

    return res.status(200).json({
      success: true,
      chats: transformChats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
