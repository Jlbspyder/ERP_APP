import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <main className="center-page">
      <div className="message-card">
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
        <Link to="/dashboard" className="primary-button link-button">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}