import { REFETCH } from "../../constraint/event.js";
import { ChatParticipant } from "../../models/ChatParticipants.js";
import { Chat } from "../../models/ChatSchema.js";
import { Request } from "../../models/RequestSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const acceptRequestController = async (req, res) => {
  try {
    const { requestId, accept } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: "Id required" });
    }

    const request = await Request.findById(requestId)
      .populate("sender", "userName")
      .populate("receiver", "userName");

    if (!request) {
      return res.status(400).json({ message: "Request not found" });
    }

    if (!accept) {
      await request.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Request rejected",
      });
    }

    const participants = [request.sender._id, request.receiver._id];

    let chat = await Chat.create({
      name: `${request.sender.userName}-${request.receiver.userName}`,
      participants,
    });

    await ChatParticipant.insertMany(
      participants.map((id) => ({ chatId: chat._id, userId: id }))
    );

    await request.deleteOne();
    chat = await chat.populate("participants");
    emitEvent(req, REFETCH, participants);

    return res.status(200).json({
      success: true,
      message: "Friend Request accepted",
      senderId: request.sender._id,
      chat,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
