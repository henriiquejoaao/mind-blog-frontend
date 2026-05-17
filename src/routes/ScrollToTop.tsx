import { useEffect } from "react"; // hook usado para executar uma ação quando algo mudar
import { useLocation } from "react-router-dom"; // hook usado para identificar a rota atual

// componente responsável por voltar o scroll para o topo quando a rota muda
export function ScrollToTop() {
  const { pathname } = useLocation(); // pega o caminho atual da URL

  useEffect(() => {
    window.scrollTo(0, 0); // move a página para o topo
  }, [pathname]); // executa sempre que o caminho da URL mudar

  return null; // não renderiza nada na tela
}