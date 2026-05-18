import axios from "axios"; // usado para identificar erros vindos do Axios/API
import { useEffect, useState } from "react"; // hooks do React para estado e carregamento
import { Link, useNavigate } from "react-router-dom"; // Link navega entre páginas e useNavigate redireciona via código

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import gearIcon from "../assets/gear.svg"; // ícone de configurações
import newsIcon from "../assets/news.svg"; // ícone de total de artigos
import eyeIcon from "../assets/eye.svg"; // ícone de visualizações
import heartIcon from "../assets/heart.svg"; // ícone de curtidas
import commentIcon from "../assets/comment.svg"; // ícone de comentários/atividade

import "./Dashboard.css"; // estilos do dashboard

interface Author {
  id: number;
  name: string;
  email: string;
}

interface PostCount {
  likes: number;
  comments: number;
}

interface Post {
  id: number;
  title: string;
  summary?: string | null;
  content: string;
  banner?: string | null;
  category?: string | null;
  tags?: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: Author;
  _count: PostCount;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
}

interface CommentUser {
  id: number;
  name: string;
  email: string;
}

interface PostComment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  postId: number;
  user: CommentUser;
}

interface RecentActivity {
  id: number;
  postId: number;
  postTitle: string;
  commentContent: string;
  createdAt: string;
  user: CommentUser;
}

// componente responsável pela tela de dashboard do usuário
export function Dashboard() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // formata tempo relativo simples
  function formatRelativeTime(date: string) {
    const createdAt = new Date(date).getTime();
    const now = new Date().getTime();

    const differenceInMinutes = Math.floor((now - createdAt) / 1000 / 60);

    if (differenceInMinutes < 1) {
      return "agora mesmo";
    }

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min atrás`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours < 24) {
      return `${differenceInHours} h atrás`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays === 1) {
      return "ontem";
    }

    return `${differenceInDays} dias atrás`;
  }

  // carrega dados do localStorage, posts da API e comentários recentes
  async function loadDashboard() {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);

    setUser(parsedUser);

    try {
      const response = await api.get("/posts");

      const allPosts: Post[] = response.data;

      const userPosts = allPosts.filter(
        (post) => post.author.id === parsedUser.id
      );

      setPosts(userPosts);

      const commentsRequests = userPosts.map(async (post) => {
        const commentsResponse = await api.get(`/posts/${post.id}/comments`);

        const comments: PostComment[] = commentsResponse.data;

        return comments.map((comment) => ({
          id: comment.id,
          postId: post.id,
          postTitle: post.title,
          commentContent: comment.content,
          createdAt: comment.createdAt,
          user: comment.user
        }));
      });

      const commentsByPost = await Promise.all(commentsRequests);

      const allComments = commentsByPost
        .flat()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);

      setRecentActivities(allComments);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // abre o modal de confirmação de exclusão
  function handleOpenDeleteModal(post: Post) {
    setDeleteError("");
    setPostToDelete(post);
  }

  // fecha o modal de confirmação de exclusão
  function handleCloseDeleteModal() {
    setDeleteError("");
    setPostToDelete(null);
  }

  // confirma a exclusão do artigo
  async function handleConfirmDelete() {
    if (!postToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await api.delete(`/posts/${postToDelete.id}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postToDelete.id)
      );

      setRecentActivities((currentActivities) =>
        currentActivities.filter(
          (activity) => activity.postId !== postToDelete.id
        )
      );

      setPostToDelete(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Não foi possível excluir o artigo.";

        setDeleteError(message);
        return;
      }

      setDeleteError("Não foi possível excluir o artigo. Tente novamente.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const totalPosts = posts.length;

  const totalViews = posts.reduce(
    (total, post) => total + (post.views ?? 0),
    0
  );

  const totalLikes = posts.reduce(
    (total, post) => total + (post._count?.likes ?? 0),
    0
  );

  const totalComments = posts.reduce(
    (total, post) => total + (post._count?.comments ?? 0),
    0
  );

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
              <div className="stat-card-header">
                <span>Total de Artigos</span>
                <img src={newsIcon} alt="" className="stat-card-icon" />
              </div>

              <strong>{totalPosts}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span>Visualizações</span>
                <img src={eyeIcon} alt="" className="stat-card-icon" />
              </div>

              <strong>{totalViews}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span>Curtidas</span>
                <img src={heartIcon} alt="" className="stat-card-icon" />
              </div>

              <strong>{totalLikes}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span>Comentários</span>
                <img src={commentIcon} alt="" className="stat-card-icon" />
              </div>

              <strong>{totalComments}</strong>
            </div>
          </div>

          <div className="dashboard-content">
            <section className="my-posts-panel">
              <h2>Meus Artigos</h2>

              {posts.length > 0 ? (
                <div className="dashboard-post-list">
                  {posts.map((post) => {
                    const postSummary =
                      post.summary ||
                      (post.content.length > 80
                        ? `${post.content.slice(0, 80)}...`
                        : post.content);

                    return (
                      <article key={post.id} className="dashboard-post-item">
                        <Link
                          to={`/posts/${post.id}`}
                          className="dashboard-post-click-area"
                          title={`Abrir artigo: ${post.title}`}
                        >
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

                            <p>{postSummary}</p>

                            <div className="dashboard-post-meta">
                              <span>
                                {new Date(post.createdAt).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>

                              <span>{post._count?.comments ?? 0} comentários</span>
                              <span>{post._count?.likes ?? 0} curtidas</span>
                            </div>
                          </div>
                        </Link>

                        <div className="dashboard-post-actions">
                          <Link to={`/dashboard/posts/${post.id}/edit`}>
                            Editar
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(post)}
                          >
                            Excluir
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="dashboard-empty">
                  Você ainda não publicou nenhum artigo.
                </p>
              )}
            </section>

            <aside className="activity-panel">
              <h2>Atividade Recente</h2>

              {recentActivities.length > 0 ? (
                <div className="activity-list">
                  {recentActivities.map((activity) => {
                    const initial = activity.user.name.charAt(0).toUpperCase();

                    return (
                      <div className="activity-item" key={activity.id}>
                        <div className="activity-avatar">{initial}</div>

                        <div>
                          <p>
                            <strong>{activity.user.name}</strong> comentou em{" "}
                            <Link to={`/posts/${activity.postId}`}>
                              {activity.postTitle}
                            </Link>
                          </p>

                          <small>
                            <img
                              src={commentIcon}
                              alt=""
                              className="activity-icon"
                            />
                            {formatRelativeTime(activity.createdAt)}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="activity-empty">
                  Nenhum comentário recente nos seus artigos.
                </p>
              )}
            </aside>
          </div>
        </section>
      </main>

      <Footer />

      {postToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Excluir artigo</h2>

            <p>
              Tem certeza que deseja excluir o artigo{" "}
              <strong>{postToDelete.title}</strong>? Essa ação não poderá ser
              desfeita.
            </p>

            {deleteError && (
              <span className="delete-modal-error">{deleteError}</span>
            )}

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel-button"
                onClick={handleCloseDeleteModal}
                disabled={deleteLoading}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="delete-modal-confirm-button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}