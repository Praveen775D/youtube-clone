// server/routes/videoRoutes.js

import express from "express";
import {
  getVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getVideos);
router.get("/:id", getVideoById);

/* LIKE / DISLIKE */
router.put("/:id/like", protect, likeVideo);
router.put("/:id/dislike", protect, dislikeVideo);

/* UPLOAD */
router.post(
  "/upload",
  protect,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

/* UPDATE */
router.put("/:id", protect, updateVideo);

/* DELETE */
router.delete("/:id", protect, deleteVideo);

export default router;