import { REFETCH } from "../../constraint/event.js";
import { deleteFromCloudinary } from "../../fileUploads/cloudnary.js";
import { Chat } from "../../models/ChatSchema.js";
import { Message } from "../../models/MessageSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const deleteGroupChatController = async (req, res) => {
  try {
    const { id: chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Find all messages with attachments
    const messagesWithAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    // Collect all public IDs
    const publicIds = messagesWithAttachments.flatMap((msg) =>
      msg.attachments.map((a) => a.public_id)
    );

    // Handle group chat deletion
    if (chat.IsGroupChat) {
      // Only creator can delete
      if (chat.creater.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not allowed to delete this group",
        });
      }
    }

    // Delete all attachments from Cloudinary
    if (publicIds.length > 0) {
      await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));
    }

    // Delete all messages and the chat itself
    await Promise.all([
      Message.deleteMany({ chat: chatId }),
      Chat.findByIdAndDelete(chatId),
    ]);


    emitEvent(req,REFETCH,chat.participants);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
      chatId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting chat",
      error: error.message,
    });
  }
};
