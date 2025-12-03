import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="nav-bar">
      <div className="nav-brand">
        <span className="nav-logo">🏛️</span>
        <span className="nav-title">Land Registry dApp</span>
      </div>

      <nav className="nav-links">
        {/* Bouton Gestion → page App */}
        <Link to="/app" className={isActive("/app")}>
          Gestion
        </Link>

        {/* Bouton Parcelles si tu le veux encore */}
        <Link to="/parcelles" className={isActive("/parcelles")}>
          Parcelles
        </Link>
      </nav>
    </header>
  );
}
