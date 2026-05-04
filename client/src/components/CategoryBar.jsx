// client/src/components/CategoryBar.jsx

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* 🔥 FULL CATEGORY LIST */
const categories = [
  "All","Music","Remixes",
  "Trending", "Cricket", "New to you", 
   "Comedy",
  "Live", "Podcasts", "Mixes", "Shorts",
  "Gaming",  "Gameplays",
  "Programming", "React", "JavaScript", "AI", "Tech", "Tutorials",
  "News", "Politics", "Documentaries",
  "Football", "Bat-and-Ball Sports",
  "Telugu cinema", "Tamil cinema", "Hindi cinema",
  "Animated films", "Art", "Design",
  "Shopping", "Fashion", "Food", "Travel",
];

export default function CategoryBar({ onSelect }) {
  const [active, setActive] = useState("All");
  const scrollRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  /*  CHECK SCROLL VISIBILITY */
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  /*  SCROLL */
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 300);
  };

  /*  SELECT */
  const handleSelect = (cat, index) => {
    setActive(cat);
    onSelect?.(cat);

    document.getElementById(`cat-${index}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="sticky top-14 z-40 bg-[#0f0f0f] border-b border-[#222]">

      <div className="relative flex items-center px-3 py-2">

        {/*  LEFT FADE + ARROW */}
        {showLeft && (
          <div className="absolute left-0 top-0 h-full flex items-center bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f] to-transparent pr-2 z-10">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full hover:bg-[#272727]"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        {/*  SCROLLER */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide px-6"
          >
            {categories.map((cat, i) => (
              <button
                key={cat}
                id={`cat-${i}`}
                onClick={() => handleSelect(cat, i)}
                className={`
                  px-3 py-1.5 text-sm rounded-full whitespace-nowrap
                  transition-all duration-200

                  ${
                    active === cat
                      ? "bg-white text-black"
                      : "bg-[#272727] hover:bg-[#3a3a3a]"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/*  RIGHT FADE + ARROW */}
        {showRight && (
          <div className="absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-[#0f0f0f] via-[#0f0f0f] to-transparent pl-2 z-10">
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full hover:bg-[#272727]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}