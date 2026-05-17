import { useEffect, useState } from "react"; // hooks do React para estado e efeitos
import { api } from "../services/api"; // instância do Axios configurada com a URL do backend
import { Link } from "react-router-dom"; // componente usado para navegação entre páginas

import { Footer } from "../components/Footer";
import { PostCard } from "../components/PostCard";
import { Header } from "../components/Header";

import "./Home.css"; // estilos específicos da página Home

import mailIcon from "../assets/mail.svg";

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
  banner?: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

// componente da página inicial
export function Home() {
  const [posts, setPosts] = useState<Post[]>([]); // estado que armazena a lista de posts
  const [isAuthenticated, setIsAuthenticated] = useState(false); // controla se o usuário está logado

  async function loadPosts() {
    const response = await api.get("/posts");

    setPosts(response.data);
  }

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

  const featuredPosts = posts.slice(0, 6); // exibe até 6 artigos na seção de destaque
  const recentPosts = posts.slice(0, 9); // exibe até 9 artigos na seção de recentes

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
                <p>Os melhores conteúdos selecionados para você</p>
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