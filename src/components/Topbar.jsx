import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Signed in as</p>
        <h2>{user?.name}</h2>
      </div>

      <div className="topbar-actions">
        <span className="role-badge">{user?.role}</span>
        <button className="secondary-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}