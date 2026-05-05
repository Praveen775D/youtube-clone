// This component is the main page of the application, displaying a list of videos based on the selected category. It implements infinite scrolling to load more videos as the user scrolls down.

// client/src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CategoryBar from "../components/CategoryBar";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchVideos = async (cat, pageNum, reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/videos?category=${cat}&page=${pageNum}&limit=12`
      );

      const newVideos = res.data.videos;

      setVideos((prev) =>
        reset ? newVideos : [...prev, ...newVideos]
      );

      setHasMore(newVideos.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    setVideos([]);
    setPage(1);
    setHasMore(true);

    fetchVideos(category, 1, true);
  }, [category]);

  useEffect(() => {
    if (!user) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          const next = page + 1;
          setPage(next);
          fetchVideos(category, next);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [page, loading, hasMore]);

  if (!user) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-gray-400">
        Please login to view videos
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4">

      <CategoryBar onSelect={setCategory} />

      {/*  YOUTUBE GRID */}
      <div className="grid gap-5 mt-3
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3

      ">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>

      <div ref={loaderRef} className="h-12 flex justify-center">
        {loading && <p className="text-gray-400">Loading...</p>}
      </div>
    </div>
  );
}