import { useEffect, useState } from "react"; // hooks do React para estado e carregamento
import { Link, useNavigate } from "react-router-dom"; // Link navega entre páginas e useNavigate redireciona via código

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import "./Dashboard.css"; // estilos do dashboard

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  banner?: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
}

// componente responsável pela tela de dashboard do usuário
export function Dashboard() {
  const navigate = useNavigate(); // usado para redirecionar o usuário

  const [posts, setPosts] = useState<Post[]>([]); // armazena os posts vindos da API
  const [user, setUser] = useState<User | null>(null); // armazena o usuário logado
  const [loading, setLoading] = useState(true); // controla carregamento da tela

  // carrega dados do localStorage e posts da API
  async function loadDashboard() {
    const token = localStorage.getItem("token"); // busca o token salvo no login
    const storedUser = localStorage.getItem("user"); // busca o usuário salvo no login

    if (!token) {
      navigate("/login"); // se não tiver token, manda para login
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    try {
      const response = await api.get("/posts"); // por enquanto busca todos os posts

      setPosts(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // remove o token e volta para login
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  const totalPosts = posts.length;
  const totalLikes = totalPosts * 5;
  const totalComments = totalPosts * 2;
  const averageReadingTime = 8;

  if (loading) {
    return (
      <>
        <Header />

        <main className="dashboard-page">
          <div className="dashboard-container">
            <p className="dashboard-message">Carregando dashboard...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="dashboard-page">
        <section className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
              <p>Bem-vindo de volta, {user?.name || "Usuário"}!</p>
            </div>

            <div className="dashboard-actions">
              <Link to="/settings" className="dashboard-secondary-button">
                Configurações
              </Link>

              <Link to="/dashboard/posts/new" className="dashboard-primary-button">
                + Novo Artigo
              </Link>

              <button
                type="button"
                className="dashboard-logout-button"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total de Artigos</span>
              <strong>{totalPosts}</strong>
            </div>

            <div className="stat-card">
              <span>Engajamento</span>
              <strong>{totalComments}</strong>
            </div>

            <div className="stat-card">
              <span>Curtidas</span>
              <strong>{totalLikes}</strong>
            </div>

            <div className="stat-card">
              <span>Tempo médio de leitura</span>
              <strong>{averageReadingTime} min</strong>
            </div>
          </div>

          <div className="dashboard-content">
            <section className="my-posts-panel">
              <h2>Meus Artigos</h2>

              {posts.length > 0 ? (
                <div className="dashboard-post-list">
                  {posts.slice(0, 4).map((post) => (
                    <article key={post.id} className="dashboard-post-item">
                      {post.banner ? (
                        <img
                          src={`http://localhost:3333${post.banner}`}
                          alt={post.title}
                        />
                      ) : (
                        <div className="dashboard-post-placeholder" />
                      )}

                      <div className="dashboard-post-info">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>

                        <div className="dashboard-post-meta">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                          <span>2 comentários</span>
                          <span>1 curtida</span>
                        </div>
                      </div>

                      <div className="dashboard-post-actions">
                        <Link to={`/dashboard/posts/${post.id}/edit`}>Editar</Link>

                        <button type="button">Excluir</button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="dashboard-empty">Nenhum artigo cadastrado.</p>
              )}
            </section>

            <aside className="activity-panel">
              <h2>Atividade Recente</h2>

              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-avatar">M</div>

                  <div>
                    <p>
                      <strong>Marie Smith</strong> comentou em{" "}
                      <span>O Futuro da Inteligência Artificial em 2025</span>
                    </p>
                    <small>5 min atrás</small>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">J</div>

                  <div>
                    <p>
                      <strong>John Doe</strong> curtiu seu artigo{" "}
                      <span>Desenvolvimento web moderno</span>
                    </p>
                    <small>12 min atrás</small>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">A</div>

                  <div>
                    <p>
                      <strong>Ana Costa</strong> começou a seguir seu perfil
                    </p>
                    <small>30 min atrás</small>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}