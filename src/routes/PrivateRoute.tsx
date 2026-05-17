import { Navigate, Outlet } from "react-router-dom"; // Navigate redireciona e Outlet renderiza a rota filha

// componente responsável por proteger rotas privadas
export function PrivateRoute() {
  const token = localStorage.getItem("token"); // busca o token salvo após o login

  if (!token) {
    return <Navigate to="/login" replace />; // se não tiver token, manda para login
  }

  return <Outlet />; // se tiver token, libera a página protegida
}