import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useCan } from "../hooks/useCan.js";
import PayrollTable from "../components/payroll/PayrollTable.jsx";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Payroll() {
  const [editingPayroll, setEditingPayroll] = useState(null);
  const { user } = useAuth();
  const { payrollRecords, updatePayrollStatus, updatePayrollRecord } = useAppData();
  const { showToast } = useToast();

 

  const canManagePayroll = useCan("Manage_Payroll");

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayroll = useMemo(() => {
    return payrollRecords.filter((record) =>
      statusFilter === "all" ? true : record.status === statusFilter,
    );
  }, [payrollRecords, statusFilter]);

  const totalPayroll = payrollRecords.reduce(
    (total, record) => total + record.salary + record.bonus - record.deductions,
    0,
  );

  const pendingPayroll = payrollRecords.filter(
    (record) => record.status === "Pending",
  ).length;


  const approvedPayroll = payrollRecords.filter(
    (record) => record.status === "Approved",
  ).length;

  const handleStatusChange = (payrollId, status) => {
    updatePayrollStatus(payrollId, status, {
      name: user?.name,
      role: user?.role,
    });

    showToast({
      message: `Pay marked as ${status}.`,
      type: "success",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingPayroll((prev) => ({
      ...prev,
      [name]: value,
    }));
};


const handleEditSubmit = (e) => {
  e.preventDefault();

  if (
    Number(editingPayroll.salary) <= 0 ||
    Number(editingPayroll.bonus) < 0 ||
    Number(editingPayroll.deductions) < 0
  ) {
    showToast({
      message: "Salary must be greater than zero. Bonus and deductions cannot be negative.",
      type: "error",
    });
    return;
  }

  updatePayrollRecord(
    editingPayroll.id,
    {
      salary: editingPayroll.salary,
      bonus: editingPayroll.bonus,
      deductions: editingPayroll.deductions,
    },
    {
      name: user?.name,
      role: user?.role,
    }
  );

  setEditingPayroll(null);

  showToast({
    message: "Payroll record updated successfully.",
    type: "success",
  });
};

  return (
    <div>
      <div className="page-heading row-heading">
        <div>
          <p className="eyebrow">Finance</p>
          <h1>PAYROLL RECORDS</h1>
          <p>Review payroll records, net pay, and approval status.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Payroll</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
       <PayrollTable 
          payrollRecords={filteredPayroll} 
          onStatusChange={handleStatusChange} 
          onEdit={handleEditChange}
          editPayroll={setEditingPayroll}
          />
       {editingPayroll ? (
  <div className="modal-backdrop">
    <form className="modal-card" onSubmit={handleEditSubmit}>
      <h2>Edit Payroll</h2>
      <span>
        Updating salary for <strong>{editingPayroll.employee}</strong>
      </span>

      <label>
        Salary
        <input
          type="number"
          name="salary"
          value={editingPayroll.salary}
          onChange={handleEditChange}
        />
      </label>

      <label>
        Bonus
        <input
          type="number"
          name="bonus"
          value={editingPayroll.bonus}
          onChange={handleEditChange}
        />
      </label>

      <label>
        Deductions
        <input
          type="number"
          name="deductions"
          value={editingPayroll.deductions}
          onChange={handleEditChange}
        />
      </label>

      <div className="btn-group">
        <button className="edit-payroll" type="submit">
          Save Changes
        </button>

        <button
          className="edit-payroll cancel-button"
          type="button"
          onClick={() => setEditingPayroll(null)}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
) : null}
    </div>
  );
}
