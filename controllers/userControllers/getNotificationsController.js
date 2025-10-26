import { Request } from "../../models/RequestSchema.js";

export const getNotificationsController = async (req, res) => {
  try {
    const requests = await Request.find({ receiver: req.user._id }).populate(
      "sender"
    );
    const allRequest = requests.map(({ _id, sender }) => {
      return {
        _id,
        sender: {
          _id: sender._id,
          name: sender.userName,
          profilePic: sender.profilePic.url,
        },
      };
    });

    return res.status(200).json({
      success: true,
      request: allRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
