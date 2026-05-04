// server/models/Channel.js

import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    channelAvatar: {
      type: String,
      default: "",
    },

    channelBanner: {
      type: String,
      default: "",
    },

    subscribers: {
      type: Number,
      default: 0,
    },

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Channel ||
  mongoose.model("Channel", channelSchema);