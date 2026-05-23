import { mockUsers } from "../data/users.js";

const permissionLabels = [
  "View_Dashboard",
  "View_Employees",
  "manage_Employees",
  "View_Leave",
  "approve_Leave",
  "View_Payroll",
  "manage_Payroll",
  "View_Settings",
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
        <div className="matrix-fixed-column">
          <div className="matrix-cell matrix-header-cell">Role</div>

          {mockUsers.map((user) => (
            <div className="matrix-cell" key={user.id}>
              {user.role}
            </div>
          ))}
        </div>

        <div className="matrix-scroll-area">
          <div className="matrix-permission-row matrix-header-row">
            {permissionLabels.map((permission) => (
              <strong className="matrix-cell" key={permission}>
                {permission.replaceAll("_", " ")}
              </strong>
            ))}
          </div>

          {mockUsers.map((user) => (
            <div className="matrix-permission-row" key={user.id}>
              {permissionLabels.map((permission) => (
                <span
                  className={
                    user.permissions.includes(permission)
                      ? "matrix-cell check"
                      : "matrix-cell cross"
                  }
                  key={permission}
                >
                  {user.permissions.includes(permission) ? "Yes" : "No"}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
