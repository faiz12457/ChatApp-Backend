import { ALERT, REFETCH } from "../../constraint/event.js";
import { Chat } from "../../models/ChatSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const groupChatController = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (members.length < 2) {
      return res
        .status(400)
        .json({ message: "Group chat must have atleast 3 members" });
    }

    if (members.length > 100) {
      return res.status(403).json({ message: "Group members limit reach" });
    }
    const allMembers = [...members, req.user._id];
    const chat = new Chat({
      name,
      IsGroupChat: true,
      creater: req.user._id,
      participants: allMembers,
    });

    await chat.save();

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group `);
    emitEvent(req, REFETCH, members);

    return res.status(200).json({ message: "Group Chat created" });
  } catch (error) {
    res.status(500).json({ message: "Error occur while creating group" });
  }
};
