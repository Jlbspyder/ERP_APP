import { NavLink } from "react-router-dom";
import { navigationItems } from "../data/navigation.js";
import { useAuth } from "../context/AuthContext.jsx";
import { can } from "../utils/permissions.js";
import { useFeatureFlag } from "../hooks/useFeatureFlag.js";

export default function Sidebar({ closeSidebar}) {
  const { user } = useAuth();
  const canViewPayroll = useFeatureFlag("payrollModule");
  const canViewAuditLogs = useFeatureFlag("auditLogs");
  const canViewPermissions = useFeatureFlag("permissionsMatrix");


  const visibleItems = navigationItems.filter((item) => {
    if (item.path === "/payroll" && !canViewPayroll) return false;
    if (item.path === "/audit-logs" && !canViewAuditLogs) return false;
    if (item.path === "/permissions" && !canViewPermissions) return false;

    return can(user, item.permission);
  });


  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">R</span>
        <div className="brand-text">
          <h1>RoleBase</h1>
          <p>Access Control</p>
        </div>
      </div>

      <nav className="nav-list">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}