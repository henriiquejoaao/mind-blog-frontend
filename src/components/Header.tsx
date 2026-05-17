import { useEffect, useState } from "react"; // hooks para estado e atualização do usuário
import { Link, useLocation, useNavigate } from "react-router-dom"; // navegação e rota atual

import dashboardIcon from "../assets/dashboard.svg"; // ícone do dashboard
import gearIcon from "../assets/gear.svg"; // ícone de configurações
import exitIcon from "../assets/exit.svg"; // ícone de sair

import "./Header.css"; // estilos do Header

interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
}

// componente responsável pelo topo fixo da aplicação
export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // carrega o usuário salvo no localStorage
  function loadUserFromStorage() {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsAuthenticated(!!token);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }

  // carrega o usuário quando o Header monta e escuta alterações vindas da tela Settings
  useEffect(() => {
    loadUserFromStorage();

    window.addEventListener("user-updated", loadUserFromStorage);

    return () => {
      window.removeEventListener("user-updated", loadUserFromStorage);
    };
  }, []);

  // fecha o dropdown ao trocar de página
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // remove os dados do usuário e volta para login
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsDropdownOpen(false);
    setUser(null);
    setIsAuthenticated(false);

    navigate("/login");
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

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
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name || "Usuário"} />
                ) : (
                  <span className="user-avatar-fallback">{userInitial}</span>
                )}
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || "Usuário"}
                        className="user-dropdown-avatar"
                      />
                    ) : (
                      <span className="user-dropdown-avatar-fallback">
                        {userInitial}
                      </span>
                    )}

                    <div className="user-dropdown-info">
                      <strong>{user?.name || "Usuário"}</strong>
                      <span>{user?.email || "email@email.com"}</span>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="user-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <img
                      src={dashboardIcon}
                      alt=""
                      className="user-dropdown-icon"
                    />
                    Dashboard
                  </Link>

                  <Link
                    to="/settings"
                    className="user-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <img src={gearIcon} alt="" className="user-dropdown-icon" />
                    Configurações
                  </Link>

                  <button
                    type="button"
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <img src={exitIcon} alt="" className="user-dropdown-icon" />
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