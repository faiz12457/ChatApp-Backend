import { ALERT, REFETCH } from "../../constraint/event.js";
import { Chat } from "../../models/ChatSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const leaveChatController = async (req, res) => {
  try {
    const { id: chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // If it's not a group chat, handle accordingly
    if (!chat.IsGroupChat) {
      return res.status(400).json({ message: "Cannot leave a private chat" });
    }

    // Check if user is in participants
    const isMember = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    // If creator leaves, assign a new one (if others exist)
    if (chat.creater.toString() === req.user._id.toString()) {
      const remainingMembers = chat.participants.filter(
        (p) => p.toString() !== req.user._id.toString()
      );

      if (remainingMembers.length > 0) {
        const random = Math.floor(Math.random() * remainingMembers.length);
        chat.creater = remainingMembers[random];
      } else {
        // If no members left, delete chat
        await Chat.findByIdAndDelete(chatId);
        return res
          .status(200)
          .json({ message: "Chat deleted as no members remain" });
      }
    }

    // Remove user from participants
    chat.participants = chat.participants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );

    await chat.save();

    emitEvent(req,ALERT,chat.participants,`${req.user.userName} has leave the chat`)
    

    return res.status(200).json({
      message: "You have left the chat successfully",
      chat,
    });
  } catch (error) {
    console.error("Error leaving chat:", error);
    res
      .status(500)
      .json({ message: "Server error while leaving chat", error: error.message });
  }
};
