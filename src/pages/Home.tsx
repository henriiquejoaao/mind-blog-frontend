import { useEffect, useState } from "react"; // hooks do React para estado e efeitos
import { api } from "../services/api"; // instância do Axios configurada com a URL do backend

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
  banner?: string; // campo opcional, porque alguns posts podem não ter imagem
  createdAt: string;
  updatedAt: string;
  author: Author; // autor relacionado ao artigo
}

// componente da página inicial
export function Home() {
  // estado que armazena a lista de posts
  const [posts, setPosts] = useState<Post[]>([]);

  // função responsável por buscar os posts no backend
  async function loadPosts() {
    const response = await api.get("/posts"); // faz GET em http://localhost:3333/posts

    setPosts(response.data); // salva os posts recebidos no estado
  }

  // executa a função loadPosts quando a página é carregada
  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <main>
      <h1>Mind Blog</h1>

      {/* percorre a lista de posts e renderiza um article para cada item */}
      {posts.map((post) => (
        <article key={post.id}>
          {/* se o post tiver banner, renderiza a imagem */}
          {post.banner && (
            <img
              src={`http://localhost:3333${post.banner}`}
              alt={post.title}
              width={300}
            />
          )}

          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>Autor: {post.author.name}</small>
        </article>
      ))}
    </main>
  );
}