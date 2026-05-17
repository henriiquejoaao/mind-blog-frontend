import { FormEvent, useEffect, useState } from "react"; // hooks do React para estado e carregamento
import { Link, useParams } from "react-router-dom"; // Link navega entre páginas e useParams pega parâmetros da URL

import { Header } from "../components/Header"; // componente do topo da aplicação
import { Footer } from "../components/Footer"; // componente do rodapé da aplicação
import { api } from "../services/api"; // instância do Axios configurada com a URL do backend

import clockIcon from "../assets/clock.svg"; // ícone de relógio
import eyeIcon from "../assets/eye.svg"; // ícone de visualizações
import heartIcon from "../assets/heart.svg"; // ícone de curtidas
import bookmarkIcon from "../assets/bookmark.svg"; // ícone de salvar
import shareIcon from "../assets/share.svg"; // ícone de compartilhar
import commentIcon from "../assets/comment.svg"; // ícone de comentário

import "./PostDetails.css"; // estilos da página de detalhes

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  banner?: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

interface Comment {
  id: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  date: string;
  likes: number;
}

// componente responsável pela página de detalhes de um artigo
export function PostDetails() {
  const { id } = useParams(); // pega o parâmetro "id" da URL

  const [post, setPost] = useState<Post | null>(null); // armazena o artigo encontrado
  const [currentUser, setCurrentUser] = useState<User | null>(null); // armazena o usuário logado
  const [comments, setComments] = useState<Comment[]>([]); // comentários simulados no frontend
  const [newComment, setNewComment] = useState(""); // texto do novo comentário
  const [loading, setLoading] = useState(true); // controla o carregamento
  const [error, setError] = useState(""); // armazena mensagem de erro

  async function loadPost() {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const response = await api.get(`/posts/${id}`);

      setPost(response.data);

      setComments([
        {
          id: 1,
          authorName: "Marie Smith",
          content:
            "Artigo muito interessante, mostra claramente como a IA está deixando de ser tendência para se tornar parte essencial das soluções do dia a dia.",
          date: "20/01/2026",
          likes: 4
        }
      ]);
    } catch {
      setError("Artigo não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPost();

    function handleUserUpdated() {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(null);
      }
    }

    window.addEventListener("user-updated", handleUserUpdated);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdated);
    };
  }, [id]);

  function calculateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);

    return Math.max(minutes, 1);
  }

  function handleAddComment(event: FormEvent) {
    event.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    const comment: Comment = {
      id: Date.now(),
      authorName: currentUser?.name || "Usuário",
      authorAvatar: currentUser?.avatar,
      content: newComment,
      date: new Date().toLocaleDateString("pt-BR"),
      likes: 0
    };

    setComments((currentComments) => [comment, ...currentComments]);
    setNewComment("");
  }

  if (loading) {
    return (
      <>
        <Header />

        <main className="post-details-page">
          <div className="post-details-container">
            <p className="post-message">Carregando artigo...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />

        <main className="post-details-page">
          <div className="post-details-container">
            <p className="post-message">Artigo não encontrado.</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("pt-BR");
  const readingTime = calculateReadingTime(post.content);

  const isAuthenticated = !!localStorage.getItem("token");
  const isCurrentUserAuthor = currentUser?.email === post.author.email;

  const authorAvatar = isCurrentUserAuthor ? currentUser?.avatar : "";
  const authorInitial = post.author.name.charAt(0).toUpperCase();

  return (
    <>
      <Header />

      <main className="post-details-page">
        <article className="post-details-container">
          <Link to="/posts" className="back-link">
            <span>←</span>
            Voltar aos Artigos
          </Link>

          <div className="post-details-divider" />

          <span className="post-category">Desenvolvimento web</span>

          <h1>{post.title}</h1>

          <p className="post-summary">
            {post.content.length > 120
              ? `${post.content.slice(0, 120)}...`
              : post.content}
          </p>

          <div className="post-main-info">
            <div className="post-author-info">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={post.author.name}
                  className="author-photo"
                />
              ) : (
                <span className="author-photo-fallback">{authorInitial}</span>
              )}

              <div>
                <strong>{post.author.name}</strong>

                <div className="author-meta">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span>
                    <img src={clockIcon} alt="" className="detail-icon" />
                    {readingTime}min
                  </span>
                </div>
              </div>
            </div>

            <div className="post-action-icons">
              <button type="button" aria-label="Curtir">
                <img src={heartIcon} alt="" className="detail-icon" />
              </button>

              <button type="button" aria-label="Salvar">
                <img src={bookmarkIcon} alt="" className="detail-icon" />
              </button>

              <button type="button" aria-label="Compartilhar">
                <img src={shareIcon} alt="" className="detail-icon" />
              </button>
            </div>
          </div>

          <div className="post-stats-row">
            <span>
              <img src={heartIcon} alt="" className="detail-icon" />1 curtidas
            </span>

            <span>
              <img src={eyeIcon} alt="" className="detail-icon" />
              122 visualizações
            </span>

            <span>
              <img src={commentIcon} alt="" className="detail-icon" />
              {comments.length} comentários
            </span>
          </div>

          {post.banner && (
            <img
              className="post-details-banner"
              src={`http://localhost:3333${post.banner}`}
              alt={post.title}
            />
          )}

          <div className="post-content">
            <h2>{post.title}</h2>

            <p>{post.content}</p>

            <h3>Introdução</h3>

            <p>
              Este artigo apresenta uma visão geral sobre o tema abordado,
              destacando pontos importantes e conceitos relevantes para a
              comunidade de tecnologia.
            </p>

            <h3>Principais pontos</h3>

            <p>
              A proposta é compartilhar conhecimento de forma clara, prática e
              acessível, conectando teoria e aplicação em projetos reais.
            </p>

            <h3>Conclusão</h3>

            <p>
              Compreender esses conceitos ajuda no desenvolvimento de soluções
              modernas, organizadas e alinhadas com as necessidades do mercado.
            </p>
          </div>

          <div className="post-tags">
            <span>Desenvolvimento web</span>
            <span>Tecnologia</span>
            <span>Backend</span>
          </div>

          <section className="comments-section">
            <h2>Comentários ({comments.length})</h2>

            {isAuthenticated ? (
              <form className="comment-form-box" onSubmit={handleAddComment}>
                <textarea
                  placeholder="Escreva seu comentário..."
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                />

                <button type="submit" className="btn btn-primary">
                  Enviar comentário
                </button>
              </form>
            ) : (
              <div className="comment-login-box">
                <p>Faça login para comentar</p>

                <Link to="/login" className="btn btn-primary">
                  Fazer login
                </Link>
              </div>
            )}

            {comments.map((comment) => {
              const initial = comment.authorName.charAt(0).toUpperCase();

              return (
                <div className="comment-card" key={comment.id}>
                  <div className="comment-top">
                    <div className="comment-user">
                      {comment.authorAvatar ? (
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="comment-photo"
                        />
                      ) : (
                        <span className="comment-photo-fallback">
                          {initial}
                        </span>
                      )}

                      <div className="comment-user-info">
                        <strong>{comment.authorName}</strong>
                        <span>{comment.date}</span>
                      </div>
                    </div>

                    <div className="comment-like">
                      <img src={heartIcon} alt="" className="detail-icon" />
                      <span>{comment.likes}</span>
                    </div>
                  </div>

                  <p className="comment-text">{comment.content}</p>
                </div>
              );
            })}
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}