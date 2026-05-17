import { BrowserRouter, Routes, Route } from "react-router-dom"; // componentes usados para configurar as rotas da aplicação

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { PostDetails } from "../pages/PostDetails";
import { Posts } from "../pages/Posts";
import { Dashboard } from "../pages/Dashboard";
import { NewPost } from "../pages/NewPost";
import { EditPost } from "../pages/EditPost";
import { Settings } from "../pages/Settings";

import { ScrollToTop } from "./ScrollToTop"; // componente que volta o scroll para o topo ao mudar de página

// componente responsável por centralizar as rotas da aplicação
export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/posts/new" element={<NewPost />} />
        <Route path="/dashboard/posts/:id/edit" element={<EditPost />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}