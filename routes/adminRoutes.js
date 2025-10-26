import express from "express";
import { getAllUserController } from "../controllers/adminControllers/getAllUsersController.js";
import { getAllChatsController } from "../controllers/adminControllers/getAllChatsController.js";
import { allMessagesController } from "../controllers/adminControllers/allMessagesController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { getStatsController } from "../controllers/adminControllers/getStatsController.js";

const router = express.Router();

router.use(verifyAccessToken);

router.get("/users", getAllUserController);
router.get("/chats", getAllChatsController);
router.get("/messages", allMessagesController);
router.get("/stats", getStatsController);

export default router;
