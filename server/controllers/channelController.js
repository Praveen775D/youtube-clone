import Channel from "../models/Channel.js";
import Video from "../models/Video.js";


// ✅ CREATE CHANNEL
export const createChannel = async (req, res) => {
  try {
    const { channelName, description } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name required" });
    }

    const channel = await Channel.create({
      channelName,
      description,
      owner: req.user._id,
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET CHANNEL DETAILS
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ ADD VIDEO TO CHANNEL
export const addVideoToChannel = async (req, res) => {
  try {
    const { videoId } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    channel.videos.push(videoId);
    await channel.save();

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ DELETE VIDEO FROM CHANNEL
export const removeVideoFromChannel = async (req, res) => {
  try {
    const { videoId } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    channel.videos = channel.videos.filter(
      (id) => id.toString() !== videoId
    );

    await channel.save();

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};