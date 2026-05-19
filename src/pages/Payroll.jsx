export default function Payroll() {
  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">Finance</p>
        <h1>Payroll</h1>
        <p>This page is only visible to users with payroll permissions.</p>
      </div>

      <div className="empty-card">
        <h2>Payroll Module</h2>
        <p>Phase 2 will include payroll summaries, approval states, and audit logs.</p>
      </div>
    </div>
  );
}