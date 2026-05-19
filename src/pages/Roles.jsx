import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";
import { formatTime } from "../utils/formatTime";

export default function Roles() {
  const { employees } = useAppData();

  return (
    <div>
      <div className="page-heading audit-log-heading">
        <div className="pp">
          <p className="eyebrow">System Activity</p>
          <h1>Employee Roles</h1>
          <p>Manage and view employee roles and permissions.</p>
        </div>
        <Link to="/dashboard" className="view-all-link">
          Back
        </Link>
      </div>

      <div className="timeline-card">
        {employees.map((employee) => (
          <div className="timeline-item" key={employee.id}>
            <span className="timeline-dot" />
            <div>
              <strong>{employee.role}</strong>
              <p>
                {employee.name} - {employee.department}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
