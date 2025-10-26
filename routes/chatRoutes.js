import express from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { groupChatController } from "../controllers/chatControllers/groupChatController.js";
import { getMyGroupController } from "../controllers/chatControllers/getMyGroupController.js";
import { getMyChatsController } from "../controllers/chatControllers/getMyChatsController.js";
import { addMembersController } from "../controllers/chatControllers/addMembersController.js";
import { newMessageController } from "../controllers/chatControllers/newMessageController.js";
import { upload } from "../fileUploads/multer.js";
import { createChatController } from "../controllers/chatControllers/createChatController.js";
import { removeMemberController } from "../controllers/chatControllers/removeMemberController.js";
import { getMessagesController } from "../controllers/chatControllers/getMessagesController.js";
import { getChatDetailsController } from "../controllers/chatControllers/getChatDetailsController.js";
import { renameGroupController } from "../controllers/chatControllers/renameGroupController.js";
import { deleteGroupChatController } from "../controllers/chatControllers/deleteGroupChatController.js";
import { leaveChatController } from "../controllers/chatControllers/leaveChatController.js";


const router=express.Router();

router.use(verifyAccessToken);
router.post("/newGroupChat" ,groupChatController)
router.get("/myChats",getMyChatsController);
router.get("/myGroups",getMyGroupController);
router.put("/addMembers",addMembersController)
router.post("/newMessage",upload.array("file",10) ,newMessageController);
router.post("/newChat",createChatController);
router.post("/removeGroupMember",removeMemberController);
router.get("/getMessages/:chatId",getMessagesController);
router.delete("/leave/:id",leaveChatController)


router.route("/:id").get(getChatDetailsController).put(renameGroupController).delete(deleteGroupChatController)



export default router