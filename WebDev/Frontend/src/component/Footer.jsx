import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#1e1e2a] bg-[#0a0a0f] px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand */}
      <div className="flex items-center gap-2 select-none">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow shadow-violet-900/40">
          <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 2L19 7V15L11 20L3 15V7L11 2Z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="11" cy="11" r="2.5" fill="white" />
          </svg>
        </div>
        <span className="text-[#9191a1] text-xs font-medium">GitRAG</span>
        <span className="text-[#1e1e2a] text-xs">·</span>
        <span className="text-[#35353f] text-xs">
          © {new Date().getFullYear()}
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-5 text-xs text-[#35353f]">
        {[
          { label: "Docs", to: "/docs" },
          { label: "Privacy", to: "/privacy" },
          { label: "Terms", to: "/terms" },
          { label: "Support", to: "/support" },
        ].map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="hover:text-[#9191a1] transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
        <span className="text-[#35353f] text-xs">All systems operational</span>
      </div>
    </footer>
  );
};

export default Footer;
