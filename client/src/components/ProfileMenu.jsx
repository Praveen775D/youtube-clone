import {
  LogOut,
  Settings,
  HelpCircle,
  Globe,
  Moon,
  UserCircle,
  Video,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ user, onClose }) {
  const navigate = useNavigate();

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  /* ================= CHANNEL ================= */
  const handleChannel = () => {
    onClose?.();

    if (user?.channelId) {
      navigate(`/channel/${user.channelId}`);
    } else {
      navigate("/create-channel");
    }
  };

  /* ================= AVATAR FIX ================= */
  const getAvatar = () => {
    if (!user?.avatar) return null;

    // Google avatar OR uploaded avatar
    if (user.avatar.startsWith("http")) {
      return user.avatar;
    }

    return `http://localhost:5000${user.avatar}`;
  };

  return (
    <div className="absolute right-2 top-14 w-[320px] bg-[#0f0f0f] text-white rounded-2xl shadow-2xl border border-[#2a2a2a] z-50 overflow-hidden">

      {/* ================= HEADER ================= */}
      <div className="flex gap-4 p-4 border-b border-[#2a2a2a]">

        {/* AVATAR */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center text-lg font-bold">
          {getAvatar() ? (
            <img
              src={getAvatar()}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.username?.[0]?.toUpperCase() || "U"
          )}
        </div>

        {/* USER INFO */}
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-[15px]">
            {user?.username || "User"}
          </h3>

          <p className="text-xs text-gray-400">
            {user?.email || "user@email.com"}
          </p>

          <button
            onClick={handleChannel}
            className="text-blue-400 text-sm mt-1 hover:underline text-left"
          >
            {user?.channelId
              ? "View your channel"
              : "Create your channel"}
          </button>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <div className="py-2 text-sm">

        <MenuItem
          icon={<UserCircle size={18} />}
          label="Your Channel"
          onClick={handleChannel}
        />

        <MenuItem label="Switch account" />

        <Divider />

        <MenuItem
          icon={<Video size={18} />}
          label="YouTube Studio"
        />

        <MenuItem
          icon={<CreditCard size={18} />}
          label="Purchases and memberships"
        />

        <Divider />

        <MenuItem
          icon={<Moon size={18} />}
          label="Appearance"
        />

        <MenuItem label="Language" />

        <MenuItem
          icon={<Globe size={18} />}
          label="Location"
        />

        <Divider />

        <MenuItem
          icon={<Settings size={18} />}
          label="Settings"
        />

        <MenuItem
          icon={<HelpCircle size={18} />}
          label="Help"
        />

        <Divider />

        <MenuItem
          icon={<LogOut size={18} />}
          label="Sign out"
          onClick={logout}
          danger
        />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MenuItem({ label, icon, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition
        ${danger
          ? "hover:bg-red-600/20 text-red-400"
          : "hover:bg-[#272727]"}`}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      <span className="text-[14px]">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-[#2a2a2a] my-2" />;
}