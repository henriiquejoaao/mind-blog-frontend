import { useEffect, useState } from "react"; // hooks do React para estado e carregamento
import { Link, useNavigate } from "react-router-dom"; // Link navega entre páginas e useNavigate redireciona via código

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import gearIcon from "../assets/gear.svg"; // ícone de configurações
import commentIcon from "../assets/comment.svg"; // ícone de comentário/atividade

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
  id: number;
  name: string;
  email: string;
}

// componente responsável pela tela de dashboard do usuário
export function Dashboard() {
  const navigate = useNavigate(); // usado para redirecionar o usuário

  const [posts, setPosts] = useState<Post[]>([]); // armazena apenas os posts do usuário logado
  const [user, setUser] = useState<User | null>(null); // armazena o usuário logado
  const [loading, setLoading] = useState(true); // controla carregamento da tela

  // carrega dados do localStorage e posts da API
  async function loadDashboard() {
    const token = localStorage.getItem("token"); // busca o token salvo no login
    const storedUser = localStorage.getItem("user"); // busca o usuário salvo no login

    if (!token || !storedUser) {
      navigate("/login"); // se não tiver token ou usuário, manda para login
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);

    setUser(parsedUser);

    try {
      const response = await api.get("/posts"); // busca todos os posts do backend

      const userPosts = response.data.filter(
        (post: Post) => post.author.id === parsedUser.id
      ); // filtra somente os artigos do usuário logado

      setPosts(userPosts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalPosts = posts.length;
  const totalLikes = totalPosts * 5; // valor visual simulado
  const totalComments = totalPosts * 2; // valor visual simulado
  const averageReadingTime = totalPosts > 0 ? 8 : 0; // valor visual simulado

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
                <img src={gearIcon} alt="" className="dashboard-button-icon" />
                Configurações
              </Link>

              <Link to="/dashboard/posts/new" className="dashboard-primary-button">
                + Novo Artigo
              </Link>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total de Artigos</span>
              <strong>{totalPosts}</strong>
            </div>

            <div className="stat-card">
              <span>Comentários</span>
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
                            {new Date(post.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                          <span>2 comentários</span>
                          <span>1 curtida</span>
                        </div>
                      </div>

                      <div className="dashboard-post-actions">
                        <Link to={`/dashboard/posts/${post.id}/edit`}>
                          Editar
                        </Link>

                        <button type="button">Excluir</button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="dashboard-empty">
                  Você ainda não publicou nenhum artigo.
                </p>
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

                    <small>
                      <img src={commentIcon} alt="" className="activity-icon" />
                      5 min atrás
                    </small>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">J</div>

                  <div>
                    <p>
                      <strong>John Doe</strong> curtiu seu artigo{" "}
                      <span>Desenvolvimento web moderno</span>
                    </p>

                    <small>
                      <img src={commentIcon} alt="" className="activity-icon" />
                      12 min atrás
                    </small>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">A</div>

                  <div>
                    <p>
                      <strong>Ana Costa</strong> começou a seguir seu perfil
                    </p>

                    <small>
                      <img src={commentIcon} alt="" className="activity-icon" />
                      30 min atrás
                    </small>
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