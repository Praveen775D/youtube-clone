// client/src/pages/CreateChannel.jsx
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateChannel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    channelName: "",
    description: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("channelName", form.channelName);
      data.append("description", form.description);

      if (avatar) data.append("avatar", avatar);
      if (banner) data.append("banner", banner);

      const res = await API.post("/channels", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      /* 🔥 IMPORTANT FIX (ADD THIS) */
      const user = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...user,
        channelId: res.data.channel._id,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      /* ✅ REDIRECT TO CHANNEL */
      navigate(`/channel/${res.data.channel._id}`);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-white p-6">

      <h1 className="text-2xl font-bold mb-6">Create Channel</h1>

      {/* BANNER */}
      <div className="mb-5">
        <label className="block mb-2">Banner</label>

        <div className="w-full h-40 bg-[#222] rounded-lg flex items-center justify-center overflow-hidden relative">
          {previewBanner ? (
            <img src={previewBanner} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">Upload Banner</span>
          )}

          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files[0];
              setBanner(file);
              setPreviewBanner(URL.createObjectURL(file));
            }}
          />
        </div>
      </div>

      {/* AVATAR */}
      <div className="mb-5">
        <label className="block mb-2">Profile Photo</label>

        <div className="w-24 h-24 rounded-full bg-[#222] flex items-center justify-center overflow-hidden relative">
          {previewAvatar ? (
            <img src={previewAvatar} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-xs">Upload</span>
          )}

          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files[0];
              setAvatar(file);
              setPreviewAvatar(URL.createObjectURL(file));
            }}
          />
        </div>
      </div>

      {/* NAME */}
      <input
        placeholder="Channel name"
        className="w-full p-3 bg-[#121212] border border-[#333] rounded mb-4"
        value={form.channelName}
        onChange={(e) =>
          setForm({ ...form, channelName: e.target.value })
        }
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Description"
        className="w-full p-3 bg-[#121212] border border-[#333] rounded mb-4"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-red-600 px-6 py-2 rounded hover:bg-red-700"
      >
        Create Channel
      </button>
    </div>
  );
}