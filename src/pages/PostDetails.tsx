import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../services/api";

import clockIcon from "../assets/clock.svg";
import eyeIcon from "../assets/eye.svg";
import heartIcon from "../assets/heart.svg";
import bookmarkIcon from "../assets/bookmark.svg";
import shareIcon from "../assets/share.svg";
import commentIcon from "../assets/comment.svg";

import "./PostDetails.css";

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
  bio?: string;
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

export function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState("");

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  function loadCurrentUser() {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      return parsedUser;
    }

    setCurrentUser(null);
    return null;
  }

  function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`
    };
  }

  function getLikedStorageKey(postId: number, user?: User | null) {
    const userIdentifier = user?.id || user?.email || "anonymous";

    return `liked-post-${userIdentifier}-${postId}`;
  }

  function calculateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);

    return Math.max(minutes, 1);
  }

  async function loadPostDetails() {
    try {
      setLoading(true);
      setError("");

      const user = loadCurrentUser();

      const viewKey = `view-registered-post-${id}`;

      if (!sessionStorage.getItem(viewKey)) {
        await api.post(`/posts/${id}/view`);
        sessionStorage.setItem(viewKey, "true");
      }

      const postResponse = await api.get(`/posts/${id}`);
      const postData: Post = postResponse.data;

      setPost(postData);
      setLikesCount(postData._count?.likes ?? 0);
      setCommentsCount(postData._count?.comments ?? 0);
      setViewsCount(postData.views ?? 0);

      localStorage.removeItem(`liked-post-${postData.id}`);

      const likedKey = getLikedStorageKey(postData.id, user);
      const likedFromStorage = localStorage.getItem(likedKey);

      setLiked(likedFromStorage === "true");

      const commentsResponse = await api.get(`/posts/${id}/comments`);
      setComments(commentsResponse.data);
    } catch {
      setError("Artigo não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleLike() {
    if (!post) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    const user: User | null = storedUser ? JSON.parse(storedUser) : null;

    const likedKey = getLikedStorageKey(post.id, user);

    try {
      if (liked) {
        await api.delete(`/posts/${post.id}/like`, {
          headers: getAuthHeaders()
        });

        setLiked(false);
        setLikesCount((current) => Math.max(current - 1, 0));
        localStorage.removeItem(likedKey);

        return;
      }

      await api.post(
        `/posts/${post.id}/like`,
        {},
        {
          headers: getAuthHeaders()
        }
      );

      setLiked(true);
      setLikesCount((current) => current + 1);
      localStorage.setItem(likedKey, "true");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === "Você já curtiu este artigo.") {
          setLiked(true);
          localStorage.setItem(likedKey, "true");
          return;
        }
      }
    }
  }

  async function handleSharePost() {
    const postUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(postUrl);

      setShareMessage("Link copiado!");

      setTimeout(() => {
        setShareMessage("");
      }, 2000);
    } catch {
      const textarea = document.createElement("textarea");

      textarea.value = postUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      document.execCommand("copy");
      document.body.removeChild(textarea);

      setShareMessage("Link copiado!");

      setTimeout(() => {
        setShareMessage("");
      }, 2000);
    }
  }

  async function handleCreateComment(event: FormEvent) {
    event.preventDefault();

    if (!post) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      setCommentError("Digite um comentário antes de enviar.");
      return;
    }

    try {
      setCommentError("");

      const response = await api.post(
        `/posts/${post.id}/comments`,
        {
          content: newComment
        },
        {
          headers: getAuthHeaders()
        }
      );

      setComments((currentComments) => [response.data, ...currentComments]);
      setCommentsCount((current) => current + 1);
      setNewComment("");
    } catch {
      setCommentError("Não foi possível enviar o comentário.");
    }
  }

  async function handleDeleteComment(commentId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.delete(`/posts/comments/${commentId}`, {
        headers: getAuthHeaders()
      });

      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId)
      );

      setCommentsCount((current) => Math.max(current - 1, 0));
    } catch {
      setCommentError("Não foi possível excluir o comentário.");
    }
  }

  useEffect(() => {
    loadPostDetails();

    function handleUserUpdated() {
      const updatedUser = loadCurrentUser();

      if (post) {
        const likedKey = getLikedStorageKey(post.id, updatedUser);
        const likedFromStorage = localStorage.getItem(likedKey);

        setLiked(likedFromStorage === "true");
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
  const readingTime = calculateReadingTime(post.content);
  const isAuthenticated = !!localStorage.getItem("token");

  const isCurrentUserAuthor = currentUser?.email === post.author.email;
  const authorAvatar = isCurrentUserAuthor ? currentUser?.avatar : "";
  const authorInitial = post.author.name.charAt(0).toUpperCase();

  const postCategory = post.category || "Desenvolvimento web";

  const postSummary =
    post.summary ||
    (post.content.length > 120
      ? `${post.content.slice(0, 120)}...`
      : post.content);

  const postTags = post.tags
    ? post.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : ["Desenvolvimento web", "Tecnologia", "Backend"];

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

          <span className="post-category">{postCategory}</span>

          <h1>{post.title}</h1>

          <p className="post-summary">{postSummary}</p>

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

            <div className="post-actions-wrapper">
              <div className="post-action-icons">
                <button
                  type="button"
                  aria-label="Curtir"
                  className={liked ? "post-action-liked" : ""}
                  onClick={handleToggleLike}
                >
                  <img src={heartIcon} alt="" className="detail-icon" />
                </button>

                <button type="button" aria-label="Salvar">
                  <img src={bookmarkIcon} alt="" className="detail-icon" />
                </button>

                <button
                  type="button"
                  aria-label="Compartilhar"
                  onClick={handleSharePost}
                >
                  <img src={shareIcon} alt="" className="detail-icon" />
                </button>
              </div>

              {shareMessage && (
                <span className="post-share-message">{shareMessage}</span>
              )}
            </div>
          </div>

          <div className="post-stats-row">
            <span>
              <img src={heartIcon} alt="" className="detail-icon" />
              {likesCount} curtidas
            </span>

            <span>
              <img src={eyeIcon} alt="" className="detail-icon" />
              {viewsCount} visualizações
            </span>

            <span>
              <img src={commentIcon} alt="" className="detail-icon" />
              {commentsCount} comentários
            </span>
          </div>

          {post.banner && (
            <img
              className="post-details-banner"
              src={`http://localhost:3333${post.banner}`}
              alt={post.title}
            />
          )}

          <div className="post-content markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="post-tags">
            {postTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <section className="comments-section">
            <h2>Comentários ({commentsCount})</h2>

            {isAuthenticated ? (
              <form className="comment-form-box" onSubmit={handleCreateComment}>
                <textarea
                  placeholder="Escreva seu comentário..."
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                />

                {commentError && (
                  <span className="comment-error">{commentError}</span>
                )}

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
              const commentInitial = comment.user.name.charAt(0).toUpperCase();

              const isCommentOwner = currentUser?.id === comment.user.id;
              const isPostOwner = currentUser?.id === post.author.id;
              const canDeleteComment = isCommentOwner || isPostOwner;

              const shouldUseCurrentUserAvatar =
                currentUser?.id === comment.user.id && currentUser?.avatar;

              return (
                <div className="comment-card" key={comment.id}>
                  <div className="comment-top">
                    <div className="comment-user">
                      {shouldUseCurrentUserAvatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={comment.user.name}
                          className="comment-photo"
                        />
                      ) : (
                        <span className="comment-photo-fallback">
                          {commentInitial}
                        </span>
                      )}

                      <div className="comment-user-info">
                        <strong>{comment.user.name}</strong>
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="comment-actions">
                      {canDeleteComment && (
                        <button
                          type="button"
                          className="comment-delete-button"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Excluir
                        </button>
                      )}
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