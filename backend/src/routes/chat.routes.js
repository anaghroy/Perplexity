import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  sendMessageController,
  getChatsController,
  getChatMessagesController,
  deleteChatController,
} from "../controllers/chat.controller.js";

const router = Router()

router.post("/", authUser, sendMessageController)
router.get("/", authUser, getChatsController)
router.get("/:chatId/messages", authUser, getChatMessagesController)
router.delete("/:chatId", authUser, deleteChatController)

export default router