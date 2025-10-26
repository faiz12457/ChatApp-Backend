import { Chat } from "../../models/ChatSchema.js";

export const getFriendsController = async (req, res) => {
  try {

    
    const myChats = await Chat.find({
      IsGroupChat: false,
      participants: req.user._id,
    }).populate("participants", "userName email profilePic"); 

    const allUsersFromMyChats = myChats.map((chat) => chat.participants).flat();

  
    const friends = allUsersFromMyChats.filter(
      (user) => user._id.toString() !== req.user._id.toString()
    );


    return res.status(200).json({ friends,success:true });
  } catch (error) {
   console.log(error) 
    return res.status(500).json({ message: "Server error" });
  }
};
