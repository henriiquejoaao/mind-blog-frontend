import axios from "axios"; // usado para identificar erros vindos do Axios/API
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from "react"; // hooks e tipos de eventos do React
import { Link, useNavigate } from "react-router-dom"; // Link navega entre páginas e useNavigate redireciona via código

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import "./NewPost.css"; // estilos da página de criação de artigo

// componente responsável pela criação de um novo artigo
export function NewPost() {
  const navigate = useNavigate(); // usado para redirecionar o usuário

  const [title, setTitle] = useState(""); // título do artigo
  const [summary, setSummary] = useState(""); // resumo do artigo
  const [category, setCategory] = useState("Desenvolvimento web"); // categoria do artigo
  const [content, setContent] = useState(""); // conteúdo em markdown

  const [tagInput, setTagInput] = useState(""); // texto digitado para adicionar tag
  const [tags, setTags] = useState<string[]>([]); // lista de tags

  const [banner, setBanner] = useState<File | null>(null); // arquivo de imagem selecionado
  const [bannerPreview, setBannerPreview] = useState(""); // prévia da imagem
  const [bannerFileName, setBannerFileName] = useState(""); // nome do arquivo escolhido

  const [error, setError] = useState(""); // mensagens de erro
  const [loading, setLoading] = useState(false); // carregamento do botão
  const [successModalOpen, setSuccessModalOpen] = useState(false); // modal de sucesso

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

    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
    setBannerFileName(file.name);
  }

  // adiciona uma tag na lista
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

  // remove uma tag da lista
  function handleRemoveTag(tagToRemove: string) {
    setTags((currentTags) =>
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  }

  // permite adicionar tag apertando Enter
  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  }

  // função executada ao enviar o formulário
  async function handleCreatePost(event: FormEvent) {
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
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("tags", tags.join(","));

      if (banner) {
        formData.append("banner", banner);
      }

      await api.post("/posts", formData, {
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
              <label htmlFor="title">Título do Artigo *</label>

              <input
                id="title"
                type="text"
                placeholder="O Futuro da Inteligência Artificial em 2025"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="new-post-field">
              <label htmlFor="summary">Resumo *</label>

              <textarea
                id="summary"
                className="new-post-summary"
                placeholder="Escreva um breve resumo do artigo..."
                value={summary}
                maxLength={120}
                onChange={(event) => setSummary(event.target.value)}
              />

              <span className="new-post-counter">
                {summary.length}/120 caracteres
              </span>
            </div>

            <div className="new-post-field">
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

            <div className="new-post-field">
              <label htmlFor="banner">Imagem de Capa</label>

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

              {bannerFileName && (
                <div className="new-post-banner-name">{bannerFileName}</div>
              )}
            </div>

            <div className="new-post-field">
              <label htmlFor="tag">Tags</label>

              <div className="new-post-tags-row">
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
                  className="new-post-add-tag-button"
                  onClick={handleAddTag}
                >
                  Adicionar
                </button>
              </div>

              {tags.length > 0 && (
                <div className="new-post-tags-list">
                  {tags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className="new-post-tag"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <span>×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="new-post-field">
              <label htmlFor="content">Conteúdo do Artigo *</label>

              <textarea
                id="content"
                className="new-post-content-textarea"
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