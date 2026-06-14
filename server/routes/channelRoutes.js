import express from "express";

import {
  createChannel,
  getChannels,
} from "../controllers/channelController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createChannel
);

router.get(
  "/:workspaceId",
  authMiddleware,
  getChannels
);

export default router;