// server/controllers/channelController.js

import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

/*   HELPERS   */

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1503264116251-35a269479413";

const send = (res, status, data) => res.status(status).json(data);

/*  BUILD FULL URL (FIXED) */
const buildUrl = (req, filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;

  return `${req.protocol}://${req.get("host")}${filePath}`;
};

/*   CREATE CHANNEL   */

export const createChannel = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return send(res, 401, { message: "Unauthorized" });

    const { channelName, description } = req.body;

    if (!channelName?.trim()) {
      return send(res, 400, { message: "Channel name required" });
    }

    //  Only one channel per user
    const exists = await Channel.findOne({ owner: userId });
    if (exists) {
      return send(res, 400, {
        message: "Channel already exists",
        channelId: exists._id,
      });
    }

    const avatarFile = req.files?.avatar?.[0];
    const bannerFile = req.files?.banner?.[0];

    const avatarPath = avatarFile
      ? `/uploads/avatars/${avatarFile.filename}`
      : DEFAULT_AVATAR;

    const bannerPath = bannerFile
      ? `/uploads/banners/${bannerFile.filename}`
      : DEFAULT_BANNER;

    const channel = await Channel.create({
      channelName: channelName.trim(),
      description: description || "",
      channelAvatar: buildUrl(req, avatarPath),
      channelBanner: buildUrl(req, bannerPath), 
      owner: userId,
      subscribers: 0,
    });

    await User.findByIdAndUpdate(userId, {
      channelId: channel._id,
    });

    send(res, 201, { success: true, channel });
  } catch (err) {
    console.error("CREATE CHANNEL ERROR:", err);
    send(res, 500, { message: "Server error" });
  }
};

/*   GET SINGLE CHANNEL   */

export const getChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id)
      .populate("owner", "_id username avatar")
      .lean();

    if (!channel) {
      return send(res, 404, { message: "Channel not found" });
    }

    channel.channelAvatar = buildUrl(req, channel.channelAvatar);
    channel.channelBanner = buildUrl(req, channel.channelBanner);

    const videos = await Video.find({ channelId: id }).lean();

    channel.videos = videos.map((v) => ({
      ...v,
      thumbnailUrl: buildUrl(req, v.thumbnailUrl), 
    }));

    send(res, 200, { success: true, channel });
  } catch (err) {
    console.error("GET CHANNEL ERROR:", err);
    send(res, 500, { message: "Error fetching channel" });
  }
};

/*   GET MY CHANNEL   */

export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id })
      .populate("owner", "_id username avatar")
      .lean();

    if (!channel) {
      return send(res, 404, { message: "No channel found" });
    }

    channel.channelAvatar = buildUrl(req, channel.channelAvatar);
    channel.channelBanner = buildUrl(req, channel.channelBanner);

    const videos = await Video.find({ channelId: channel._id }).lean();

    channel.videos = videos.map((v) => ({
      ...v,
      thumbnailUrl: buildUrl(req, v.thumbnailUrl),
    }));

    send(res, 200, { success: true, channel });
  } catch (err) {
    console.error("GET MY CHANNEL ERROR:", err);
    send(res, 500, { message: "Error fetching your channel" });
  }
};

/*   UPDATE CHANNEL   */

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return send(res, 404, { message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return send(res, 403, { message: "Not authorized" });
    }

    const { channelName, description } = req.body;

    if (channelName?.trim()) {
      channel.channelName = channelName.trim();
    }

    if (description !== undefined) {
      channel.description = description;
    }

    const avatarFile = req.files?.avatar?.[0];
    const bannerFile = req.files?.banner?.[0];

    if (avatarFile) {
      channel.channelAvatar = buildUrl(
        req,
        `/uploads/avatars/${avatarFile.filename}`
      );
    }

    if (bannerFile) {
      channel.channelBanner = buildUrl(
        req,
        `/uploads/banners/${bannerFile.filename}`
      );
    }

    await channel.save();

    send(res, 200, { success: true, channel });
  } catch (err) {
    console.error("UPDATE CHANNEL ERROR:", err);
    send(res, 500, { message: "Error updating channel" });
  }
};

/*   GET ALL CHANNELS   */

export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate("owner", "_id username avatar")
      .sort({ subscribers: -1 })
      .lean();

    const formatted = channels.map((ch) => ({
      ...ch,
      channelAvatar: buildUrl(req, ch.channelAvatar),
      channelBanner: buildUrl(req, ch.channelBanner),
    }));

    send(res, 200, { success: true, channels: formatted });
  } catch (err) {
    console.error("GET ALL CHANNELS ERROR:", err);
    send(res, 500, { message: "Error fetching channels" });
  }
};

/*   SUBSCRIBE   */

export const toggleSubscribe = async (req, res) => {
  try {
    const channelId = req.params.id;

    const [user, channel] = await Promise.all([
      User.findById(req.user._id),
      Channel.findById(channelId),
    ]);

    if (!channel) {
      return send(res, 404, { message: "Channel not found" });
    }

    const isSubscribed = user.subscribedChannels.includes(channelId);

    if (isSubscribed) {
      user.subscribedChannels.pull(channelId);
      channel.subscribers = Math.max(0, channel.subscribers - 1);
    } else {
      user.subscribedChannels.push(channelId);
      channel.subscribers += 1;
    }

    await Promise.all([user.save(), channel.save()]);

    send(res, 200, {
      success: true,
      subscribed: !isSubscribed,
      subscribers: channel.subscribers,
    });
  } catch (err) {
    console.error("SUBSCRIBE ERROR:", err);
    send(res, 500, { message: "Error subscribing" });
  }
};

/*   DELETE CHANNEL   */

export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return send(res, 404, { message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return send(res, 403, { message: "Not authorized" });
    }

    await Video.deleteMany({ channelId: channel._id });

    await User.findByIdAndUpdate(channel.owner, {
      $unset: { channelId: "" },
    });

    await channel.deleteOne();

    send(res, 200, {
      success: true,
      message: "Channel deleted successfully",
    });
  } catch (err) {
    console.error("DELETE CHANNEL ERROR:", err);
    send(res, 500, { message: "Error deleting channel" });
  }
};

/*   STUDIO DATA   */

export const getStudioData = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id }).lean();

    if (!channel) {
      return send(res, 404, { message: "No channel found" });
    }

    const videos = await Video.find({ channelId: channel._id }).lean();

    const totalViews = videos.reduce(
      (sum, v) => sum + (v.views || 0),
      0
    );

    send(res, 200, {
      success: true,
      stats: {
        subscribers: channel.subscribers,
        totalVideos: videos.length,
        totalViews,
      },
      videos,
      channel,
    });
  } catch (err) {
    console.error("STUDIO ERROR:", err);
    send(res, 500, { message: "Error fetching studio data" });
  }
};