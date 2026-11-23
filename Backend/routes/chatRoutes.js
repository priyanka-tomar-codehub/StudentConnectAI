import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createOrGetChat, getChatMessages,getMyChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/create", protect, createOrGetChat);
router.get("/", protect, getMyChats);
router.get("/:chatId/messages", protect, getChatMessages);


export default router;