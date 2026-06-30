import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import axiosInstance from "../axios.js";

const navItems = [
  {
    label: "Dashboard",
    path: "/layout",
    end: true,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "New Repo",
    path: "create-repo",
    end: true,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    accent: true,
  },
  {
    label: "My Repos",
    path: "repos",
    end: true,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "profile",
    end: true,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "http://localhost:3000/gitrag/logout",
        {},
        { withCredentials: true },
      );
      setUser(null);
      navigate("/login", { replace: true });
    } catch (_) {}
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-violet-600 text-white px-3 py-2 rounded-lg"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          w-55 min-h-screen
          bg-[#0a0a0f] border-r border-[#1e1e2a]
          p-4 flex flex-col justify-between
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div>
          <div className="mb-8 mt-10 md:mt-0 flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow shadow-violet-900/40">
              <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 2L19 7V15L11 20L3 15V7L11 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="11" cy="11" r="3" fill="white" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              GitRAG
            </span>
          </div>

          {/* Nav items */}
          <nav className="space-y-1">
            {navItems.map(({ label, path, icon, accent, end }) => (
              <NavLink
                key={label}
                to={path}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 relative overflow-hidden
                  ${
                    isActive
                      ? "bg-violet-500/10 text-violet-400 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.2)]"
                      : "text-[#9191a1] hover:bg-[#13131a] hover:text-white"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-violet-500" />
                    )}
                    <span
                      className={`shrink-0 ${isActive ? "text-violet-400" : "text-[#4a4a5a] group-hover:text-white transition-colors"}`}
                    >
                      {icon}
                    </span>
                    <span className="truncate">{label}</span>
                    {accent && !isActive && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-400 font-semibold border border-violet-500/20">
                        New
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom — user + logout */}
        <div className="space-y-1 border-t border-[#1e1e2a] pt-3">
          {/* User pill */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#13131a] border border-[#1e1e2a] mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">
                {/* {user?.name ?? "User"} */}
              </p>
              <p className="text-[#4a4a5a] text-[11px] truncate">
                {user?.username ? `@${user.username}` : ""}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#9191a1] hover:bg-red-500/5 hover:text-red-400 transition-all duration-150"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="shrink-0 text-[#4a4a5a] group-hover:text-red-400 transition-colors"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
