import { BrowserRouter, Routes, Route } from "react-router-dom"; // componentes usados para configurar as rotas da aplicação

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { PostDetails } from "../pages/PostDetails";

// componente responsável por centralizar as rotas da aplicação
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rota da página inicial, responsável por listar os artigos */}
        <Route path="/" element={<Home />} />

        {/* rota alternativa para listar os artigos */}
        <Route path="/posts" element={<Home />} />

        {/* rota da página de login */}
        <Route path="/login" element={<Login />} />

        {/* rota da página de cadastro */}
        <Route path="/register" element={<Register />} />

        {/* rota dinâmica da página de detalhes do artigo */}
        <Route path="/posts/:id" element={<PostDetails />} />
      </Routes>
    </BrowserRouter>
  );
}