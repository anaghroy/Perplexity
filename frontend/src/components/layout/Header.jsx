import { Menu, Plus, Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <header className="header">
      {/* Mobile Menu Toggle (only visible on small screens via CSS) */}
      <button 
        className="mobile-menu-btn d-md-none" 
        onClick={onMenuClick}
        aria-label="Toggle Menu"
        style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
      >
        <Menu size={24} />
      </button>

      {/* Spacer to push new thread button to right on mobile */}
      <div style={{ flex: 1 }}></div>

      {/* Theme Toggle Button */}
      <button
        className="theme-toggle header-theme-toggle"
        onClick={() => dispatch(toggleTheme())}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        aria-label="Toggle theme"
        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Quick New Thread for Mobile */}
      <button 
        className="mobile-new-thread-btn d-md-none"
        style={{ display: 'none', background: 'var(--hover-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '50%', padding: '0.4rem', marginLeft: '0.5rem' }}
      >
        <Plus size={20} />
      </button>
    </header>
  );
};

export default Header;
