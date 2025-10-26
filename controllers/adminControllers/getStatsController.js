import { Chat } from "../../models/ChatSchema.js";
import { Message } from "../../models/MessageSchema.js";
import { User } from "../../models/UserSchema.js";

export const getStatsController = async (req, res) => {
  try {
    const [groupsCount, usersCount, messageCount, totalChatCount] =
      await Promise.all([
        Chat.countDocuments({ IsGroupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
      ]);

    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate - 7);

    const last7DaysMessages = await Message.find({
      createdAt: { $gte: last7Days, $lte: today },
    }).select("createdAt");

    const dayInMillSec = 1000 * 60 * 60 * 24;

    const messagesChats = new Array(7).fill(0);

    last7DaysMessages.forEach((message) => {
      const index = Math.floor(
        (today.getTime() - message.createdAt.getTime()) / dayInMillSec
      );

      messagesChats[6 - index]++;
    });

    const stats = {
      groupsCount,
      usersCount,
      messageCount,
      totalChatCount,
      messagesChats,
    };


    res.status(200).json({success:true,stats})
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
