import { Chat } from "../../models/ChatSchema.js";
import { User } from "../../models/UserSchema.js";

export const searchUserController = async (req, res) => {
  try {
    const { name } = req.query;

    const myChats = await Chat.find({
      IsGroupChat: false,
      participants: req.user._id,
    });
    let allUserFromMyChat = myChats.map((chat) => chat.participants).flat();
     allUserFromMyChat.push(req.user._id);



    const query = {
      _id: { $nin: allUserFromMyChat },
    };

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    const notFriends = await User.find(query);


    res.status(200).json({
      success: true,
      count: notFriends.length,
      users: notFriends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while searching users",
      error: error.message,
    });
  }
};
