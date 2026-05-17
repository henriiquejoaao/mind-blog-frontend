import { useEffect, useState } from "react"; // hooks do React para estado e carregamento
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

// tipagem do autor do artigo
interface Author {
  id: number;
  name: string;
  email: string;
}

// tipagem do artigo retornado pela API
interface Post {
  id: number;
  title: string;
  content: string;
  banner?: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

// tipagem do usuário salvo no localStorage
interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

// componente responsável pela página de detalhes de um artigo
export function PostDetails() {
  const { id } = useParams(); // pega o parâmetro "id" da URL

  const [post, setPost] = useState<Post | null>(null); // armazena o artigo encontrado
  const [currentUser, setCurrentUser] = useState<User | null>(null); // armazena o usuário logado
  const [loading, setLoading] = useState(true); // controla o carregamento
  const [error, setError] = useState(""); // armazena mensagem de erro

  // função responsável por buscar o artigo pelo id
  async function loadPost() {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const response = await api.get(`/posts/${id}`); // faz GET em http://localhost:3333/posts/:id

      setPost(response.data); // salva o artigo retornado pela API
    } catch {
      setError("Artigo não encontrado."); // define mensagem caso a API retorne erro
    } finally {
      setLoading(false); // finaliza o carregamento
    }
  }

  // executa a busca quando a página carrega ou quando o id muda
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

  const isCurrentUserAuthor = currentUser?.email === post.author.email;

  const authorAvatar = isCurrentUserAuthor ? currentUser?.avatar : "";

  const authorInitial = post.author.name.charAt(0).toUpperCase();

  const currentUserInitial = currentUser?.name?.charAt(0).toUpperCase() || "U";

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
                    6min
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
              <img src={commentIcon} alt="" className="detail-icon" />2
              comentários
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
            <h2>Comentários (2)</h2>

            <div className="comment-login-box">
              <p>Faça login para comentar</p>

              <button type="button" className="btn btn-primary">
                Fazer login
              </button>
            </div>

            <div className="comment-card">
              <div className="comment-top">
                <div className="comment-user">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || "Usuário"}
                      className="comment-photo"
                    />
                  ) : (
                    <span className="comment-photo-fallback">
                      {currentUserInitial}
                    </span>
                  )}

                  <div className="comment-user-info">
                    <strong>{currentUser?.name || "John Doe"}</strong>
                    <span>20/01/2026</span>
                  </div>
                </div>

                <div className="comment-like">
                  <img src={heartIcon} alt="" className="detail-icon" />
                  <span>1</span>
                </div>
              </div>

              <p className="comment-text">
                Excelente artigo! Muito bem explicado sobre as tendências da IA.
              </p>
            </div>

            <div className="comment-card">
              <div className="comment-top">
                <div className="comment-user">
                  <span className="comment-photo-fallback">M</span>

                  <div className="comment-user-info">
                    <strong>Marie Smith</strong>
                    <span>20/01/2026</span>
                  </div>
                </div>

                <div className="comment-like">
                  <img src={heartIcon} alt="" className="detail-icon" />
                  <span>4</span>
                </div>
              </div>

              <p className="comment-text">
                Artigo muito interessante, mostra claramente como a IA está
                deixando de ser tendência para se tornar parte essencial das
                soluções do dia a dia.
              </p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}