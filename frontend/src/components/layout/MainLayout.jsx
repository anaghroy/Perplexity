import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../sidebar/Sidebar";
import RightSidebar from "./RightSidebar";
import Header from "./Header";

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="main-layout">
      {/* Overlay for mobile clicking outside to close */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
        onClick={closeMobileMenu}
      />
      
      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      
      <div className="content-wrapper">
        <Header onMenuClick={toggleMobileMenu} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};

export default MainLayout;
