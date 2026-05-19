import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockUsers } from "../data/users.js";
import { can } from "../utils/permissions.js";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
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

  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("rbac_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rbac_users", JSON.stringify(users));
  }, [users]);

  const login = ({ email, password }) => {
    setAuthError("");

    const foundUser = users.find(
      (storedUser) =>
        storedUser.email.toLowerCase() === email.trim().toLowerCase() &&
        storedUser.password === password,
    );

    if (!foundUser) {
      setAuthError("Invalid email or password.");
      return false;
    }

    const safeUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      status: foundUser.status,
      permissions: foundUser.permissions,
    };

    setUser(safeUser);
    localStorage.setItem("rbac_user", JSON.stringify(safeUser));
    return true;
  };

  const registerUser = ({ name, email, password, role, permissions, status }) => {
    const userExists = users.some(
      (storedUser) => storedUser.email.toLowerCase() === email.toLowerCase(),
    );

    if (userExists) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const newUser = {
      id: crypto.randomUUID().slice(0, 4),
      name,
      email,
      password: password,
      role: role || "Employee",
      permissions: permissions || ["view_dashboard", "request_leave"],
      status: status || "Active",
    };

    setUsers((prevUsers) => [newUser, ...prevUsers]);

    return {
      success: true,
      message: "User account created successfully.",
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rbac_user");
  };

  const hasPermission = (permission) => {
    return can(user, permission);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      authError,
      hasPermission,
      isAuthenticated: Boolean(user),
      registerUser,
    }),
    [user, users, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
