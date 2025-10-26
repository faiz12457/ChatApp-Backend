import { Chat } from "../../models/ChatSchema.js";

export const createChatController = async (req, res) => {
  try {
    const { member } = req.body; 
    const creater = req.user._id;

    if (!member) {
      return res.status(400).json({ success: false, message: "Member ID is required" });
    }

   
    let existingChat = await Chat.findOne({
      IsGroupChat: false,
      participants: { $all: [creater, member] },
    }).populate("participants", "name email avatar");

    if (existingChat) {
      return res.status(200).json({
        success: true,
        message: "Chat already exists",
        chat: existingChat,
      });
    }

    const newChat = await Chat.create({
      name: "private", 
      creater,
      participants: [creater, member],
      IsGroupChat: false,
    });

    const populatedChat = await Chat.findById(newChat._id).populate("participants", "name email avatar");

    return res.status(201).json({
      success: true,
      message: "New chat created successfully",
      chat: populatedChat,
    });

  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
