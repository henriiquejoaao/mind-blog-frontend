import { Link } from "react-router-dom"; // usado para navegar para detalhes do artigo

import clockIcon from "../assets/clock.svg"; // ícone de tempo de leitura
import eyeIcon from "../assets/eye.svg"; // ícone de visualizações
import heartIcon from "../assets/heart.svg"; // ícone de curtidas
import commentIcon from "../assets/comment.svg"; // ícone de comentários

import "./PostCard.css"; // estilos do card

interface Author {
  id: number;
  name: string;
  email: string;
}

interface PostCount {
  likes?: number;
  comments?: number;
}

interface Post {
  id: number;
  title: string;
  summary?: string | null;
  content: string;
  banner?: string | null;
  category?: string | null;
  tags?: string | null;
  views?: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  _count?: PostCount;
}

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
}

// componente responsável por exibir um card de artigo
export function PostCard({ post, variant = "default" }: PostCardProps) {
  const bannerUrl = post.banner ? `http://localhost:3333${post.banner}` : "";

  const likesCount = post._count?.likes ?? 0;
  const commentsCount = post._count?.comments ?? 0;
  const viewsCount = post.views ?? 0;

  const category = post.category || "Sem categoria";

  const summary =
    post.summary ||
    (post.content.length > 120
      ? `${post.content.slice(0, 120)}...`
      : post.content);

  function calculateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);

    return Math.max(minutes, 1);
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <article className={`post-card ${variant === "compact" ? "compact" : ""}`}>
      <Link to={`/posts/${post.id}`} className="post-card-image-link">
        {bannerUrl ? (
          <img src={bannerUrl} alt={post.title} className="post-card-image" />
        ) : (
          <div className="post-card-image-placeholder">
            <span>Sem imagem</span>
          </div>
        )}
      </Link>

      <div className="post-card-content">
        <span className="post-card-category">{category}</span>

        <h3>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h3>

        <p>{summary}</p>

        <div className="post-card-footer">
          <span>{post.author.name}</span>

          <div className="post-card-stats">
            <span>
              <img src={clockIcon} alt="" />
              {readingTime}min
            </span>

            <span>
              <img src={eyeIcon} alt="" />
              {viewsCount}
            </span>

            <span>
              <img src={heartIcon} alt="" />
              {likesCount}
            </span>

            <span>
              <img src={commentIcon} alt="" />
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}