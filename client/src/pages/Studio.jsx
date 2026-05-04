import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Studio() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await API.get("/channels/studio/me"); // ✅ FIXED

        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load studio ❌");
      }
    };

    fetchStudio();
  }, []);

  if (error) return <p className="text-red-500 p-5">{error}</p>;
  if (!data) return <p className="text-white p-5">Loading...</p>;

  const { stats, videos } = data;

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">YouTube Studio</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card title="Subscribers" value={stats.subscribers} />
        <Card title="Videos" value={stats.totalVideos} />
        <Card title="Views" value={stats.totalViews} />
      </div>

      {/* VIDEOS */}
      <h2 className="text-xl mb-4">Your Videos</h2>

      {videos.length === 0 ? (
        <p>No videos uploaded</p>
      ) : (
        videos.map((v) => (
          <div
            key={v._id}
            className="flex justify-between bg-[#222] p-3 mb-3 rounded"
          >
            <span>{v.title}</span>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = `/edit-video/${v._id}`}
                className="text-blue-400"
              >
                Edit
              </button>

              <button className="text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-[#1f1f1f] p-4 rounded-xl">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}