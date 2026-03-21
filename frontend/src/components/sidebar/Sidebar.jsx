import { NavLink, Link, useNavigate } from "react-router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import lightImage from "../../assets/images/perplexity-icon-light.png";
import darkImage from "../../assets/images/perplexity-icon-dark.png";

import { Home, Compass, Library, ChevronDown, X } from "lucide-react";
import ThreadList from "./ThreadList";
import useChat from "../../hooks/useChat";
import { logoutUser } from "../../features/auth/authSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { clearChat } = useChat();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.theme.theme);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleNewThread = () => {
    clearChat();
    navigate("/");
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };
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
          <div className="brand-logo">
            <img
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
              src={theme === "dark" ? darkImage : lightImage}
              alt="logo"
            />
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
          <button className="new-thread-btn" onClick={handleNewThread}>
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

        <div
          className="user-profile-container"
          style={{ position: "relative" }}
        >
          {isMenuOpen && (
            <div className="user-menu-popover">
              <div className="menu-group">
                <button className="menu-item">Preferences</button>
                <button className="menu-item">Personalization</button>
                <button className="menu-item">Shortcuts</button>
                <button className="menu-item">Connections</button>
                <button className="menu-item">All settings</button>
              </div>
              <div className="menu-divider"></div>
              <div className="menu-group">
                <button className="menu-item">Upgrade plan</button>
                <button className="menu-item">Install apps</button>
                <button className="menu-item">Appearance</button>
                <button className="menu-item">Language</button>
                <button className="menu-item">Help</button>
              </div>
              <div className="menu-divider"></div>
              <div className="menu-group">
                <button
                  className="menu-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          <div
            className="user-profile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <img
              src={
                user?.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              }
              alt="User avatar"
              className="avatar"
            />
            <span className="user-name">{user?.username || "Alex Doe"}</span>
            <ChevronDown size={16} className="dropdown-icon" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
