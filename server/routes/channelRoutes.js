import express from "express";
import {
  createChannel,
  getChannel,
  addVideoToChannel,
  removeVideoFromChannel,
} from "../controllers/channelController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.get("/:id", getChannel);

router.put("/:id/add-video", protect, addVideoToChannel);
router.put("/:id/remove-video", protect, removeVideoFromChannel);

export default router;