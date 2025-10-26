import express from "express";
import { searchUserController } from "../controllers/userControllers/searchUserController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { addFriendController } from "../controllers/userControllers/addFriendController.js";
import { acceptRequestController } from "../controllers/userControllers/acceptRequestController.js";
import { getNotificationsController } from "../controllers/userControllers/getNotificationsController.js";
import { getFriendsController } from "../controllers/userControllers/getFriendsController.js";

const router = express.Router();

router.use(verifyAccessToken);

router.get("/search", searchUserController);


router.post("/sendRequest",addFriendController)
router.post("/acceptRequest",acceptRequestController)
router.get("/notification",getNotificationsController)
router.get("/getFriends",getFriendsController);

export default router;
