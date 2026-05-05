// client/src/components/Sidebar.jsx

import {
  Home,
  PlaySquare,
  History,
  User,
  Music,
  Film,
  ShoppingBag,
  Settings,
  Flag,
  HelpCircle,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, isWatchPage, setSidebarOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/*  BACKDROP (ONLY WATCH PAGE) */}
      {isWatchPage && isOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/*  SIDEBAR */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-56px)]
          bg-[#0f0f0f] border-r border-[#222]
          z-50 transition-all duration-300 ease-in-out

          ${
            isWatchPage
              ? isOpen
                ? "translate-x-0 w-56"
                : "-translate-x-full w-56"
              : isOpen
              ? "w-56"
              : "w-20"
          }
        `}
      >
        <div className="flex flex-col gap-2 px-2 py-3 text-white overflow-y-auto scrollbar-hide h-full pb-10">

          {/* MAIN */}
          <Section>
            <SidebarItem
              to="/"
              icon={<Home size={22} />}
              label="Home"
              isOpen={isOpen}
              active={isActive("/")}
            />

            <SidebarItem
              icon={<PlaySquare size={22} />}
              label="Shorts"
              isOpen={isOpen}
            />

            <SidebarItem
              to="/subscriptions"
              icon={<User size={22} />}
              label="Subscriptions"
              isOpen={isOpen}
              active={isActive("/subscriptions")}
            />
          </Section>

          <Divider />

          {/*  USER SECTION */}
          {!user ? (
            <>
              <Section title={isOpen ? "You" : ""}>
                <SidebarItem icon={<History size={22} />} label="History" isOpen={isOpen} />
              </Section>

              {isOpen && (
                <div className="px-3 text-sm text-gray-400">
                  <p>Sign in to like videos, comment, and subscribe.</p>
                  <Link to="/login">
                    <button className="mt-2 border px-3 py-1 rounded-full hover:bg-[#222] transition">
                      Sign in
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Section title={isOpen ? "You" : ""}>
                <SidebarItem
                  to={`/channel/${user.channelId || ""}`}
                  icon={<User size={22} />}
                  label="Your channel"
                  isOpen={isOpen}
                />

                <SidebarItem icon={<History size={22} />} label="History" isOpen={isOpen} />
                <SidebarItem icon={<PlaySquare size={22} />} label="Playlists" isOpen={isOpen} />
              </Section>
            </>
          )}

          <Divider />

          {/*  EXPLORE */}
          <Section title={isOpen ? "Explore" : ""}>
            <SidebarItem icon={<ShoppingBag size={22} />} label="Shopping" isOpen={isOpen} />
            <SidebarItem icon={<Music size={22} />} label="Music" isOpen={isOpen} />
            <SidebarItem icon={<Film size={22} />} label="Movies" isOpen={isOpen} />
          </Section>

          <Divider />

          {/*  SETTINGS */}
          <Section>
            <SidebarItem icon={<Settings size={22} />} label="Settings" isOpen={isOpen} />
            <SidebarItem icon={<Flag size={22} />} label="Report history" isOpen={isOpen} />
            <SidebarItem icon={<HelpCircle size={22} />} label="Help" isOpen={isOpen} />
          </Section>

          {/* FOOTER */}
          {isOpen && (
            <div className="text-xs text-gray-400 px-3 mt-4 space-y-2">
              <p>About Press Copyright Contact</p>
              <p>Creators Advertise Developers</p>
              <p>Terms Privacy Policy</p>
              <p className="pt-2">© 2026 YouTube Clone</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/*   UI   */

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1">
      {title && <p className="text-sm text-gray-400 px-3 mt-2">{title}</p>}
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-[#222] my-2" />;
}

function SidebarItem({ to, icon, label, isOpen, active }) {
  const baseClass = `
    flex items-center
    ${isOpen ? "gap-4 px-3" : "justify-center"}
    py-2 rounded-lg cursor-pointer
    transition-all duration-200
    ${active ? "bg-[#272727]" : "hover:bg-[#272727]"}
  `;

  const content = (
    <div className={baseClass}>
      {icon}
      {isOpen && <span className="text-sm">{label}</span>}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}