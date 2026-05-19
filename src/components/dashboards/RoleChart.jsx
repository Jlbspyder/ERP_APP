import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext.jsx";

export default function RoleChart() {
  const { employees } = useAppData();

  const roleCounts = employees.reduce((acc, employee) => {
    acc[employee.role] = (acc[employee.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <h3>Role Distribution</h3>
        <p>Employees grouped by assigned role</p>
      </div>
      <Link to="/roles" className="view-all-link">
        View Roles
      </Link>

      <div className="role-list">
        {Object.entries(roleCounts).slice(0, 7).map(([role, count]) => (
          <div className="role-row" key={role}>
            <span>{role}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}