import { useMemo, useState } from "react";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useCan } from "../../hooks/useCan.js";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

function PayrollTable({ onEdit, payrollRecords, editPayroll, onStatusChange }) {
  const tableHeaders = [
    "Employee",
    "Salary",
    "Bonus",
    "Taxes",
    "Net pay",
    "Status",
    "",
  ];
  

  const canManagePayroll = useCan("Manage_Payroll");

  return (
    <div className="payroll-table-wrapper">
      <table className="payroll-table">
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th className={header === "Status" ? "status-header" : ""} key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payrollRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.employee}</td>
              <td>{formatCurrency(record.salary)}</td>
              <td>{formatCurrency(record.bonus)}</td>
              <td>{formatCurrency(record.deductions)}</td>
              <td>
                {formatCurrency(
                  record.salary + record.bonus - record.deductions,
                )}
              </td>
              <td>
                <span className="status">{record.status}</span>
                {canManagePayroll && (
                  <div className="status-actions">
                    {record.status === "Pending" && (
                      <div className="btn-group">
                        <button
                          className="secondary-button"
                          onClick={() =>
                            onStatusChange(record.id, "Approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="danger-button"
                          onClick={() =>
                            onStatusChange(record.id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td>
                <button
                  className="secondary-button edit-button"
                  onClick={() => editPayroll(record)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PayrollTable;
