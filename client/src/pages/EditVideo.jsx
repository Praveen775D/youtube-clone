// client/src/pages/EditVideo.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

export default function EditVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:5000";

  /* ================= FETCH VIDEO ================= */
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await API.get(`/videos/${id}`);

        // 🔥 SAFE DATA HANDLING
        const v =
          res.data.video ||
          res.data.data ||
          res.data;

        if (!v) throw new Error("No video data");

        setTitle(v.title || "");
        setDescription(v.description || "");

        const thumb =
          v.thumbnail ||
          v.thumbnailUrl ||
          "";

        if (thumb) {
          setPreview(
            thumb.startsWith("http")
              ? thumb
              : `${BASE_URL}${thumb}`
          );
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load video ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  /* ================= THUMBNAIL ================= */
  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return setError("Thumbnail must be an image ❌");
    }

    setThumbnail(file);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!title.trim()) {
      return setError("Title is required");
    }

    try {
      setSaving(true);
      setError("");

      const form = new FormData();
      form.append("title", title);
      form.append("description", description);

      if (thumbnail) {
        form.append("thumbnail", thumbnail);
      }

      await API.put(`/videos/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Video updated ✅");
      navigate("/studio");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Update failed ❌"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await API.delete(`/videos/${id}`);
      alert("Video deleted ✅");
      navigate("/studio");
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <p className="text-white p-6">Loading...</p>;
  }

  return (
    <div className="text-white max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Edit Video
      </h1>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* ================= THUMBNAIL ================= */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-300">
          Thumbnail
        </label>

        <div className="w-full h-52 bg-[#222] rounded overflow-hidden flex items-center justify-center mb-3">
          {preview ? (
            <img
              src={preview}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">
              No Thumbnail
            </span>
          )}
        </div>

        {/* 🔥 CLEAR BUTTON UI */}
        <input
          type="file"
          accept="image/*"
          id="thumbnailInput"
          className="hidden"
          onChange={handleThumbnail}
        />

        <label
          htmlFor="thumbnailInput"
          className="inline-block px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
        >
          Choose Thumbnail
        </label>

        {fileName && (
          <p className="text-sm text-gray-400 mt-2">
            Selected: {fileName}
          </p>
        )}
      </div>

      {/* ================= TITLE ================= */}
      <div className="mb-4">
        <label className="text-sm text-gray-400">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 p-3 bg-[#121212] border border-[#333] rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mb-6">
        <label className="text-sm text-gray-400">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-3 bg-[#121212] border border-[#333] rounded h-32 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-4">

        <button
          onClick={handleUpdate}
          disabled={saving}
          className={`px-6 py-2 rounded font-semibold ${
            saving
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}