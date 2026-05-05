// server/routes/channelRoutes.js

import express from "express";
import {
  createChannel,
  getChannel,
  getAllChannels,
  getMyChannel,
  updateChannel,
  deleteChannel,
  toggleSubscribe,
  getStudioData,
} from "../controllers/channelController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  protect,
  upload.fields([{ name: "avatar" }, { name: "banner" }]),
  createChannel
);

/* UPDATE */
router.put(
  "/:id",
  protect,
  upload.fields([{ name: "avatar" }, { name: "banner" }]),
  updateChannel
);

/* DELETE */
router.delete("/:id", protect, deleteChannel);

/* STUDIO */
router.get("/studio/me", protect, getStudioData);

/* GET */
router.get("/", getAllChannels);
router.get("/me", protect, getMyChannel);
router.get("/:id", getChannel);

/* SUBSCRIBE */
router.put("/:id/subscribe", protect, toggleSubscribe);

export default router;