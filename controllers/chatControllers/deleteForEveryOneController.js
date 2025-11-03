import { deleteFromCloudinary } from "../../fileUploads/cloudnary.js";
import { Message } from "../../models/MessageSchema.js";

export const deleteForEveryOneController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: " message id required" });
    }

    const message = await Message.findById(id);

  if (message.sender.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: "Only sender can delete this message" });
}

    message.deleteForEveryOne = true;
    message.content = "This message was deleted";
    if (message.attachments.length > 0) {
      await Promise.all(
        message.attachments.map((m) => deleteFromCloudinary(m.public_id))
      );

      message.attachments = [];
    }

    await message.save();

    return res.status(200).json({ success: true, message});
  } catch (error) {
    res.status(500).json({ message: "Error while Deleting message", error });
  }
};
