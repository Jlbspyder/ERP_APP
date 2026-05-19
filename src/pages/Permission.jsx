import { mockUsers } from "../data/users.js";

const permissionLabels = [
  "view_dashboard",
  "view_employees",
  "manage_employees",
  "view_leave",
  "approve_leave",
  "view_payroll",
  "manage_payroll",
  "view_settings",
];

export default function Permission() {
  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">Access Control</p>
        <h1>Permissions Matrix</h1>
        <p>Review which permissions are available to each demo role.</p>
      </div>

      <div className="matrix-card">
        <div className="matrix-row matrix-header">
          <strong id="strong">Role</strong>
          {permissionLabels.map((permission) => (
            <strong key={permission}>{permission.replaceAll("_", " ")}</strong>
          ))}
        </div>

        {mockUsers.map((user) => (
          <div className="matrix-row" key={user.id}>
            <strong id="role">{user.role}</strong>

            {permissionLabels.map((permission) => (
              <span
                key={permission}
                className={
                  user.permissions.includes(permission) ? "check" : "cross"
                }
              >
                {user.permissions.includes(permission) ? "Yes" : "No"}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}