// client/src/pages/UploadVideo.jsx

import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

/* 🔥 FULL CATEGORY LIST */
const categories = [
  "All",
  "Trending", "Recently uploaded", "New to you", "Watched",
  "Music", "Vocal Music", "Concerts", "Remixes",
  "Movies", "Theatre", "Comedy", "Jabardasth", "Sudigali Sudheer",
  "Live", "Podcasts", "Mixes", "Shorts",
  "Gaming", "Esports", "Gameplays",
  "Programming", "React", "JavaScript", "AI", "Tech", "Tutorials",
  "News", "Politics", "Documentaries",
  "Cricket", "Football", "Bat-and-Ball Sports",
  "Telugu cinema", "Tamil cinema", "Hindi cinema",
  "Animated films", "Art", "Design",
  "Shopping", "Fashion", "Food", "Travel",
];

export default function UploadVideo() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("file");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technology",
    tags: "",
    videoUrl: "",
    thumbnailUrl: "",
  });

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [preview, setPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const handleUpload = async () => {
    try {
      if (!form.title) return alert("Title required");

      if (mode === "file") {
        if (!video) return alert("Select video file");
        if (!thumbnail) return alert("Select thumbnail");
      }

      if (mode === "url") {
        if (!form.videoUrl) return alert("Enter video URL");
        if (!form.thumbnailUrl) return alert("Enter thumbnail URL");
      }

      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("tags", form.tags);

      if (mode === "file") {
        data.append("video", video);
        data.append("thumbnail", thumbnail);
      } else {
        data.append("videoUrl", form.videoUrl);
        data.append("thumbnailUrl", form.thumbnailUrl);
      }

      const res = await API.post("/videos/upload", data);

      alert("🚀 Uploaded!");
      navigate(`/video/${res.data.video._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

        {/* MODE SWITCH */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("file")}
            className={`px-4 py-2 rounded ${
              mode === "file" ? "bg-red-600" : "bg-[#222]"
            }`}
          >
            Upload File
          </button>

          <button
            onClick={() => setMode("url")}
            className={`px-4 py-2 rounded ${
              mode === "url" ? "bg-red-600" : "bg-[#222]"
            }`}
          >
            Use Video URL
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ================= LEFT ================= */}
          <div className="space-y-6">

            {/* FILE MODE */}
            {mode === "file" && (
              <div
                className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-red-500"
                onClick={() =>
                  document.getElementById("videoInput").click()
                }
              >
                {preview ? (
                  <video
                    src={preview}
                    controls
                    className="max-h-72 mx-auto rounded"
                  />
                ) : (
                  <p className="text-gray-400">Click to upload video</p>
                )}

                <input
                  id="videoInput"
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setVideo(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            )}

            {/* URL MODE */}
            {mode === "url" && (
              <>
                <input
                  placeholder="Paste video URL (mp4 or stream)"
                  value={form.videoUrl}
                  onChange={(e) =>
                    setForm({ ...form, videoUrl: e.target.value })
                  }
                  className="w-full p-3 bg-[#121212] border border-[#333] rounded"
                />

                <input
                  placeholder="Paste thumbnail image URL"
                  value={form.thumbnailUrl}
                  onChange={(e) =>
                    setForm({ ...form, thumbnailUrl: e.target.value })
                  }
                  className="w-full p-3 bg-[#121212] border border-[#333] rounded"
                />

                {/* Preview thumbnail */}
                {form.thumbnailUrl && (
                  <img
                    src={form.thumbnailUrl}
                    className="h-40 w-full object-cover rounded"
                  />
                )}
              </>
            )}

            {/* THUMBNAIL FILE MODE */}
            {mode === "file" && (
              <div
                className="border p-4 rounded cursor-pointer"
                onClick={() =>
                  document.getElementById("thumbInput").click()
                }
              >
                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    className="h-40 w-full object-cover rounded"
                  />
                ) : (
                  <p className="text-gray-400 text-center">
                    Upload Thumbnail
                  </p>
                )}

                <input
                  id="thumbInput"
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setThumbnail(file);
                    setThumbPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-4">

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="w-full p-3 bg-[#121212] border border-[#333] rounded"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-3 bg-[#121212] border border-[#333] rounded"
            />

            {/* 🔥 CATEGORY DROPDOWN */}
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full p-3 bg-[#121212] border border-[#333] rounded"
            >
              {categories.map((cat, index) => (
                <option key={index}>{cat}</option>
              ))}
            </select>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-red-600 py-3 rounded hover:bg-red-700"
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}