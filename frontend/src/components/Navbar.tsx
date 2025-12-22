import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    // Admin ya User dono ke liye same home
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="logo" onClick={handleLogoClick}>
          🎬 MovieApp
        </h1>

        <nav className="nav-links">
          {/* Home always visible */}
          <Link to="/">Home</Link>

          {/* Add Movie ONLY for admin */}
          {role === "admin" && (
            <Link to="/admin/add" className="admin-link">
              Add Movie
            </Link>
          )}

          {/* Login / Logout */}
          {token ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
