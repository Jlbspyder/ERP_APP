import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import AuditLog from "./pages/AuditLog.jsx";
import LeaveRequests from "./pages/LeaveRequests.jsx";
import Permission from "./pages/Permission.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Payroll from "./pages/Payroll.jsx";
import Settings from "./pages/Settings.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import RequestLeave from "./pages/RequestLeave.jsx";
import Roles from "./pages/Roles.jsx";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-leave"
            element={
              <ProtectedRoute requiredPermission="Request_Leave">
                <RequestLeave />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredPermission="View_Employees">
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave-requests"
            element={
              <ProtectedRoute requiredPermission="View_Leave">
                <LeaveRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute requiredPermission="Manage_Payroll">
                <Payroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute requiredPermission="View_Permissions">
                <Permission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute requiredPermission="View_Audit_Logs">
                <AuditLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredPermission="View_Roles">
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredPermission="View_Settings">
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
