import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarActive &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".hamburger")
      ) {
        setSidebarActive(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [sidebarActive]);

  return (
    <div className="page-container">
      <button
        className="mobile-menu-toggle hamburger"
        onClick={toggleSidebar}
        aria-label="Abrir menu"
      >
        <img
          src={`${process.env.PUBLIC_URL || ""}/images/logo.png`}
          alt="Abrir menu"
          className="hamburger-logo"
          onError={(e) => {
            e.currentTarget.src = `${process.env.PUBLIC_URL || ""}/images/logo.png`;
          }}
        />
      </button>
      <div className="layout">
        <Sidebar isActive={sidebarActive} onToggle={toggleSidebar} />
        <main className="main">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
