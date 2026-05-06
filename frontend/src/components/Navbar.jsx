import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const salir = () => {
    localStorage.clear();
    navigate("/");
  };

  // ocultar navbar en login y registro
  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  // visitante sin login
  if (!token) {
    return (
      <nav className="menu">
        <div className="logo">SecureFrame</div>

        <div className="menu-links">
          <Link to="/">Iniciar sesión</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="menu">
      <div className="logo">SecureFrame</div>

      <div className="menu-links">
        <Link to="/dashboard">Galería</Link>

        {role !== "admin" && (
          <Link to="/upload">Subir imagen</Link>
        )}

        {role === "admin" && (
          <Link to="/supervisor">Supervisor</Link>
        )}

        <button onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}