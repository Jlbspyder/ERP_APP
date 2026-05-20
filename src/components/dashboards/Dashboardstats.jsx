import { useAppData } from "../../context/AppDataContext.jsx";
import { Link } from "react-router-dom";

export default function DashboardStats() {
  const { employees, leaveRequests, auditLogs } = useAppData();

  const totalEmployees = localStorage.getItem("rbac_users")
    ? JSON.parse(localStorage.getItem("rbac_users")).length
    : employees.length;

  const pendingLeaveCount = leaveRequests.filter(
    (request) => request.status === "Pending",
  ).length;

  const stats = [
    {
      title: "Employees",
      value: totalEmployees,
      description: "Active workforce records",
      link: "/employees",
    },
    {
      title: "Leave Request",
      value: pendingLeaveCount,
      description: "Awaiting approval",
      link: "/leave-requests",
    },
    {
      title: "Audit Events",
      value: auditLogs.length,
      description: "Recent system activity",
      link: "/audit-logs",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <article className="stat-card" key={stat.title}>
          <p>{stat.link && (
            <Link to={stat.link} className="view-all-link">
              View All {stat.title}
            </Link>
          )}</p>
          <p>{stat.title}</p>
          <h2>{stat.value}</h2>
          <span>{stat.description}</span>
        </article>
      ))}
    </>
  );
}
