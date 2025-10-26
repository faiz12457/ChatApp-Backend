import { ALERT, REFETCH } from "../../constraint/event.js";
import { Chat } from "../../models/ChatSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const removeMemberController = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    // Validate inputs
    if (!userId || !chatId) {
      return res.status(400).json({ message: "Invalid userId or chatId" });
    }

    // Find the chat (must be a group created by current user)
    const chat = await Chat.findOne({
      _id: chatId,
      creater: req.user._id,
      IsGroupChat: true,
    })
      .populate("creater")
      .populate("participants");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or unauthorized" });
    }

     if (chat.participants.length==3) {
      return res.status(404).json({ message: "Group must have atleast 3 members" });
    }



    // find the member index correctly
    const index = chat.participants.findIndex(
      (p) => p._id.toString() === userId
    );

    if (index === -1) {
      return res.status(404).json({ message: "User not in group" });
    }

    const removedUser= chat.participants.filter((p)=>p._id==userId);
    // remove member
    chat.participants.splice(index, 1);

    

    await chat.save();


    emitEvent(req,ALERT,chat.participants,`${removedUser.userName} has been removed from the group`)
    emitEvent(req,REFETCH,chat.participants);
    res.status(200).json({
      message: "User removed successfully",
      chat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
