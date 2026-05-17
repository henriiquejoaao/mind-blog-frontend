import axios from "axios"; // usado para identificar erros vindos do Axios/API
import { ChangeEvent, FormEvent, useEffect, useState } from "react"; // hooks e tipos de eventos do React
import { Link, useNavigate, useParams } from "react-router-dom"; // navegação e parâmetros da URL

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import "./EditPost.css"; // estilos da página de edição de artigo

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  banner?: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

// componente responsável pela edição de um artigo existente
export function EditPost() {
  const { id } = useParams(); // pega o id do artigo pela URL
  const navigate = useNavigate(); // usado para redirecionar o usuário

  const [title, setTitle] = useState(""); // armazena o título do artigo
  const [content, setContent] = useState(""); // armazena o conteúdo do artigo
  const [banner, setBanner] = useState<File | null>(null); // armazena a nova imagem selecionada
  const [bannerPreview, setBannerPreview] = useState(""); // armazena o preview da imagem atual ou nova
  const [removeBanner, setRemoveBanner] = useState(false); // controla se a imagem deve ser removida

  const [error, setError] = useState(""); // armazena mensagens de erro
  const [loading, setLoading] = useState(true); // controla carregamento inicial
  const [saving, setSaving] = useState(false); // controla envio do formulário
  const [successModalOpen, setSuccessModalOpen] = useState(false); // controla modal de sucesso

  // busca o artigo atual para preencher o formulário
  async function loadPost() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.get(`/posts/${id}`);
      const post: Post = response.data;

      setTitle(post.title);
      setContent(post.content);

      if (post.banner) {
        setBannerPreview(`http://localhost:3333${post.banner}`);
      }
    } catch {
      setError("Artigo não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPost();
  }, [id]);

  // executada quando o usuário escolhe uma nova imagem
  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setBanner(file);
    setRemoveBanner(false); // se escolheu nova imagem, não vamos remover o banner
    setBannerPreview(URL.createObjectURL(file));
  }

  // remove a imagem da prévia e marca que o banner deve ser removido no backend
  function handleRemoveBanner() {
    setBanner(null);
    setBannerPreview("");
    setRemoveBanner(true);
  }

  // envia os dados atualizados para o backend
  async function handleUpdatePost(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!title || !content) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      if (banner) {
        formData.append("banner", banner);
      }

      if (removeBanner) {
        formData.append("removeBanner", "true");
      }

      await api.put(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccessModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Não foi possível atualizar o artigo.";

        setError(message);
        return;
      }

      setError("Não foi possível atualizar o artigo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // fecha o modal e volta para o dashboard
  function handleSuccessConfirm() {
    setSuccessModalOpen(false);
    navigate("/dashboard");
  }

  if (loading) {
    return (
      <>
        <Header />

        <main className="edit-post-page">
          <section className="edit-post-container">
            <p className="edit-post-message">Carregando artigo...</p>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="edit-post-page">
        <section className="edit-post-container">
          <Link to="/dashboard" className="edit-post-back-link">
            ← Voltar ao Dashboard
          </Link>

          <div className="edit-post-header">
            <h1>Editar Artigo</h1>
            <p>Atualize as informações do seu artigo</p>
          </div>

          {error && !title ? (
            <p className="edit-post-error">{error}</p>
          ) : (
            <form className="edit-post-form" onSubmit={handleUpdatePost}>
              <div className="edit-post-field">
                <label htmlFor="title">Título do artigo</label>

                <input
                  id="title"
                  type="text"
                  placeholder="Digite o título do seu artigo"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="edit-post-field">
                <label htmlFor="banner">Imagem de capa</label>

                <label htmlFor="banner" className="edit-banner-upload-area">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Prévia da imagem do artigo" />
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
                  className="edit-banner-input"
                />

                {bannerPreview && (
                  <button
                    type="button"
                    className="remove-banner-button"
                    onClick={handleRemoveBanner}
                  >
                    Remover imagem
                  </button>
                )}
              </div>

              <div className="edit-post-field">
                <label htmlFor="content">Conteúdo</label>

                <textarea
                  id="content"
                  placeholder="Escreva o conteúdo do artigo..."
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              </div>

              {error && <span className="edit-post-error">{error}</span>}

              <div className="edit-post-actions">
                <Link to="/dashboard" className="edit-post-cancel-button">
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="edit-post-submit-button"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer />

      {successModalOpen && (
        <div className="edit-success-modal-overlay">
          <div className="edit-success-modal">
            <h2>Artigo atualizado com sucesso!</h2>

            <p>
              Suas alterações foram salvas e já estão disponíveis na listagem de
              artigos.
            </p>

            <button
              type="button"
              className="edit-success-modal-button"
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