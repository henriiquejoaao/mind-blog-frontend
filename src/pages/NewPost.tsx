import axios from "axios"; // usado para identificar erros vindos do Axios/API
import { ChangeEvent, FormEvent, useEffect, useState } from "react"; // hooks e tipos de eventos do React
import { Link, useNavigate } from "react-router-dom"; // Link navega entre páginas e useNavigate redireciona via código

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import "./NewPost.css"; // estilos da página de criação de artigo

// componente responsável pela criação de um novo artigo
export function NewPost() {
  const navigate = useNavigate(); // usado para redirecionar o usuário

  const [title, setTitle] = useState(""); // armazena o título do artigo
  const [content, setContent] = useState(""); // armazena o conteúdo do artigo
  const [banner, setBanner] = useState<File | null>(null); // armazena o arquivo de imagem selecionado
  const [bannerPreview, setBannerPreview] = useState(""); // armazena a URL temporária para pré-visualizar a imagem

  const [error, setError] = useState(""); // armazena mensagens de erro
  const [loading, setLoading] = useState(false); // controla o carregamento do botão
  const [successModalOpen, setSuccessModalOpen] = useState(false); // controla a abertura do modal de sucesso

  // verifica se o usuário está logado ao abrir a página
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // função executada quando o usuário seleciona uma imagem
  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setBanner(file); // salva o arquivo selecionado
    setBannerPreview(URL.createObjectURL(file)); // cria uma URL temporária para preview
  }

  // função executada ao enviar o formulário
  async function handleCreatePost(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!title || !content) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      if (banner) {
        formData.append("banner", banner);
      }

      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccessModalOpen(true); // abre o modal de sucesso após criar o artigo
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Não foi possível criar o artigo.";

        setError(message);
        return;
      }

      setError("Não foi possível criar o artigo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // fecha o modal e redireciona para o dashboard
  function handleSuccessConfirm() {
    setSuccessModalOpen(false);
    navigate("/dashboard");
  }

  return (
    <>
      <Header />

      <main className="new-post-page">
        <section className="new-post-container">
          <Link to="/dashboard" className="new-post-back-link">
            ← Voltar ao Dashboard
          </Link>

          <div className="new-post-header">
            <h1>Criar Novo Artigo</h1>
            <p>Compartilhe seu conhecimento com a comunidade</p>
          </div>

          <form className="new-post-form" onSubmit={handleCreatePost}>
            <div className="new-post-field">
              <label htmlFor="title">Título do artigo</label>

              <input
                id="title"
                type="text"
                placeholder="Digite o título do seu artigo"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="new-post-field">
              <label htmlFor="banner">Imagem de capa</label>

              <label htmlFor="banner" className="banner-upload-area">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Prévia da imagem selecionada" />
                ) : (
                  <div>
                    <strong>Clique para selecionar uma imagem</strong>
                    <span>PNG, JPG ou JPEG</span>
                  </div>
                )}
              </label>

              <input
                id="banner"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleBannerChange}
                className="banner-input"
              />
            </div>

            <div className="new-post-field">
              <label htmlFor="content">Conteúdo</label>

              <textarea
                id="content"
                placeholder="Escreva o conteúdo do artigo..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>

            {error && <span className="new-post-error">{error}</span>}

            <div className="new-post-actions">
              <Link to="/dashboard" className="new-post-cancel-button">
                Cancelar
              </Link>

              <button
                type="submit"
                className="new-post-submit-button"
                disabled={loading}
              >
                {loading ? "Publicando..." : "Publicar Artigo"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />

      {successModalOpen && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <h2>Artigo criado com sucesso!</h2>

            <p>
              Seu artigo foi publicado e já pode ser visualizado no dashboard e
              na listagem de artigos.
            </p>

            <button
              type="button"
              className="success-modal-button"
              onClick={handleSuccessConfirm}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}