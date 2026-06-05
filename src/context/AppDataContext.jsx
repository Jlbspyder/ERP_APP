import { createContext, useContext, useMemo, useState } from "react";
import { initialEmployees } from "../data/employees.js";
import { initialPayrollRecords } from "../data/payroll.js";
import { initialLeaveRequests } from "../data/leaveRequests.js";
import { initialAuditLog } from "../data/auditLog.js";
import { mockUsers } from "../data/users.js";
import { useAuth } from "./AuthContext.jsx";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState(() => {
    const savedUsers = localStorage.getItem("rbac_users");

    if (!savedUsers) {
      return mockUsers;
    }

    try {
      const parsedUsers = JSON.parse(savedUsers);

      return Array.isArray(parsedUsers) ? parsedUsers : mockUsers;
    } catch {
      return mockUsers;
    }
  });
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const savedRequests = localStorage.getItem("rbac_leave_requests");
    if (!savedRequests) {
      return initialLeaveRequests;
    }
    try {
      const parsedRequests = JSON.parse(savedRequests);
      return Array.isArray(parsedRequests)
        ? parsedRequests
        : initialLeaveRequests;
    } catch {
      return initialLeaveRequests;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const savedLogs = localStorage.getItem("rbac_audit_logs");
    if (!savedLogs) {
      return initialAuditLog;
    }
    try {
      const parsedLogs = JSON.parse(savedLogs);
      return Array.isArray(parsedLogs) ? parsedLogs : initialAuditLog;
    } catch {
      return initialAuditLog;
    }
  });

  const [payrollRecords, setPayrollRecords] = useState(() => {
    const savedPayroll = localStorage.getItem("rbac_payroll_records");
    if (!savedPayroll) {
      return initialPayrollRecords;
    }
    try {
      const parsedPayroll = JSON.parse(savedPayroll);
      return Array.isArray(parsedPayroll)
        ? parsedPayroll
        : initialPayrollRecords;
    } catch {
      return initialPayrollRecords;
    }
  });


  const addAuditLog = ({ action, actor, target }) => {
    const newLog = {
      id: crypto.randomUUID().slice(0, 4),
      actor,
      action,
      target,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    localStorage.setItem(
      "rbac_audit_logs",
      JSON.stringify([newLog, ...auditLogs]),
    );
  };

  const addEmployee = (employeeData, actorInfo) => {
    const newEmployee = {
      id: crypto.randomUUID().slice(0, 4),
      ...employeeData,
      status: employeeData.status || "Active",
    };

    setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
    addAuditLog({
      action: "Created employee record",
      actor: actorInfo?.name || "Unknown User",
      target: newEmployee.name,
    });
  };
  const updateEmployeeStatus = (employeeId, status, actorInfo) => {
    const employee = employees.find((item) => item.id === employeeId);

    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId ? { ...employee, status } : employee,
      ),
    );

    if (employee) {
      addAuditLog({
        actor: actorInfo?.name || "Unknown User",
        action: `Updated employee status to ${status}`,
        target: employee.name,
      });
    }
  };
  const requestLeave = (leaveData, actorInfo) => {
    const start = new Date(leaveData.startDate);
    const end = new Date(leaveData.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newRequest = {
      id: crypto.randomUUID().slice(0, 4),
      employee: actorInfo?.name || "Unknown Employee",
      department: actorInfo?.department || "N/A",
      type: leaveData.type,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days,
      reason: leaveData.reason,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setLeaveRequests((prevRequests) => [newRequest, ...prevRequests]);
    localStorage.setItem(
      "rbac_leave_requests",
      JSON.stringify([newRequest, ...leaveRequests]),
    );

    addAuditLog({
      actor: actorInfo?.name || "Unknown Employee",
      role: actorInfo?.role || "Employee",
      action: "Submitted leave request",
      target: `${leaveData.type} leave`,
    });
  };
  const updateLeaveStatus = (requestId, status, actorInfo) => {
    const request = leaveRequests.find((item) => item.id === requestId);

    setLeaveRequests((prevLeaveRequests) =>
      prevLeaveRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request,
      ),
    );

    if (request) {
      addAuditLog({
        actor: actorInfo?.name || "Unknown User",
        action: `${status} leave request`,
        target: request?.employee || requestId,
      });
    }
  };

  const updatePayrollRecord = (payrollId, updatedData, actorInfo) => {
    const payroll = payrollRecords.find((record) => record.id === payrollId);

    setPayrollRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === payrollId
          ? {
              ...record,
              salary: Number(updatedData.salary),
              bonus: Number(updatedData.bonus),
              deductions: Number(updatedData.deductions),
            }
          : record,
      ),
    );

    if (payroll) {
      addAuditLog({
        actor: actorInfo?.name || "Unknown User",
        role: actorInfo?.role || "User",
        action: "Updated payroll details",
        target: payroll.employee,
      });
    }
  };

  const updatePayrollStatus = (payrollId, status, actorInfo) => {
    const payroll = payrollRecords.find((record) => record.id === payrollId);

    setPayrollRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === payrollId ? { ...record, status } : record,
      ),
    );

    if (payroll) {
      addAuditLog({
        actor: actorInfo?.name || "Unknown User",
        role: actorInfo?.role || "User",
        action: `Updated payroll status to ${status}`,
        target: payroll.employee,
      });
    }
  };

  const addPayrollRecord = (employeeData, actorInfo) => {
    const newPayrollRecord = {
      id: crypto.randomUUID().slice(0, 4),
      employee: employeeData.name,
      department: employeeData.department,
      salary: Number(employeeData.salary),
      bonus: Number(employeeData.bonus || 0),
      deductions: Number(employeeData.deductions || 0),
      status: "Pending",
    };

    setPayrollRecords((prevRecords) => [newPayrollRecord, ...prevRecords]);

    addAuditLog({
      actor: actorInfo?.name || "Unknown User",
      role: actorInfo?.role || "User",
      action: "Created payroll record",
      target: employeeData.name,
    });
  };

  const value = useMemo(
    () => ({
      employees,
      leaveRequests,
      payrollRecords,
      updatePayrollStatus,
      updatePayrollRecord,
      auditLogs,
      requestLeave,
      addEmployee,
      updateEmployeeStatus,
      updateLeaveStatus,
      addAuditLog,
      addPayrollRecord,
    }),
    [employees, leaveRequests, payrollRecords, auditLogs],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }

  return context;
}
