// client/src/pages/VideoPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import CommentSection from "../components/CommentSection";
import CategoryBar from "../components/CategoryBar";

import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
} from "lucide-react";

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [category, setCategory] = useState("All");

  //  NEW: control play mode
  const [playing, setPlaying] = useState(false);

  /*   FETCH VIDEO   */
  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await API.get(`/videos/${id}`);
      setVideo(res.data);
      fetchRecommended(res.data.category || "All");
    } catch (err) {
      console.error(err);
    }
  };

  /*   RECOMMENDED   */
  const fetchRecommended = async (cat) => {
    try {
      const res = await API.get(`/videos?category=${cat}&limit=12`);
      setRecommended(res.data.videos);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecommended(category);
  }, [category]);

  /*   INIT LIKE STATUS   */
  useEffect(() => {
    if (video && user) {
      setLiked(video.likes?.includes(user._id));
      setDisliked(video.dislikes?.includes(user._id));
    }
  }, [video, user]);

  /*   LIKE   */
  const handleLike = async () => {
    try {
      setLiked(!liked);
      if (!liked) setDisliked(false);

      const res = await API.put(`/videos/${id}/like`);
      setVideo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /*   DISLIKE   */
  const handleDislike = async () => {
    try {
      setDisliked(!disliked);
      if (!disliked) setLiked(false);

      const res = await API.put(`/videos/${id}/dislike`);
      setVideo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /*   SHARE   */
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  /*   DOWNLOAD   */
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = video.videoUrl;
    link.download = video.title;
    link.click();
  };

  /*   SUBSCRIBE   */
  const handleSubscribe = async () => {
    try {
      const res = await API.put(
        `/channels/${video.channelId}/subscribe`
      );
      setSubscribed(res.data.subscribed);
    } catch (err) {
      console.error(err);
    }
  };

  if (!video) return <p className="text-white p-5">Loading...</p>;

  return (
    <div className="flex justify-center px-4 lg:px-8 py-4 text-white">

      <div className="flex gap-6 w-full max-w-[1400px]">

        {/*   LEFT   */}
        <div className="flex-1 max-w-[900px]">

          {/*   VIDEO (FIXED)   */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative">

            {!playing ? (
              //  THUMBNAIL VIEW (FIXED)
              <img
                src={
                  video.thumbnailUrl?.startsWith("http")
                    ? video.thumbnailUrl
                    : `http://localhost:5000${video.thumbnailUrl}`
                }
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setPlaying(true)}
                alt="thumbnail"
              />
            ) : (
              //  VIDEO PLAY
              <video
                src={
                  video.videoUrl?.startsWith("http")
                    ? video.videoUrl
                    : `http://localhost:5000${video.videoUrl}`
                }
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>

          {/* TITLE */}
          <h1 className="text-lg md:text-xl font-semibold mt-3">
            {video.title}
          </h1>

          {/* ACTION BAR */}
          <div className="flex justify-between items-center mt-2 flex-wrap gap-3">

            <p className="text-sm text-gray-400">
              {video.views?.toLocaleString()} views
            </p>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${
                  liked
                    ? "bg-white text-black"
                    : "bg-[#272727] hover:bg-[#3a3a3a]"
                }`}
              >
                <ThumbsUp size={18} />
                {video.likes?.length}
              </button>

              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${
                  disliked
                    ? "bg-white text-black"
                    : "bg-[#272727] hover:bg-[#3a3a3a]"
                }`}
              >
                <ThumbsDown size={18} />
                {video.dislikes?.length}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272727] hover:bg-[#3a3a3a]"
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272727] hover:bg-[#3a3a3a]"
              >
                <Download size={18} />
                Download
              </button>

            </div>
          </div>

          {/* CHANNEL */}
          <div className="flex justify-between items-center mt-4 border-t border-[#222] pt-4">

            <div
              onClick={() => navigate(`/channel/${video.channelId}`)}
              className="flex gap-3 items-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                {video.uploader?.username?.charAt(0)}
              </div>

              <div>
                <p className="font-semibold text-sm">
                  {video.uploader?.username}
                </p>
                <p className="text-xs text-gray-400">
                  {video.views?.toLocaleString()} subscribers
                </p>
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                subscribed
                  ? "bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-[#222] p-4 rounded-xl mt-4 text-sm">
            {video.description}
          </div>

          {/* COMMENTS */}
          <div className="mt-6">
            <CommentSection videoId={video._id} />
          </div>

        </div>

        {/*   RIGHT   */}
        <div className="w-[360px] hidden lg:flex flex-col">

          <div className="sticky top-16 z-40 bg-[#0f0f0f] pb-2">
            <CategoryBar onSelect={setCategory} />
          </div>

          <div className="flex flex-col gap-3 mt-2">

            {recommended.map((v) => (
              <div
                key={v._id}
                onClick={() => navigate(`/video/${v._id}`)}
                className="flex gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition"
              >

                <img
                  src={
                    v.thumbnailUrl?.startsWith("http")
                      ? v.thumbnailUrl
                      : `http://localhost:5000${v.thumbnailUrl}`
                  }
                  className="w-40 h-24 object-cover rounded-lg"
                  alt="thumb"
                />

                <div>
                  <p className="text-sm font-semibold line-clamp-2">
                    {v.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    {v.uploader?.username}
                  </p>

                  <p className="text-xs text-gray-400">
                    {v.views?.toLocaleString()} views
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}