import axios from "axios"; // usado para identificar erros vindos do Axios/API
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState
} from "react"; // hooks e tipos de eventos do React
import { Link, useNavigate, useParams } from "react-router-dom"; // navegação e parâmetros da URL

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import trashIcon from "../assets/trash.svg"; // ícone de remover imagem

import "./EditPost.css"; // estilos da página de edição

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  summary?: string | null;
  content: string;
  banner?: string | null;
  category?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: Author;
}

// componente responsável pela edição de um artigo
export function EditPost() {
  const { id } = useParams(); // pega o id do artigo pela URL
  const navigate = useNavigate(); // usado para redirecionar o usuário

  const [title, setTitle] = useState(""); // título do artigo
  const [summary, setSummary] = useState(""); // resumo do artigo
  const [category, setCategory] = useState("Desenvolvimento web"); // categoria do artigo
  const [content, setContent] = useState(""); // conteúdo em markdown

  const [tagInput, setTagInput] = useState(""); // input para adicionar tag
  const [tags, setTags] = useState<string[]>([]); // lista de tags

  const [banner, setBanner] = useState<File | null>(null); // nova imagem selecionada
  const [bannerPreview, setBannerPreview] = useState(""); // prévia da imagem
  const [bannerFileName, setBannerFileName] = useState(""); // nome da nova imagem
  const [removeBanner, setRemoveBanner] = useState(false); // controla remoção da imagem

  const [loading, setLoading] = useState(true); // carregamento inicial
  const [saving, setSaving] = useState(false); // carregamento do botão salvar
  const [error, setError] = useState(""); // mensagem de erro
  const [successModalOpen, setSuccessModalOpen] = useState(false); // modal de sucesso

  // carrega o artigo atual
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
      setSummary(post.summary || "");
      setCategory(post.category || "Desenvolvimento web");
      setContent(post.content);

      if (post.tags) {
        const formattedTags = post.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

        setTags(formattedTags);
      }

      if (post.banner) {
        setBannerPreview(`http://localhost:3333${post.banner}`);
      }
    } catch {
      setError("Não foi possível carregar o artigo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPost();
  }, [id]);

  // função executada quando o usuário seleciona uma nova imagem
  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
    setBannerFileName(file.name);
    setRemoveBanner(false);
  }

  // remove a imagem atual ou a nova imagem selecionada
  function handleRemoveBanner() {
    setBanner(null);
    setBannerPreview("");
    setBannerFileName("");
    setRemoveBanner(true);
  }

  // adiciona tag na lista
  function handleAddTag() {
    const formattedTag = tagInput.trim();

    if (!formattedTag) {
      return;
    }

    if (tags.includes(formattedTag)) {
      setTagInput("");
      return;
    }

    setTags((currentTags) => [...currentTags, formattedTag]);
    setTagInput("");
  }

  // remove tag da lista
  function handleRemoveTag(tagToRemove: string) {
    setTags((currentTags) =>
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  }

  // permite adicionar tag com Enter
  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  }

  // salva alterações do artigo
  async function handleUpdatePost(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    if (!summary.trim()) {
      setError("O resumo é obrigatório.");
      return;
    }

    if (!category.trim()) {
      setError("A categoria é obrigatória.");
      return;
    }

    if (!content.trim()) {
      setError("O conteúdo é obrigatório.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("tags", tags.join(","));
      formData.append("removeBanner", String(removeBanner));

      if (banner) {
        formData.append("banner", banner);
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

  // fecha modal e volta para o dashboard
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

          <form className="edit-post-form" onSubmit={handleUpdatePost}>
            <div className="edit-post-field">
              <label htmlFor="title">Título do Artigo *</label>

              <input
                id="title"
                type="text"
                placeholder="O Futuro da Inteligência Artificial em 2025"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="edit-post-field">
              <label htmlFor="summary">Resumo *</label>

              <textarea
                id="summary"
                className="edit-post-summary"
                placeholder="Escreva um breve resumo do artigo..."
                value={summary}
                maxLength={120}
                onChange={(event) => setSummary(event.target.value)}
              />

              <span className="edit-post-counter">
                {summary.length}/120 caracteres
              </span>
            </div>

            <div className="edit-post-field">
              <label htmlFor="category">Categoria *</label>

              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="Desenvolvimento web">Desenvolvimento web</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Inteligência Artificial">
                  Inteligência Artificial
                </option>
                <option value="DevOps">DevOps</option>
                <option value="Banco de Dados">Banco de Dados</option>
              </select>
            </div>

            <div className="edit-post-field">
              <label htmlFor="banner">Imagem de Capa</label>

              <label htmlFor="banner" className="edit-banner-upload-area">
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
                className="edit-banner-input"
              />

              <div
                className={
                  bannerPreview
                    ? "edit-banner-control-row has-remove"
                    : "edit-banner-control-row no-remove"
                }
              >
                <label htmlFor="banner" className="edit-banner-name">
                  {bannerFileName ||
                    (bannerPreview
                      ? "Imagem atual do artigo"
                      : "Nenhuma imagem selecionada")}
                </label>

                {bannerPreview && (
                  <button
                    type="button"
                    className="edit-remove-banner-button"
                    onClick={handleRemoveBanner}
                    aria-label="Remover imagem de capa"
                  >
                    <img src={trashIcon} alt="" />
                  </button>
                )}
              </div>
            </div>

            <div className="edit-post-field">
              <label htmlFor="tag">Tags</label>

              <div className="edit-post-tags-row">
                <input
                  id="tag"
                  type="text"
                  placeholder="Digite uma tag"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                />

                <button
                  type="button"
                  className="edit-post-add-tag-button"
                  onClick={handleAddTag}
                >
                  Adicionar
                </button>
              </div>

              {tags.length > 0 && (
                <div className="edit-post-tags-list">
                  {tags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className="edit-post-tag"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <span>×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="edit-post-field">
              <label htmlFor="content">Conteúdo do Artigo *</label>

              <textarea
                id="content"
                className="edit-post-content-textarea"
                placeholder={`## Introdução

Escreva seu artigo usando Markdown.

## Principais pontos

- Primeiro ponto
- Segundo ponto

## Conclusão

Finalize seu artigo aqui.`}
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
        </section>
      </main>

      <Footer />

      {successModalOpen && (
        <div className="edit-success-modal-overlay">
          <div className="edit-success-modal">
            <h2>Artigo atualizado!</h2>

            <p>As alterações foram salvas com sucesso.</p>

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