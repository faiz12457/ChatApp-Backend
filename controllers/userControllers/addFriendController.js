import { NEW_REQUEST } from "../../constraint/event.js";
import { Request } from "../../models/RequestSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const addFriendController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Id requried" });
    }

    let request = await Request.findOne({
      $or: [
        { receiver: userId, sender: req.user._id },
        { receiver: req.user._id, sender: userId },
      ],
    });

    if (request) {
      return res.status(400).json({ message: "Request already send" });
    }

    request = await Request.create({
      sender: req.user._id,
      receiver: userId,
    });


request = await request.populate([
  { path: "sender", select: "userName email profilePic" },
  { path: "receiver", select: "userName email profilePic" },
]);


    emitEvent(req, NEW_REQUEST, [userId]);
    return res.status(200).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
