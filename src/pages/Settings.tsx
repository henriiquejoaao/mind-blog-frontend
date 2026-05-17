import { ChangeEvent, FormEvent, useEffect, useState } from "react"; // hooks e tipos de eventos
import { Link, useNavigate } from "react-router-dom"; // navegação entre páginas e redirecionamento

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé

import personIcon from "../assets/person.svg"; // ícone de usuário
import mailIcon from "../assets/mail.svg"; // ícone de email
import trashIcon from "../assets/trash.svg"; // ícone de lixeira

import "./Settings.css"; // estilos da página de configurações

interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

// componente responsável pela tela de configurações do perfil
export function Settings() {
  const navigate = useNavigate(); // usado para redirecionar o usuário

  const [name, setName] = useState(""); // armazena o nome do usuário
  const [email, setEmail] = useState(""); // armazena o email do usuário
  const [bio, setBio] = useState(""); // armazena a bio do usuário

  const [avatarFile, setAvatarFile] = useState<File | null>(null); // armazena o arquivo escolhido
  const [avatarPreview, setAvatarPreview] = useState(""); // armazena a prévia da imagem
  const [removeAvatar, setRemoveAvatar] = useState(false); // controla remoção visual da foto

  const [successModalOpen, setSuccessModalOpen] = useState(false); // controla o modal de sucesso

  // carrega os dados do usuário salvo no login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    const user: User = JSON.parse(storedUser);

    setName(user.name || "");
    setEmail(user.email || "");
    setBio(
      user.bio ||
        "Desenvolvedor Full Stack apaixonado por tecnologia e inovação."
    );

    if (user.avatar) {
      setAvatarPreview(user.avatar);
    } else {
      setAvatarPreview("");
    }
  }, [navigate]);

  // converte imagem para base64 para poder salvar no localStorage
  function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(String(reader.result));
      };

      reader.onerror = () => {
        reject(new Error("Não foi possível carregar a imagem."));
      };

      reader.readAsDataURL(file);
    });
  }

  // executada quando o usuário escolhe uma nova imagem
  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const base64Image = await convertFileToBase64(file);

    setAvatarFile(file);
    setRemoveAvatar(false);
    setAvatarPreview(base64Image);
  }

  // remove a imagem da prévia
  function handleRemoveAvatar() {
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(true);
  }

  // salva os dados visualmente no localStorage
  function handleSaveSettings(event: FormEvent) {
    event.preventDefault();

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const currentUser: User = JSON.parse(storedUser);

      const updatedUser: User = {
        ...currentUser,
        name,
        email,
        bio
      };

      if (avatarPreview && !removeAvatar) {
        updatedUser.avatar = avatarPreview;
      }

      if (removeAvatar || !avatarPreview) {
        delete updatedUser.avatar;
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // avisa o Header que o usuário foi atualizado
      window.dispatchEvent(new Event("user-updated"));
    }

    setSuccessModalOpen(true);
  }

  // fecha o modal de sucesso
  function handleCloseModal() {
    setSuccessModalOpen(false);
  }

  return (
    <>
      <Header />

      <main className="settings-page">
        <section className="settings-container">
          <Link to="/dashboard" className="settings-back-link">
            <span>←</span>
            Voltar ao Dashboard
          </Link>

          <div className="settings-top-divider" />

          <div className="settings-header">
            <h1>Configurações do Perfil</h1>
            <p>Gerencie suas informações pessoais</p>
          </div>

          <form className="settings-card" onSubmit={handleSaveSettings}>
            <div className="settings-avatar-area">
              <label htmlFor="avatar" className="settings-avatar-upload">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={name || "Foto de perfil"} />
                ) : (
                  <div className="settings-avatar-placeholder">
                    <strong>Adicionar foto</strong>
                    <span>PNG, JPG ou JPEG</span>
                  </div>
                )}
              </label>

              <input
                id="avatar"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleAvatarChange}
                className="settings-avatar-input"
              />

              <label htmlFor="avatar" className="settings-avatar-label">
                Foto de Perfil
              </label>

              <div
                className={
                  avatarPreview
                    ? "settings-avatar-control-row has-remove"
                    : "settings-avatar-control-row no-remove"
                }
              >
                <label htmlFor="avatar" className="settings-avatar-path">
                  {avatarFile
                    ? avatarFile.name
                    : avatarPreview
                    ? avatarPreview
                    : "Nenhuma imagem selecionada"}
                </label>

                {avatarPreview && (
                  <button
                    type="button"
                    className="settings-remove-avatar-icon-button"
                    onClick={handleRemoveAvatar}
                    aria-label="Remover imagem de perfil"
                  >
                    <img src={trashIcon} alt="" />
                  </button>
                )}
              </div>

              <span className="settings-avatar-help">
                Adicione uma imagem ou deixe em branco
              </span>
            </div>

            <div className="settings-field">
              <label htmlFor="name">
                <img src={personIcon} alt="" className="settings-field-icon" />
                Nome Completo
              </label>

              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="settings-field">
              <label htmlFor="email">
                <img src={mailIcon} alt="" className="settings-field-icon" />
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="settings-field">
              <label htmlFor="bio">Bio</label>

              <textarea
                id="bio"
                placeholder="Fale um pouco sobre você..."
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={500}
              />

              <span className="settings-counter">
                {bio.length}/500 caracteres
              </span>
            </div>

            <div className="settings-divider" />

            <section className="settings-account-info">
              <h2>Informações da conta</h2>

              <div className="settings-account-grid">
                <div>
                  <span>Tipo de conta</span>
                  <strong>Admin</strong>
                </div>

                <div>
                  <span>Membro desde</span>
                  <strong>20/01/2026</strong>
                </div>
              </div>
            </section>

            <button type="submit" className="settings-save-button">
              Salvar Alterações
            </button>
          </form>
        </section>
      </main>

      <Footer />

      {successModalOpen && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <h2>Perfil atualizado!</h2>

            <p>Suas alterações foram salvas localmente.</p>

            <button
              type="button"
              className="settings-modal-button"
              onClick={handleCloseModal}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}