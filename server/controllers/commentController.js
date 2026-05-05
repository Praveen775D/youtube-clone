// Controllers for comment-related operations

// server/controllers/commentController.js
import Comment from "../models/Comment.js";

/*   ADD   */
export const addComment = async (req, res) => {
  const { text, videoId } = req.body;

  const comment = await Comment.create({
    text,
    video: videoId,
    user: req.user._id,
  });

  const populated = await comment.populate("user", "username _id");

  res.status(201).json(populated);
};

/*   GET   */
export const getCommentsByVideo = async (req, res) => {
  const comments = await Comment.find({
    video: req.params.videoId,
  })
    .populate("user", "username _id")
    .sort({ createdAt: -1 });

  res.json(comments);
};

/*   UPDATE   */
export const updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) return res.status(404).json({ message: "Not found" });

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  comment.text = req.body.text;
  const updated = await comment.save();

  res.json(updated);
};

/*   DELETE   */
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) return res.status(404).json({ message: "Not found" });

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await comment.deleteOne();

  res.json({ message: "Deleted" });
};

/*   LIKE   */
export const likeComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  const userId = req.user._id;

  if (comment.likes.includes(userId)) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
    comment.dislikes.pull(userId);
  }

  await comment.save();
  res.json(comment);
};

/*   DISLIKE   */
export const dislikeComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  const userId = req.user._id;

  if (comment.dislikes.includes(userId)) {
    comment.dislikes.pull(userId);
  } else {
    comment.dislikes.push(userId);
    comment.likes.pull(userId);
  }

  await comment.save();
  res.json(comment);
};