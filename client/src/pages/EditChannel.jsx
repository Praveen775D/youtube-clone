// This page is for editing an existing channel. It fetches the current channel data, allows the user to change the name, description, avatar, and banner, and then saves the changes via an API call.

// client/src/pages/EditChannel.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

export default function EditChannel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*   FETCH   */
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/channels/${id}`);
        const ch = res.data.channel;

        setName(ch.channelName || "");
        setDesc(ch.description || "");
        setAvatarPreview(ch.channelAvatar || "");
        setBannerPreview(ch.channelBanner || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load channel ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  /*   FILE HANDLER   */
  const handleFile = (file, type) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatarFile(file);
      setAvatarPreview(preview);
    } else {
      setBannerFile(file);
      setBannerPreview(preview);
    }
  };

  /*   SAVE   */
  const handleSave = async () => {
    try {
      const form = new FormData();

      form.append("channelName", name);
      form.append("description", desc);

      if (avatarFile) form.append("avatar", avatarFile);
      if (bannerFile) form.append("banner", bannerFile);

      await API.put(`/channels/${id}`, form);

      alert("Updated successfully ");
      navigate(`/channel/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed ");
    }
  };

  /*   UI   */

  if (loading) return <p className="text-white p-6">Loading...</p>;

  if (error)
    return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="text-white max-w-[900px] mx-auto py-6">

      <h1 className="text-2xl font-bold mb-6">Edit Channel</h1>

      {/* Banner */}
      <div className="relative mb-4">
        <img
          src={bannerPreview}
          className="w-full h-40 object-cover rounded"
        />
        <input
          type="file"
          onChange={(e) => handleFile(e.target.files[0], "banner")}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            src={avatarPreview}
            className="w-20 h-20 rounded-full object-cover"
          />
          <input
            type="file"
            onChange={(e) => handleFile(e.target.files[0], "avatar")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 bg-[#121212] border border-[#333] rounded mb-3"
        placeholder="Channel Name"
      />

      {/* Description */}
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full p-3 bg-[#121212] border border-[#333] rounded mb-3"
        placeholder="Description"
      />

      <button
        onClick={handleSave}
        className="bg-red-600 px-6 py-2 rounded hover:bg-red-700"
      >
        Save Changes
      </button>
    </div>
  );
}