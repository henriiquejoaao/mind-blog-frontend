import { Link } from "react-router-dom"; // componente usado para navegar para detalhes do artigo

import clockIcon from "../assets/clock.svg"; // ícone usado para data e tempo de leitura
import eyeIcon from "../assets/eye.svg"; // ícone usado para visualizações
import heartIcon from "../assets/heart.svg"; // ícone usado para curtidas

import "./PostCard.css"; // estilos do card

interface Author {
  id: number;
  name: string;
  email: string;
}

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    banner?: string;
    createdAt: string;
    author: Author;
  };
  variant?: "default" | "compact";
}

// componente responsável por exibir um artigo em formato de card
export function PostCard({ post, variant = "default" }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <article className={`post-card post-card-${variant}`}>
      <Link to={`/posts/${post.id}`}>
        {post.banner && variant === "default" && (
          <img
            className="post-card-image"
            src={`http://localhost:3333${post.banner}`}
            alt={post.title}
          />
        )}

        <div className="post-card-body">
          <div className="post-card-meta">
            <span className="post-card-category">Desenvolvimento web</span>

            <span className="post-card-date">
              <img src={clockIcon} alt="" />
              {formattedDate}
            </span>
          </div>

          <h3>{post.title}</h3>

          <p>{post.content}</p>

          <div className="post-card-footer">
            <span className="post-card-author">{post.author.name}</span>

            <div className="post-card-stats">
              <span>
                <img src={clockIcon} alt="" />
                6min
              </span>

              <span>
                <img src={eyeIcon} alt="" />
                122
              </span>

              <span>
                <img src={heartIcon} alt="" />1
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}