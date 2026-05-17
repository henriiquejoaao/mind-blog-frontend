import axios from "axios"; // usado para identificar erros vindos do Axios/API
import { FormEvent, useState } from "react"; // FormEvent tipa o formulário e useState controla os estados
import { Link, useNavigate } from "react-router-dom"; // Link navega entre páginas e useNavigate redireciona via código

import { Header } from "../components/Header"; // componente do topo
import { Footer } from "../components/Footer"; // componente do rodapé
import { api } from "../services/api"; // instância do Axios configurada com o backend

import "./Login.css"; // estilos da página de login

// componente responsável pela tela de login
export function Login() {
  const navigate = useNavigate(); // função usada para redirecionar o usuário

  const [email, setEmail] = useState(""); // armazena o email digitado
  const [password, setPassword] = useState(""); // armazena a senha digitada
  const [error, setError] = useState(""); // armazena mensagem de erro
  const [loading, setLoading] = useState(false); // controla se a requisição está carregando

  // função executada quando o formulário é enviado
  async function handleLogin(event: FormEvent) {
    event.preventDefault(); // impede o recarregamento da página

    setError(""); // limpa erros anteriores

    if (!email || !password) {
      setError("Email e senha são obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token); // salva o token JWT
      localStorage.setItem("user", JSON.stringify(response.data.user)); // salva os dados básicos do usuário

      navigate("/dashboard"); // redireciona para o dashboard
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Email ou senha inválidos.";

        setError(message);
        return;
      }

      setError("Não foi possível fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="auth-page">
        <section className="auth-card">
          <Link to="/" className="auth-logo">
            &lt;M/&gt;
          </Link>

          <h1>Entrar na Plataforma</h1>

          <p>Acesse sua conta para gerenciar seus artigos</p>

          <form onSubmit={handleLogin} className="auth-form">
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

            {error && <span className="auth-error">{error}</span>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-footer-text">
            Não tem uma conta? <Link to="/register">Criar conta</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}