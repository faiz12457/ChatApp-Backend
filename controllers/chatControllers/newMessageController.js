import { NEW_MESSAGE_ALERT, NEWMESSAGE } from "../../constraint/event.js";
import { uploadOnCloudinary } from "../../fileUploads/cloudnary.js";
import { Chat } from "../../models/ChatSchema.js";
import { Message } from "../../models/MessageSchema.js";
import { emitEvent } from "../../utils/emitEvent.js";

export const newMessageController = async (req, res) => {
  try {
    const { sender, content, chat } = req.body;
   



    if (!sender || !chat) {
      return res.status(400).json({ message: "Error sending message" });
    }

    const existingChat=await Chat.findById(chat);

    if(!existingChat){
      return res.status(400).json({message:"Chat not found"})
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
      const paths = req.files.map((file) => file.path);

      const uploadResults = await Promise.all(
        paths.map((path) => uploadOnCloudinary(path))
      );

      attachments = uploadResults.map((data) => ({
        url: data.url,
        public_id: data.public_id,
      }));
    }

    

  
    let message = new Message({
      sender,
      content,
      chat,
      attachments,
      status:'sent'
    });

    await message.save();

       message = await message.populate("sender", "userName email profilePic");
  //  message = await message.populate("chat");

  //emitEvent(req,NEWMESSAGE,existingChat.participants,{message,chatId:chat});
 // emitEvent(req,NEW_MESSAGE_ALERT,existingChat.participants,{chatId:chat})

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
       message,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
