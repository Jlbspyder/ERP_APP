import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useCan } from "../hooks/useCan.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LeaveRequests() {
  const { leaveRequests, updateLeaveStatus } = useAppData();
  const { showToast } = useToast();
  const canApproveLeave = useCan("Approve_Leave");
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");

  const visibleRequests = useMemo(() => {
    return leaveRequests.filter((request) =>
      statusFilter === "all" ? true : request.status === statusFilter,
    );
  }, [leaveRequests, statusFilter]);

  const handleLeaveDecision = (requestId, status) => {
    updateLeaveStatus(requestId, status, {
      name: user.name,
      department: user.department,
      days: leaveRequests.find((req) => req.id === requestId)?.days || 0,
      target: requestId,
    });
    showToast({ message: `Leave request ${status.toLowerCase()}.` });
  };

  return (
    <div>
      <div className="page-heading row-heading">
        <div>
          <p className="eyebrow">Approvals</p>
          <h1>Leave Requests</h1>
          <p>Review and manage leave approvals based on your access level.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="table-card">
        {visibleRequests.length === 0 ? (
          <div className="empty-state">
            <h3>
              No {statusFilter === "all" ? "" : statusFilter.toLowerCase()}{" "}
              leave requests
            </h3>

            <p>
              {statusFilter === "all"
                ? "There are currently no leave requests in the system."
                : `There are currently no ${statusFilter.toLowerCase()} leave requests.`}
            </p>
          </div>
        ) : (
          visibleRequests.map((request) => (
            <div className="table-row small" key={request.id}>
              <div>
                <strong>{request.employee}</strong>
                <span>{request.id}</span>
              </div>

              <p>{request.department}</p>
              <p>{request.type}</p>

              <span>{request.days} day(s)</span>

              <span className="status-pill main">{request.status}</span>

              {canApproveLeave && request.status === "Pending" ? (
                <div className="button-group">
                  <button
                    className="secondary-button"
                    onClick={() => handleLeaveDecision(request.id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => handleLeaveDecision(request.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
