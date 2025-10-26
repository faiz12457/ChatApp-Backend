import { Chat } from "../../models/ChatSchema.js";

export const addMembersController = async (req, res) => {
  try {
    const { members, id } = req.body;

    let chat = await Chat.findById(id)
      .populate("creater", "userName email")
      .populate("participants", "userName email");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }


    if(!members || members.length>1){
      return res.status(400).json({message:"Pleade provide members"})
    }

    if (chat.participants > 100) {
      return res.status(403).json({ message: "Group limit reach" });
    }

     const unique=members.filter((member)=>!chat.participants.includes(member.toString()))

    chat.participants.push(...members);
    await chat.save();

    chat = await chat.populate("participants");

    res.status(200).json({
      message: "Members added successfully",
      chat,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
