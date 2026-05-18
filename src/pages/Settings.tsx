import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import personIcon from "../assets/person.svg";
import mailIcon from "../assets/mail.svg";
import trashIcon from "../assets/trash.svg";

import "./Settings.css";

interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [memberSince, setMemberSince] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);

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

    if (user.createdAt) {
      setMemberSince(new Date(user.createdAt).toLocaleDateString("pt-BR"));
    } else {
      setMemberSince("Não informado");
    }
  }, [navigate]);

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

  function handleRemoveAvatar() {
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(true);
  }

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

      window.dispatchEvent(new Event("user-updated"));
    }

    setSuccessModalOpen(true);
  }

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
                  <strong>Usuário</strong>
                </div>

                <div>
                  <span>Membro desde</span>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </section>

            <div className="settings-actions">
              <button type="submit" className="settings-save-button">
                Salvar Alterações
              </button>

              <Link to="/dashboard" className="settings-cancel-button">
                Cancelar
              </Link>
            </div>
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