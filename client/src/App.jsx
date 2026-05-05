// client/src/App.jsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import ChannelPage from "./pages/ChannelPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateChannel from "./pages/CreateChannel";
import UploadVideo from "./pages/UploadVideo";
import EditChannel from "./pages/EditChannel";
import Studio from "./pages/Studio";
// (if you have edit video page)
import EditVideo from "./pages/EditVideo";


/*  LAYOUT WRAPPER */
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isWatchPage = location.pathname.startsWith("/video");

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex bg-[#0f0f0f] text-white">

        {!isWatchPage && (
          <Sidebar
            isOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        <main
          className={`
            flex-1 pt-16 px-4 transition-all duration-300
            ${
              isWatchPage
                ? "ml-0 max-w-[1600px] mx-auto"
                : sidebarOpen
                ? "ml-56"
                : "ml-20"
            }
          `}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-channel" element={<CreateChannel />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/edit-channel/:id" element={<EditChannel />} />
            <Route path="/edit-video/:id" element={<EditVideo />} />
            <Route path="/upload" element={<UploadVideo />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

/* ROOT APP */
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}