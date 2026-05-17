import axios from "axios"; // usado para identificar erros vindos do Axios/API
import { FormEvent, useState } from "react"; // FormEvent tipa o formulário e useState controla os estados
import { Link, useNavigate } from "react-router-dom"; // Link navega entre páginas e useNavigate redireciona via código

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import "./Register.css"; // estilos da página de cadastro

// componente responsável pela tela de cadastro
export function Register() {
  const navigate = useNavigate(); // função usada para redirecionar o usuário

  const [name, setName] = useState(""); // armazena o nome digitado
  const [email, setEmail] = useState(""); // armazena o email digitado
  const [password, setPassword] = useState(""); // armazena a senha digitada
  const [confirmPassword, setConfirmPassword] = useState(""); // armazena a confirmação de senha

  const [error, setError] = useState(""); // armazena mensagem de erro
  const [success, setSuccess] = useState(""); // armazena mensagem de sucesso
  const [loading, setLoading] = useState(false); // controla se a requisição está carregando

  // função executada quando o formulário é enviado
  async function handleRegister(event: FormEvent) {
    event.preventDefault(); // impede o recarregamento da página

    setError(""); // limpa erros antigos
    setSuccess(""); // limpa mensagens antigas de sucesso

    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password
      });

      setSuccess("Conta criada com sucesso! Redirecionando para o login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Não foi possível criar a conta.";

        setError(message);
        return;
      }

      setError("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="register-page">
        <section className="register-card">
          <Link to="/" className="register-logo">
            &lt;M/&gt;
          </Link>

          <h1>Criar Conta</h1>

          <p>Cadastre-se para começar a publicar seus artigos</p>

          <form onSubmit={handleRegister} className="register-form">
            <label>
              Nome Completo
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <label>
              Confirmar senha
              <input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>

            {error && <span className="register-error">{error}</span>}

            {success && <span className="register-success">{success}</span>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="register-footer-text">
            Já tem uma conta? <Link to="/login">Fazer login</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}