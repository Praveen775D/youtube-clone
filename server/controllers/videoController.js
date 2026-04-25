import Video from "../models/Video.js";


//  GET ALL VIDEOS (with search + filter)
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate("uploader", "username")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  GET SINGLE VIDEO
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", "username");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  CREATE VIDEO
export const createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channelId,
    } = req.body;

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      uploader: req.user._id,
      channelId,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  UPDATE VIDEO
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Only owner can update
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  DELETE VIDEO
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Only owner can delete
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  LIKE VIDEO
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    video.likes += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  DISLIKE VIDEO
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    video.dislikes += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};