import { ALERT, REFETCH } from "../../constraint/event.js";
import { ChatParticipant } from "../../models/ChatParticipants.js";
import { Chat } from "../../models/ChatSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const groupChatController = async (req, res) => {
  try {
    const { name, participants: members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (members.length < 2) {
      return res
        .status(400)
        .json({ message: "Group chat must have at least 3 members (including you)" });
    }

    if (members.length > 100) {
      return res.status(403).json({ message: "Group members limit reached" });
    }

    const allMembers = [...members, req.user._id];

    const chat = await Chat.create({
      name,
      IsGroupChat: true,
      creater: req.user._id,
      participants: allMembers,
    });

    await chat.populate([
      { path: "participants", select: "userName email profilePic" },
      { path: "creater", select: "userName email profilePic" },
    ]);

    await ChatParticipant.insertMany(
      allMembers.map((id) => ({ userId: id, chatId: chat._id })),
      { ordered: false }
    );

   // emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
   // emitEvent(req, REFETCH, allMembers);

    return res.status(200).json({ message: "Group Chat created", chat });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while creating group", error });
  }
};
