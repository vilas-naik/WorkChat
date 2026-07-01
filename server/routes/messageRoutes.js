import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { sendMessage, getMessages, deleteMessage, updateMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:channelId", authMiddleware, getMessages);
router.delete("/:id", authMiddleware, deleteMessage);
router.put("/:id", authMiddleware, updateMessage);

export default router;
