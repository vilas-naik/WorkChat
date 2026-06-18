import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createWorkspace,
  getWorkspaces,
  joinWorkspace
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);

router.get("/", authMiddleware, getWorkspaces);

router.post("/join", authMiddleware, joinWorkspace);
export default router;
