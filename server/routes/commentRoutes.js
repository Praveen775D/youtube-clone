import express from "express";
import {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
} from "../controllers/commentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* BASIC */
router.post("/", protect, addComment);
router.get("/:videoId", getCommentsByVideo);

/* EDIT / DELETE */
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

/* LIKE SYSTEM */
router.put("/like/:id", protect, likeComment);
router.put("/dislike/:id", protect, dislikeComment);

export default router;