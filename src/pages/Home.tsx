import { useEffect, useState } from "react"; // hooks do React para estado e efeitos
import { Link } from "react-router-dom"; // componente usado para navegação entre páginas

import { api } from "../services/api"; // instância do Axios configurada com a URL do backend

import { Footer } from "../components/Footer"; // rodapé
import { PostCard } from "../components/PostCard"; // card de artigo
import { Header } from "../components/Header"; // topo

import mailIcon from "../assets/mail.svg"; // ícone da newsletter

import "./Home.css"; // estilos específicos da página Home

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

// componente da página inicial
export function Home() {
  const [posts, setPosts] = useState<Post[]>([]); // armazena a lista de posts
  const [isAuthenticated, setIsAuthenticated] = useState(false); // controla se o usuário está logado

  // busca os posts do backend
  async function loadPosts() {
    const response = await api.get("/posts");

    setPosts(response.data);
  }

  // verifica se existe token salvo
  function checkAuthentication() {
    const token = localStorage.getItem("token");

    setIsAuthenticated(!!token);
  }

  useEffect(() => {
    loadPosts();
    checkAuthentication();

    window.addEventListener("user-updated", checkAuthentication);

    return () => {
      window.removeEventListener("user-updated", checkAuthentication);
    };
  }, []);

  // artigos em destaque: ordenados por mais curtidas
  const featuredPosts = [...posts]
    .sort((postA, postB) => {
      const likesA = postA._count?.likes ?? 0;
      const likesB = postB._count?.likes ?? 0;

      if (likesB !== likesA) {
        return likesB - likesA;
      }

      // se empatar em curtidas, mostra o mais recente primeiro
      return (
        new Date(postB.createdAt).getTime() -
        new Date(postA.createdAt).getTime()
      );
    })
    .slice(0, 6);

  // artigos recentes: ordenados por data de criação
  const recentPosts = [...posts]
    .sort(
      (postA, postB) =>
        new Date(postB.createdAt).getTime() -
        new Date(postA.createdAt).getTime()
    )
    .slice(0, 9);

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="container hero-content">
            <h1>
              Explore o Futuro da <span>Tecnologia</span>
            </h1>

            <p>
              Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências
              tecnológicas
            </p>

            <div className="hero-actions">
              <Link to="/posts" className="btn btn-primary">
                Explorar Artigos
              </Link>

              {isAuthenticated ? (
                <Link to="/dashboard/posts/new" className="btn btn-outline">
                  Começar a Escrever
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline">
                  Começar a Escrever
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header section-header-row">
              <div>
                <h2>Artigos em Destaque</h2>
                <p>Os conteúdos mais curtidos pela comunidade</p>
              </div>

              <Link to="/posts" className="see-all-link">
                Ver todos →
              </Link>
            </div>

            <div className="posts-grid">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>

        <section className="section recent-section">
          <div className="container">
            <div className="section-header">
              <h2>Artigos Recentes</h2>
              <p>Conteúdo recente da comunidade</p>
            </div>

            <div className="posts-grid recent-grid">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        <section className="section newsletter">
          <div className="container">
            <div className="newsletter-content">
              <div className="newsletter-icon">
                <img src={mailIcon} alt="" />
              </div>

              <h2>Newsletter Semanal</h2>

              <p>
                Receba os melhores artigos de tecnologia diretamente no seu
                email. Sem spam, apenas conteúdo de qualidade.
              </p>

              <form className="newsletter-form">
                <input type="email" placeholder="exemplo@email.com" />

                <button type="button" className="btn btn-primary">
                  Inscrever
                </button>
              </form>
            </div>
          </div>
        </section>

        {!isAuthenticated && (
          <section className="section cta">
            <div className="container">
              <div className="cta-box">
                <h2>Compartilhe Seu Conhecimento</h2>

                <p>
                  Junte-se à nossa comunidade de escritores e compartilhe suas
                  experiências e conhecimentos em tecnologia.
                </p>

                <Link to="/register" className="btn btn-primary">
                  Criar Conta Gratuita
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}