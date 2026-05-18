import { useEffect, useMemo, useState } from "react"; // hooks para estado, efeito e filtros calculados
import { Link } from "react-router-dom"; // navegação entre páginas

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { PostCard } from "../components/PostCard"; // card usado no layout grid
import { api } from "../services/api"; // instância do Axios configurada

import filterIcon from "../assets/filter.svg"; // ícone de filtro
import squaresIcon from "../assets/squares.svg"; // ícone de grid
import listIcon from "../assets/list.svg"; // ícone de lista
import clockIcon from "../assets/clock.svg"; // ícone de tempo de leitura
import eyeIcon from "../assets/eye.svg"; // ícone de visualizações
import heartIcon from "../assets/heart.svg"; // ícone de curtidas
import commentIcon from "../assets/comment.svg"; // ícone de comentários

import "./Posts.css"; // estilos da página de artigos

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

type LayoutMode = "grid" | "list";

// componente responsável pela página de listagem de todos os artigos
export function Posts() {
  const [posts, setPosts] = useState<Post[]>([]); // lista de artigos vindos do backend
  const [selectedCategory, setSelectedCategory] = useState("Todos"); // categoria selecionada
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid"); // layout atual da página
  const [loading, setLoading] = useState(true); // controla carregamento

  // busca os artigos do backend
  async function loadPosts() {
    try {
      const response = await api.get("/posts");

      setPosts(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  // calcula tempo de leitura do artigo
  function calculateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);

    return Math.max(minutes, 1);
  }

  // categorias disponíveis baseadas nos posts reais
  const categories = useMemo(() => {
    const postCategories = posts
      .map((post) => post.category || "Desenvolvimento web")
      .filter(Boolean);

    return ["Todos", ...Array.from(new Set(postCategories))];
  }, [posts]);

  // artigos filtrados pela categoria selecionada
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "Todos") {
      return posts;
    }

    return posts.filter(
      (post) => (post.category || "Desenvolvimento web") === selectedCategory
    );
  }, [posts, selectedCategory]);

  return (
    <>
      <Header />

      <main className="posts-page">
        <section className="posts-container">
          <div className="posts-header">
            <h1>Todos os Artigos</h1>
            <p>Explore conteúdos sobre tecnologia, desenvolvimento e inovação</p>
          </div>

          <div className="posts-toolbar">
            <label className="posts-filter">
              <img src={filterIcon} alt="" />

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="posts-layout-buttons">
              <button
                type="button"
                className={layoutMode === "grid" ? "active" : ""}
                onClick={() => setLayoutMode("grid")}
                aria-label="Visualizar em grid"
              >
                <img src={squaresIcon} alt="" />
              </button>

              <button
                type="button"
                className={layoutMode === "list" ? "active" : ""}
                onClick={() => setLayoutMode("list")}
                aria-label="Visualizar em lista"
              >
                <img src={listIcon} alt="" />
              </button>
            </div>
          </div>

          {loading ? (
            <p className="posts-message">Carregando artigos...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="posts-message">
              Nenhum artigo encontrado nessa categoria.
            </p>
          ) : layoutMode === "grid" ? (
            <div className="posts-grid">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="posts-list">
              {filteredPosts.map((post) => {
                const bannerUrl = post.banner
                  ? `http://localhost:3333${post.banner}`
                  : "";

                const readingTime = calculateReadingTime(post.content);
                const likesCount = post._count?.likes ?? 0;
                const commentsCount = post._count?.comments ?? 0;
                const viewsCount = post.views ?? 0;
                const category = post.category || "Desenvolvimento web";
                const summary =
                  post.summary ||
                  (post.content.length > 150
                    ? `${post.content.slice(0, 150)}...`
                    : post.content);

                return (
                  <article className="posts-list-card" key={post.id}>
                    <Link to={`/posts/${post.id}`} className="posts-list-image">
                      {bannerUrl ? (
                        <img src={bannerUrl} alt={post.title} />
                      ) : (
                        <span>Sem imagem</span>
                      )}
                    </Link>

                    <div className="posts-list-content">
                      <span className="posts-list-category">{category}</span>

                      <h2>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                      </h2>

                      <p>{summary}</p>

                      <div className="posts-list-footer">
                        <span>{post.author.name}</span>

                        <div className="posts-list-stats">
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
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}