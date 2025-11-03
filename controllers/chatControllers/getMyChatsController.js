import { ChatParticipant } from "../../models/ChatParticipants.js";
import { Chat } from "../../models/ChatSchema.js";
import { Message } from "../../models/MessageSchema.js";

export const getMyChatsController = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("creater")
      .populate("participants");

    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const participant = await ChatParticipant.findOne({
          chatId: chat._id,
          userId: req.user._id,
        });

                
        const lastReadAt = participant?.lastReadAt || new Date(0);

        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user._id },
          createdAt: { $gt: lastReadAt },
        });

  

        return { ...chat.toObject(), unreadCount };
      })
    );

   // console.log(chatsWithUnread)

    return res.status(200).json({ chats: chatsWithUnread });
  } catch (error) {
    return res.status(200).json({ message: "Error while getting chats" });
  }
};
