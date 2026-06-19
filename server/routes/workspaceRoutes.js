import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  joinWorkspace,
  updateWorkspace
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);

router.get("/", authMiddleware, getWorkspaces);

router.post("/join", authMiddleware, joinWorkspace);

router.put("/:id", authMiddleware, updateWorkspace);

router.delete("/:id", authMiddleware, deleteWorkspace);

export default router;
