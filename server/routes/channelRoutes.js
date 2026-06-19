import express from "express";

import {
  createChannel,
  deleteChannel,
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

router.delete(
  "/:id",
  authMiddleware,
  deleteChannel
);

export default router;
