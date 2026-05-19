import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext.jsx";
import { formatTime } from "../../utils/formatTime";

export default function ActivityFeed() {
  const { auditLogs } = useAppData();

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <section className="dashboard-card activity-card">
      <div className="card-heading">
        <h3>Recent Activity</h3>
      </div>
      <p>Latest actions recorded in the system</p>
      <Link to="/audit-logs" className="view-all-link">
        View All Activity
      </Link>

      <ul className="activity-list">
        {recentLogs.map((log) => (
          <li key={log.id} className="activity-item">
            <div>
              <strong>{log.action}</strong>
              <p>{log.actor}</p>
            </div>

            <span>{formatTime(log.createdAt)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
