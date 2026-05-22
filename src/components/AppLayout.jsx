import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function AppLayout() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-shell">
      <header className="mobile-header">
        <h2>RoleBase</h2>

        <button
          className="menu-button"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      </header>
       {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={sidebarOpen ? "sidebar open" : "sidebar close"}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      <main className="main-content">
        <Topbar />
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}