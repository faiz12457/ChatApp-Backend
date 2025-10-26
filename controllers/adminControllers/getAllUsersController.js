import { Chat } from "../../models/ChatSchema.js";
import { User } from "../../models/UserSchema.js";

export const getAllUserController = async (req, res) => {
  try {
    const users = await User.find({}).select("userName profilePic email");

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const friends = await Chat.countDocuments({
          participants: user._id,
          IsGroupChat: false,
        });
        const groupChats = await Chat.countDocuments({
          participants: user._id,
          IsGroupChat: true,
        });

        return {
          ...user.toObject(),
          totalFriends: friends,
          totalGroupChats: groupChats,
        };
      })
    );

    res.status(200).json({ success: true, users: usersWithStats });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
