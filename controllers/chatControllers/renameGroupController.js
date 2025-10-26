import { REFETCH } from "../../constraint/event.js";
import { Chat } from "../../models/ChatSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const renameGroupController = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Group name is required" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.IsGroupChat) {
      return res.status(400).json({ message: "This is not a group chat" });
    }

    // ✅ Correct permission check
    if (chat.creater.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to rename this group",
      });
    }

    chat.name = name;
    await chat.save();

    
  //  await chat.populate("creater", "name email avatar");
   // await chat.populate("participants", "name email avatar");

    emitEvent(req,REFETCH,chat.participants);

    return res.status(200).json({
      success: true,
      message: "Group renamed successfully",
      chat,
    });
  } catch (error) {
    console.error("Error renaming group:", error);
    res.status(500).json({
      success: false,
      message: "Server error while renaming group",
      error: error.message,
    });
  }
};
