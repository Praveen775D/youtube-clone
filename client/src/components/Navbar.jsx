// client/src/components/Navbar.jsx

import { Menu, Search, Mic, Bell, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ProfileMenu from "./ProfileMenu";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState("");

  const profileRef = useRef();
  const createRef = useRef();

  /*  FETCH CHANNEL */
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (!user) return;

        const res = await API.get("/channels/me");

        const updatedUser = {
          ...user,
          channelId: res.data.channel._id,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch {
        // no channel
      }
    };

    fetchChannel();
  }, [user]);

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const close = (e) => {
      if (!profileRef.current?.contains(e.target)) setOpenProfile(false);
      if (!createRef.current?.contains(e.target)) setOpenCreate(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="fixed top-0 w-full h-14 bg-[#0f0f0f] flex items-center justify-between px-6 border-b border-[#222] z-50">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Menu onClick={toggleSidebar} className="cursor-pointer" />
        <h1 onClick={() => navigate("/")} className="text-red-500 font-bold text-xl cursor-pointer">
          YouTube
        </h1>
      </div>

      {/* SEARCH */}
      <div className="flex flex-1 max-w-[650px] mx-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/?search=${search}`)}
          placeholder="Search"
          className="flex-1 px-4 py-2 bg-[#121212] border border-[#303030] rounded-l-full"
        />
        <button className="px-5 bg-[#222] rounded-r-full">
          <Search size={18} />
        </button>
        <button className="ml-2 p-2 bg-[#222] rounded-full">
          <Mic size={18} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6 relative">

        {/* CREATE */}
        {user && (
          <div ref={createRef} className="relative">
            <button
              onClick={() => setOpenCreate(!openCreate)}
              className="flex items-center gap-2 bg-[#222] px-4 py-2 rounded-full hover:bg-[#333]"
            >
              <Plus size={18} />
              <span className="hidden md:block">Create</span>
            </button>

            {openCreate && (
              <div className="absolute right-0 mt-3 w-52 bg-[#1f1f1f] rounded-xl shadow-lg">

                {!user.channelId ? (
                  <p
                    onClick={() => navigate("/create-channel")}
                    className="px-4 py-3 hover:bg-[#333] cursor-pointer"
                  >
                    Create Channel
                  </p>
                ) : (
                  <>
                    <p onClick={() => navigate("/upload")} className="px-4 py-3 hover:bg-[#333] cursor-pointer">
                      Upload Video
                    </p>

                    <p className="px-4 py-3 hover:bg-[#333] cursor-pointer">
                      Go Live
                    </p>

                    <p className="px-4 py-3 hover:bg-[#333] cursor-pointer">
                      Create Post
                    </p>

                    <p
                      onClick={() => navigate(`/channel/${user.channelId}`)}
                      className="px-4 py-3 hover:bg-[#333] cursor-pointer text-blue-400"
                    >
                      Your Channel
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* BELL */}
        {user && <Bell />}

        {/* PROFILE */}
        <div ref={profileRef}>
          {user ? (
            <>
              <div
                onClick={() => setOpenProfile(!openProfile)}
                className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
              >
                {user.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-orange-500 w-full h-full flex items-center justify-center">
                    {user.username?.charAt(0)}
                  </div>
                )}
              </div>

              {openProfile && (
                <ProfileMenu user={user} onClose={() => setOpenProfile(false)} />
              )}
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  );
}