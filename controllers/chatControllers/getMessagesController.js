import { Message } from "../../models/MessageSchema.js";

export const getMessagesController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const [messages, totalCount] = await Promise.all([
      Message.find({ chat: chatId, deleteForEveryOne: false })
        .limit(limit)
        .skip(skip)
        .populate({
          path: "sender",
          select: "userName email profilePic",
        })
        .populate("chat")
        .sort({ createdAt: -1 }),

      Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 0;
    const hasNextPage = page < totalPages;

    return res.status(200).json({
      success: true,
      currentPage: page,
      messages,
      totalPages,
      hasNextPage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages",
      error: error.message,
    });
  }
};
