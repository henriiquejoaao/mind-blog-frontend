import { useState } from "react"; // controla abertura e fechamento do dropdown
import { Link, useLocation, useNavigate } from "react-router-dom"; // navegação e rota atual
import "./Header.css"; // estilos do Header

interface User {
  id?: number;
  name?: string;
  email?: string;
}

// componente responsável pelo topo fixo da aplicação
export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const isAuthenticated = !!token;

  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsDropdownOpen(false);
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          &lt;M/&gt;
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/posts">Artigos</Link>

          <span className="nav-separator" />

          <button type="button" className="theme-button" aria-label="Alterar tema">
            <span className="theme-icon" />
          </button>

          {isAuthenticated ? (
            <div className="user-menu">
              <button
                type="button"
                className="user-avatar-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Abrir menu do usuário"
              >
                <img
                  src="https://i.pravatar.cc/80?img=12"
                  alt={user?.name || "Usuário"}
                />
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <img
                      src="https://i.pravatar.cc/80?img=12"
                      alt={user?.name || "Usuário"}
                    />

                    <div>
                      <strong>{user?.name || "Usuário"}</strong>
                      <span>{user?.email || "email@email.com"}</span>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="user-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">▦</span>
                    Dashboard
                  </Link>

                  <Link
                    to="/settings"
                    className="user-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">⚙</span>
                    Configurações
                  </Link>

                  <button
                    type="button"
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">↪</span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isAuthPage && (
              <>
                <Link to="/login" className="login-link">
                  Entrar
                </Link>

                <Link to="/register" className="nav-button">
                  Cadastrar
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}