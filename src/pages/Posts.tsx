import { useEffect, useState } from "react"; // hooks do React para estado e carregamento

import { Header } from "../components/Header"; // componente do topo da aplicação
import { Footer } from "../components/Footer"; // componente do rodapé da aplicação
import { PostCard } from "../components/PostCard"; // componente visual de artigo
import { api } from "../services/api"; // instância do Axios configurada com a URL do backend

import "./Posts.css"; // estilos da página de artigos

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
  banner?: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

// componente responsável pela página de listagem completa de artigos
export function Posts() {
  const [posts, setPosts] = useState<Post[]>([]); // armazena todos os artigos vindos da API
  const [search, setSearch] = useState(""); // armazena o texto digitado na busca
  const [category, setCategory] = useState("all"); // armazena a categoria selecionada

  // função responsável por buscar todos os artigos no backend
  async function loadPosts() {
    const response = await api.get("/posts"); // faz GET em http://localhost:3333/posts

    setPosts(response.data); // salva os artigos no estado
  }

  // carrega os artigos quando a página abre
  useEffect(() => {
    loadPosts();
  }, []);

  // filtra os artigos pelo texto digitado e pela categoria selecionada
  const filteredPosts = posts.filter((post) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower);

    const matchesCategory = category === "all" || category === "web";

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />

      <main className="posts-page">
        <section className="container posts-header">
          <div>
            <h1>Todos os Artigos</h1>
            <p>Explore nossa coleção completa de artigos técnicos</p>
          </div>

          <div className="posts-filters">
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">Todas as categorias</option>
              <option value="web">Desenvolvimento web</option>
            </select>
          </div>
        </section>

        <section className="container posts-list-section">
          {filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.slice(0, 9).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="empty-message">Nenhum artigo encontrado.</p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}