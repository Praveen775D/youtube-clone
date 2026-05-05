// server/controllers/videoController.js

import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

/*   GET VIDEOS   */
export const getVideos = async (req, res) => {
  try {
    const { search = "", category = "All", page = 1, limit = 12 } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    if (category !== "All") query.category = category;

    const videos = await Video.find(query)
      .populate("uploader", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Video.countDocuments(query);

    res.json({ videos, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*   GET VIDEO   */
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "uploader",
      "username"
    );

    if (!video) return res.status(404).json({ message: "Video not found" });

    video.views += 1;
    await video.save();

    res.json(video);
  } catch {
    res.status(500).json({ message: "Error fetching video" });
  }
};

/*   UPLOAD VIDEO   */
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, category, videoUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    const videoFile = req.files?.video?.[0];
    const thumbFile = req.files?.thumbnail?.[0];

    if (!videoFile && !videoUrl) {
      return res.status(400).json({
        message: "Upload video OR provide video URL",
      });
    }

    if (videoFile && !thumbFile) {
      return res.status(400).json({
        message: "Thumbnail required for file upload",
      });
    }

    const channel = await Channel.findOne({ owner: req.user._id });

    if (!channel) {
      return res.status(400).json({
        message: "Create a channel first",
      });
    }

    let finalVideoUrl = "";
    let finalThumbnail = "";

    if (videoFile) {
      finalVideoUrl = `${req.protocol}://${req.get("host")}/uploads/videos/${videoFile.filename}`;
      finalThumbnail = `${req.protocol}://${req.get("host")}/uploads/thumbnails/${thumbFile.filename}`;
    } else {
      finalVideoUrl = videoUrl;

      const match = videoUrl.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/);
      const youtubeId = match ? match[1] : null;

      finalThumbnail = youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
        : "/default-thumbnail.png";
    }

    const video = await Video.create({
      title,
      description,
      category,
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbnail,
      uploader: req.user._id,
      channelId: channel._id,
    });

    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json({
      success: true,
      video,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/*   UPDATE VIDEO   */
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, category } = req.body;

    if (title) video.title = title;
    if (description) video.description = description;
    if (category) video.category = category;

    await video.save();

    res.json({ success: true, video });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

/*   DELETE VIDEO   */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (video.channelId) {
      await Channel.findByIdAndUpdate(video.channelId, {
        $pull: { videos: video._id },
      });
    }

    await video.deleteOne();

    res.json({ success: true, message: "Video deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

/*    LIKE VIDEO   */
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userId = req.user._id;

    // remove dislike
    video.dislikes = video.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // toggle like
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      video.likes.push(userId);
    }

    await video.save();

    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Like failed" });
  }
};

/*    DISLIKE VIDEO   */
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userId = req.user._id;

    // remove like
    video.likes = video.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // toggle dislike
    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      video.dislikes.push(userId);
    }

    await video.save();

    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dislike failed" });
  }
};