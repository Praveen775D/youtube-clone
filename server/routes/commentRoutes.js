import express from "express";
import {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:videoId", getCommentsByVideo);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;