// client/src/components/VideoCard.jsx

import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { getMediaUrl } from "../utils/media";
export default function VideoCard({ video }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const enter = () => {
    timerRef.current = setTimeout(() => {
      setHover(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 300);
  };

  const leave = () => {
    clearTimeout(timerRef.current);
    setHover(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link to={`/video/${video._id}`}>
      <div
        onMouseEnter={enter}
        onMouseLeave={leave}
        className="cursor-pointer group"
      >

        {/* THUMBNAIL / HOVER VIDEO */}
        <div className="aspect-video rounded-xl overflow-hidden bg-black relative">

          {!hover ? (
            <img
              src={getMediaUrl(video.thumbnailUrl)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              alt="thumbnail"
            />
          ) : (
            <video
              ref={videoRef}
              src={getMediaUrl(video.videoUrl)}
              muted
              loop
              className="w-full h-full object-cover"
            />
          )}

        </div>

        {/* INFO */}
        <div className="flex gap-3 mt-2">

          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-xs">
            {video.uploader?.username?.charAt(0)}
          </div>

          <div>
            <h3 className="text-sm font-medium line-clamp-2">
              {video.title}
            </h3>

            <p className="text-xs text-gray-400">
              {video.uploader?.username}
            </p>

            <p className="text-xs text-gray-400">
              {video.views?.toLocaleString()} views
            </p>
          </div>

        </div>

      </div>
    </Link>
  );
}