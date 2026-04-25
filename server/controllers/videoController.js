import Video from "../models/Video.js";


// GET ALL VIDEOS (search + filter + pagination)
export const getVideos = async (req, res) => {
  try {
    const { search = "", category = "All", page = 1, limit = 8 } = req.query;

    const query = {
      title: { $regex: search, $options: "i" },
    };

    if (category !== "All") {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate("uploader", "username")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE VIDEO
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", "username");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE VIDEO
export const createVideo = async (req, res) => {
  try {
    const { title, videoUrl, thumbnailUrl } = req.body;

    if (!title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      videoUrl: req.body.videoUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      category: req.body.category,
      uploader: req.user._id,
      channelId: req.body.channelId,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE VIDEO
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;
    video.category = req.body.category || video.category;
    video.thumbnailUrl = req.body.thumbnailUrl || video.thumbnailUrl;

    const updated = await video.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE VIDEO
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LIKE VIDEO
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user._id;

    if (video.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    video.likes.push(userId);
    video.dislikes = video.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );

    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DISLIKE VIDEO
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user._id;

    if (video.dislikes.includes(userId)) {
      return res.status(400).json({ message: "Already disliked" });
    }

    video.dislikes.push(userId);
    video.likes = video.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};