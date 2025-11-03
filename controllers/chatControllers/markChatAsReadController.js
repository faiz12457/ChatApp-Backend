import { ChatParticipant } from "../../models/ChatParticipants.js";

export const markChatAsReadController = async (req, res) => {
  try {
    const { chatId } = req.params;
    await ChatParticipant.findOneAndUpdate(
      { chatId, userId: req.user._id },
      { $set: { lastReadAt: new Date() } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to mark chat as read:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
