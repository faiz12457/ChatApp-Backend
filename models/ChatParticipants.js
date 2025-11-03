import mongoose from "mongoose";

const chatParticipantSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chat", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastReadAt: { type: Date, default: new Date(0) },
  },
  { timestamps: true }
);

// prevent duplicate entries for same user-chat pair
chatParticipantSchema.index({ chatId: 1, userId: 1 }, { unique: true });

export const ChatParticipant= mongoose.model("chatParticipant", chatParticipantSchema);
