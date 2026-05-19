import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Topbar />
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}