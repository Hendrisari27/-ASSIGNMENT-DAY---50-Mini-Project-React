import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    isActive ? "navbar__link active" : "navbar__link";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        🧭 Shop/Admin
      </Link>
      <nav className="navbar__links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Produk
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        )}
        <NavLink to="/about" className={linkClass}>
          Tentang
        </NavLink>
      </nav>

      {isAuthenticated ? (
        <div className="dev-switcher">
          <span className="dev-switcher__label">
            {user.name} · <strong>{user.role}</strong>
          </span>
          <button className="button button--small" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      ) : (
        <Link to="/login" className="button button--small">
          Masuk
        </Link>
      )}
    </header>
  );
}

export default Navbar;
