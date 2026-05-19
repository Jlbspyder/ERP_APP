import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="center-page">
      <div className="message-card">
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="primary-button link-button">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}