import { useAuth } from "../context/AuthContext.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import DashboardStats from "../components/dashboards/Dashboardstats.jsx";
import RoleChart from "../components/dashboards/RoleChart.jsx";
import ApprovalSummary from "../components/dashboards/ApprovalSummary.jsx";
import ActivityFeed from "../components/dashboards/ActivityFeed.jsx";

export default function Dashboard() {
  const { user } = useAuth();
 
  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">Overview</p>
        <h1>Dashboard</h1>
        <p>
          Welcome back, {user.name}. Your available modules are based on your role and permissions.
        </p>
      </div>

      <div className="dashboard-grid">
        <DashboardStats />
        <RoleChart />
        <ApprovalSummary />
        <ActivityFeed />
      </div>
    </div>
  );
}