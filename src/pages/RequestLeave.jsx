import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const emptyLeaveForm = {
  type: "",
  numberOfDays: "",
  startDate: "",
  endDate: "",
  department: "",
  role: "",
  reason: "",
};

export default function RequestLeave() {
  const { user } = useAuth();
  const { requestLeave, employees } = useAppData();

  const { showToast } = useToast();

  const [formData, setFormData] = useState(emptyLeaveForm);

  const leaveDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) {
      return null;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const timeDiff = end.getTime() - start.getTime();

    if (timeDiff < 0) {
      return null;
    }

    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const employeeProfile = employees.find(
    (employee) => employee.email === user?.email,
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.type || !formData.startDate || !formData.endDate) {
      showToast({
        message: "Leave type, start date, and end date are required.",
        type: "error",
      });
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showToast({
        message: "End date cannot be before start date.",
        type: "error",
      });
      return;
    }

    requestLeave(formData, {
      name: user?.name,
      role: user?.role,
      days: formData.numberOfDays,
      department: formData.department,
    });
    setFormData(emptyLeaveForm);

    showToast({
      message: "Leave request submitted successfully.",
      type: "success",
    });
  };

  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">Self Service</p>
        <h1>Request Leave</h1>
        <p>Submit a leave request for HR or management approval.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Leave Request Form</h2>

        <div className="form-grd">
          <div className="form-column">
            <label>
              Start Date
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </label>
            <label>
              End Date
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </label>
            <label>
              Department
              <input
                type="text"
                name="department"
                placeholder="E.g. Engineering"
                value={formData.department}
                onChange={handleChange}
              />
            </label>
            <label>
              Role
              <input
                type="text"
                name="role"
                placeholder="E.g. Payroll Analyst"
                value={formData.role}
                onChange={handleChange}
              />
            </label>
             <label>
              Leave Type
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="">Select Leave Type</option>
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Sabatical">Sabatical Leave</option>
                <option value="Emergency">Emergency Leave</option>
                <option value="Maternity">Maternity Leave</option>
                <option value="Paternity">Paternity Leave</option>
              </select>
            </label>
            <label>
              Duration
              <input type="text" value={!leaveDays ? "" : `${leaveDays} day(s)`} readOnly />
            </label>
          </div>

          <label>
            Reason
            <textarea
              name="reason"
              className="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly explain your reason..."
              rows="4"
            />
          </label>
        </div>

        <button className="primary-button leave" type="submit">
          Submit Request
        </button>
      </form>
    </div>
  );
}
