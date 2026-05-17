import { Link } from "react-router-dom"; // componente usado para navegação entre páginas
import "./Header.css"; // estilos do Header

// componente responsável pelo topo fixo da aplicação
export function Header() {
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

          <Link to="/login" className="login-link">
            Entrar
          </Link>

          <Link to="/register" className="nav-button">
            Cadastrar
          </Link>
        </nav>
      </div>
    </header>
  );
}