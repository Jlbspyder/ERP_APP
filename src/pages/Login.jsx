import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../data/users.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = login({ email: formData.email, password: formData.password });

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <span className="brand-mark large">RBAC</span>
          <h1>RoleBase Admin</h1>
          <p>Sign in with one of the demo accounts below.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@demo.com"
            />
          </label>

          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password123"
            />
          </label>

          {authError && <p className="error-message">{authError}</p>}

          <button className="primary-button sign-in" type="submit">
            Sign In
          </button>
        </form>

        <div className="demo-users">
          <h2>Demo Accounts</h2>

          {mockUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() =>
                setFormData({
                  email: user.email,
                  password: user.password,
                })
              }
            >
              <strong>{user.role}</strong>
              <span>{user.name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}