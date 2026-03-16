import { NavLink, Link } from "react-router";
import {
  Home,
  Compass,
  Library,
  Plus,
  ChevronDown,
  MessageSquare,
  Settings,
  Smartphone,
  Hexagon,
  Info,
  X,
} from "lucide-react";
import ThreadList from "./ThreadList";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
      {/* Close button for Mobile only */}
      <button
        className="mobile-close-btn d-md-none"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          display: "none",
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
        }}
      >
        <X size={20} />
      </button>

      <div className="sidebar-top">
        <div className="brand">
          <div
            className="brand-logo bg-cyan-500 text-white rounded font-bold flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#06b6d4",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            P
          </div>
          <span className="brand-name">Perplexity Clone</span>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            end
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/discover"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Compass size={20} />
            <span>Discover</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Library size={20} />
            <span>Library</span>
          </NavLink>
        </nav>

        <div className="new-thread-container">
          <button className="new-thread-btn">
            <span>New Thread</span>
            <span className="shortcut">Ctrl I</span>
          </button>
        </div>

        <div className="history-section">
          <h3 className="section-title">HISTORY</h3>
          <ThreadList />
        </div>
      </div>

      <div className="sidebar-bottom">
        <Link to="/settings" className="bottom-link">
          <span>Settings</span>
        </Link>
        <button className="bottom-link w-full text-left">
          <span>Download App</span>
        </button>

        <div className="user-profile">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="User avatar"
            className="avatar"
          />
          <span className="user-name">Alex Doe</span>
          <ChevronDown size={16} className="dropdown-icon" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
