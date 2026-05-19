import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";
import { formatTime } from "../utils/formatTime";

export default function AuditLog() {
  const { auditLogs } = useAppData();

  return (
    <div>
      <div className="page-heading audit-log-heading">
        <div className="pp">
          <p className="eyebrow">System Activity</p>
          <h1>Audit Logs</h1>
          <p>Track important actions performed across the system.</p>
        </div>
        <Link to="/dashboard" className="view-all-link">
          Back
        </Link>
      </div>

      <div className="timeline-card">
        {auditLogs.map((log) => (
          <div className="timeline-item" key={log.id}>
            <span className="timeline-dot" />
            <div>
              <strong>{log.action}</strong>
              <p>
                {log.actor} → {log.target}
              </p>
              <small>
                {log.createdAt ? formatTime(log.createdAt) : "Unknown time"}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
