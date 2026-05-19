import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext.jsx";

export default function ApprovalSummary() {
  const { leaveRequests } = useAppData();

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === "Pending"
  );

  const approvedRequests = leaveRequests.filter(
    (request) => request.status === "Approved"
  );

  const rejectedRequests = leaveRequests.filter(
    (request) => request.status === "Rejected"
  );

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <h3>Approval Summary</h3>
        <p>Leave request status overview</p>
      </div>
       <Link to="/leave-requests" className="view-all-link">
        View Leave Requests
      </Link>

      <div className="approval-list">
        <div className="approval-row">
          <span>Pending</span>
          <strong>{pendingRequests.length}</strong>
        </div>

        <div className="approval-row">
          <span>Approved</span>
          <strong>{approvedRequests.length}</strong>
        </div>

        <div className="approval-row">
          <span>Rejected</span>
          <strong>{rejectedRequests.length}</strong>
        </div>
      </div>
    </section>
  );
}