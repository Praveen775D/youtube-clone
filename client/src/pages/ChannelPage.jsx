// client/src/pages/ChannelPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { MoreVertical } from "lucide-react";

export default function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  /* ================= SAFE IMAGE HANDLER ================= */
  const getImage = (url) => {
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `http://localhost:5000${url}`;
  };

  /* ================= FETCH CHANNEL ================= */
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await API.get(`/channels/${id}`);
        const ch = res.data.channel;

        setChannel(ch);

        const isSub = user?.subscribedChannels?.some(
          (c) => String(c) === String(id)
        );

        setSubscribed(isSub);
      } catch (err) {
        console.error("CHANNEL FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]); // 🔥 FIXED (removed user to stop loop)

  /* ================= OWNER CHECK ================= */
  const isOwner =
  user &&
  channel &&
  (String(user._id) === String(channel.owner?._id) ||
    String(user._id) === String(channel.owner));

  /* ================= SUBSCRIBE ================= */
  const handleSubscribe = async () => {
    try {
      const res = await API.put(`/channels/${id}/subscribe`);

      setSubscribed(res.data.subscribed);

      setChannel((prev) => ({
        ...prev,
        subscribers: res.data.subscribers,
      }));

      const updatedChannels = res.data.subscribed
        ? [...(user.subscribedChannels || []), id]
        : (user.subscribedChannels || []).filter(
            (c) => String(c) !== String(id)
          );

      const updatedUser = {
        ...user,
        subscribedChannels: updatedChannels,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error("SUBSCRIBE ERROR:", err);
    }
  };

  /* ================= DELETE VIDEO ================= */
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      await API.delete(`/videos/${videoId}`);

      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      console.error("DELETE VIDEO ERROR:", err);
    }
  };

  /* ================= DELETE CHANNEL ================= */
  const handleDeleteChannel = async () => {
    if (!window.confirm("Delete your channel permanently?")) return;

    try {
      await API.delete(`/channels/${id}`);

      const updatedUser = { ...user, channelId: null };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      navigate("/");
    } catch (err) {
      console.error("DELETE CHANNEL ERROR:", err);
    }
  };

  /* ================= UI ================= */
  if (loading)
    return <p className="text-white p-5">Loading channel...</p>;

  if (!channel)
    return <p className="text-white p-5">Channel not found</p>;

  return (
    <div className="text-white">

      {/* ================= BANNER ================= */}
      <div className="h-48 w-full">
        <img
          src={getImage(channel.channelBanner)}
          className="w-full h-full object-cover"
          alt="banner"
        />
      </div>

      {/* ================= HEADER ================= */}
      <div className="max-w-[1400px] mx-auto px-6 py-5 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {channel.channelAvatar ? (
              <img
                src={getImage(channel.channelAvatar)}
                className="w-full h-full object-cover"
                alt="avatar"
                onError={(e) => {
                  e.target.src =
                    "https://i.pravatar.cc/150";
                }}
              />
            ) : (
              channel.channelName?.charAt(0)
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold">
              {channel.channelName}
            </h1>
            <p className="text-gray-400 text-sm">
              {channel.subscribers} subscribers
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex gap-3">

          {!isOwner && (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full ${
                subscribed
                  ? "bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}

          {isOwner && (
            <>
              <button
                onClick={() => navigate("/upload")}
                className="bg-red-600 px-4 py-2 rounded-full"
              >
                Upload
              </button>

              <button
                onClick={() => navigate("/studio")}
                className="bg-[#272727] px-4 py-2 rounded-full"
              >
                Studio
              </button>

              <button
                onClick={() => navigate(`/edit-channel/${id}`)}
                className="bg-blue-600 px-4 py-2 rounded-full"
              >
                Edit
              </button>

              <button
                onClick={handleDeleteChannel}
                className="bg-red-800 px-4 py-2 rounded-full"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-[1400px] mx-auto px-6 text-gray-300 mb-6">
        {channel.description}
      </div>

      {/* VIDEOS */}
      <div className="max-w-[1400px] mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {channel.videos?.map((video) => (
            <div key={video._id} className="relative group">

              <div onClick={() => navigate(`/video/${video._id}`)}>
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  <img
                    src={getImage(video.thumbnailUrl)}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    alt="thumbnail"
                  />
                </div>

                <p className="text-sm mt-2 line-clamp-2">
                  {video.title}
                </p>
              </div>

              {isOwner && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() =>
                      setMenuOpen(
                        menuOpen === video._id ? null : video._id
                      )
                    }
                    className="p-1 bg-black/50 rounded-full"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpen === video._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-[#1f1f1f] rounded shadow-lg z-50">
                      <button
                        onClick={() =>
                          navigate(`/edit-video/${video._id}`)
                        }
                        className="block w-full px-3 py-2 text-left hover:bg-gray-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteVideo(video._id)
                        }
                        className="block w-full px-3 py-2 text-left text-red-400 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}