// server/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    avatar: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

    /*  IMPORTANT: LINK USER → CHANNEL */
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      default: null,
    },

    /*  SUBSCRIBERS (FOR FUTURE USE) */
    subscribers: {
      type: Number,
      default: 0,
    },

    /*  SUBSCRIPTIONS */
    subscribedChannels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],

    /* GOOGLE LOGIN SUPPORT */
    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);