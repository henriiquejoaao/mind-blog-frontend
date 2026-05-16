import { useEffect, useState } from "react"; // hooks do React para estado e carregamento
import { useParams } from "react-router-dom"; // hook usado para acessar parâmetros da URL
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
  banner?: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

// componente responsável pela página de detalhes de um artigo
export function PostDetails() {
  const { id } = useParams(); // pega o parâmetro "id" da URL

  const [post, setPost] = useState<Post | null>(null); // estado que armazena o artigo encontrado
  const [loading, setLoading] = useState(true); // estado usado para controlar o carregamento
  const [error, setError] = useState(""); // estado usado para guardar mensagens de erro

  // função responsável por buscar o artigo pelo id
  async function loadPost() {
    try {
      const response = await api.get(`/posts/${id}`); // faz GET em http://localhost:3333/posts/:id

      setPost(response.data); // salva o artigo retornado pela API
    } catch {
      setError("Artigo não encontrado."); // define mensagem caso a API retorne erro
    } finally {
      setLoading(false); // finaliza o carregamento, com sucesso ou erro
    }
  }

  // executa a busca do artigo quando a página carrega ou quando o id muda
  useEffect(() => {
    loadPost();
  }, [id]);

  if (loading) {
    return <p>Carregando artigo...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return <p>Artigo não encontrado.</p>;
  }

  return (
    <main>
      {post.banner && (
        <img
          src={`http://localhost:3333${post.banner}`}
          alt={post.title}
          width={500}
        />
      )}

      <h1>{post.title}</h1>

      <p>{post.content}</p>

      <small>Autor: {post.author.name}</small>
    </main>
  );
}