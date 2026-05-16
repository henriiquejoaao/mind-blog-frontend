import { useParams } from "react-router-dom"; // hook usado para acessar parâmetros da URL

// componente responsável pela página de detalhes de um artigo
export function PostDetails() {
  const { id } = useParams(); // pega o parâmetro "id" da URL

  return (
    <main>
      <h1>Detalhes do artigo</h1>
      <p>ID do artigo: {id}</p>
    </main>
  );
}