import { Message } from "../../models/MessageSchema.js";

export const deletedForMeController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(403).json({ message: "ID not provided" });
    }

    await Message.findByIdAndUpdate(id, {
      $addToSet: { deletedFor: req.user._id },
    });

    return res.status(200).json({ success: true, messageId: id });
  } catch (error) {

    res.status(500).json({ message: "Error while deleting message", error });
  }
};
