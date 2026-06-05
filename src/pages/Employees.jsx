import { useEffect, useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useCan } from "../hooks/useCan.js";
import { useFeatureFlag } from "../hooks/useFeatureFlag.js";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  role: "",
  status: "",
  salary: "",
  bonus: "",
  deductions: "",
  password: "",
  confirmPassword: "",
};

const ITEMS_PER_PAGE = 3;

export default function Employees() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { employees, addEmployee, updateEmployeeStatus, addPayrollRecord } =
    useAppData();
  const { showToast } = useToast();
  const { user, registerUser } = useAuth();
  const canManageEmployees = useCan("manage_employees");
  const hasPagination = useFeatureFlag("employeePagination");

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = [
        employee.name,
        employee.email,
        employee.department,
        employee.role,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE),
  );

  const visibleEmployees = useMemo(() => {
    if (!hasPagination) return filteredEmployees;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage, hasPagination]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department.trim() ||
      !formData.role.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.salary.trim()
    ) {
      showToast({
        message: "All fields are required.",
        type: "error",
      });
      return;
    }

     if ( Number(formData.salary) <= 0) {
        showToast({
          message: "Salary must be greater than zero.",
          type: "error",
        });
        return;
      }

    if (formData.password.length < 6) {
      showToast({
        message: "Password must be at least 6 characters.",
        type: "error",
      });

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast({
        message: "Passwords do not match.",
        type: "error",
      });

      return;
    }

    const result = registerUser({
      name: formData.name,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      status: formData.status || "Active",
      role: "Employee",
      permissions: ["view_dashboard", "request_leave"],
    });

    if (!result.success) {
      showToast({ message: result.message, type: "error" });
      return;
    }

    addEmployee(
      {
        name: formData.name,
        email: formData.email.trim().toLowerCase(),
        department: formData.department,
        role: formData.role,
        status: formData.status || "Active",
      },
      {
        name: user?.name,
        role: user?.role,
      },
    );

    addPayrollRecord(
      {
        name: formData.name,
        department: formData.department,
        salary: formData.salary,
        bonus: formData.bonus,
        deductions: formData.deductions,
      },
      {
        name: user?.name,
        role: user?.role,
      },
    );

    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleStatusChange = (employeeId, status) => {
    updateEmployeeStatus(employeeId, status, {
      name: user?.name,
    });

    showToast({ message: `Employee status updated to ${status}.` });
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="page-heading row-heading">
        <div>
          <p className="eyebrow">People Operations</p>
          <h1>Employees</h1>
          <p>
            Search, filter, and manage employee records based on your
            permissions.
          </p>
        </div>

        {canManageEmployees ? (
          <button
            className="primary-button"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close Form" : "Add Employee"}
          </button>
        ) : null}
      </div>

      <div className="toolbar-card">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {showForm && canManageEmployees ? (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Add Employee</h2>

          <div className="form-grid">
            <label>
              Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Email
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>
            <label>
              Department
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option>Engineering</option>
                <option>People</option>
                <option>Finance</option>
                <option>Operations</option>
              </select>
            </label>

            <label>
              Salary
              <input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
              />
            </label>

            <label>
              Bonus
              <input
                id="bonus"
                name="bonus"
                type="number"
                value={formData.bonus}
                onChange={handleChange}
              />
            </label>

            <label>
              Deductions
              <input
                id="deductions"
                name="deductions"
                type="number"
                value={formData.deductions}
                onChange={handleChange}
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <label>
              Role
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-button" type="submit">
            Save Employee
          </button>
        </form>
      ) : null}

      <div className="table-card">
        {visibleEmployees.map((employee) => (
          <div className="table-row" key={employee.id}>
            <div>
              <strong>{employee.name}</strong>
              <span id="lg">{employee.email}</span>
            </div>
            <p>{employee.department}</p>
            <p>{employee.role}</p>
            <span className="status-pill main">{employee.status}</span>

            {canManageEmployees ? (
              <select
                value={employee.status}
                onChange={(e) =>
                  handleStatusChange(employee.id, e.target.value)
                }
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            ) : null}
          </div>
        ))}

        {visibleEmployees.length === 0 ? (
          <div className="empty-state">No employees match your search.</div>
        ) : null}
      </div>

      {hasPagination && filteredEmployees.length > 0 ? (
        <div className="pagination-card">
          <button
            className="secondary-button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="page-buttons">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  className={
                    isActive ? "page-button active-page" : "page-button"
                  }
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            className="secondary-button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
