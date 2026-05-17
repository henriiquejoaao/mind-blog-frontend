import { BrowserRouter, Routes, Route } from "react-router-dom"; // componentes usados para configurar as rotas da aplicação

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { PostDetails } from "../pages/PostDetails";
import { Posts } from "../pages/Posts";

import { ScrollToTop } from "./ScrollToTop"; // componente que volta o scroll para o topo ao mudar de página

// componente responsável por centralizar as rotas da aplicação
export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* rota da página inicial */}
        <Route path="/" element={<Home />} />

        {/* rota da listagem completa de artigos */}
        <Route path="/posts" element={<Posts />} />

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