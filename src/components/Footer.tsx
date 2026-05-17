import { Link } from "react-router-dom"; // componente usado para navegação entre páginas
import "./Footer.css"; // estilos do Footer

// componente responsável pelo rodapé da aplicação
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <Link to="/" className="footer-logo">
            &lt;M/&gt;
          </Link>

          <p>
            Seu portal de tecnologia com artigos, tutoriais e novidades do
            mundo tech.
          </p>
        </div>

        <div className="footer-right">
          <div className="footer-links">
            <strong>Navegação</strong>
            <Link to="/">Home</Link>
            <Link to="/posts">Artigos</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-social">
            <strong>Redes Sociais</strong>

            <div className="social-icons">
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.5 10v8M6.5 6.5v.01M11 18v-8M11 13.5c0-2 1.2-3.5 3.2-3.5 1.8 0 3.3 1.2 3.3 3.8V18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </a>

              <a href="#" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 19c-4 1-4-2-5-2m10 4v-3.5c0-1 .2-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.7 4.7 0 0 0 17.7 6c.1-.4.5-1.8-.2-3.5 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C5.6 2.2 4.5 2.5 4.5 2.5 3.8 4.2 4.2 5.6 4.3 6A4.7 4.7 0 0 0 3 9.5c0 4.6 2.7 5.7 5.5 6-.7.6-.7 1.2-.6 2V21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 5.5c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.8.5-1.6.8-2.5 1A3.8 3.8 0 0 0 11.3 8c0 .3 0 .6.1.9A10.8 10.8 0 0 1 3.5 5s-3.4 7.5 4.2 11A11 11 0 0 1 3 17.5c7.8 4.3 16.5 0 16.5-9v-.4c.7-.5 1.2-1.1 1.5-1.7Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 Mind Blog. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}