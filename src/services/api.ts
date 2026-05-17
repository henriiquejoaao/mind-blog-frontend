import axios from "axios"; // biblioteca usada para fazer requisições HTTP

// instância centralizada do Axios com a URL base do backend
export const api = axios.create({
  baseURL: "http://localhost:3333"
});

// interceptor executado antes de cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // busca o token salvo no login

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // envia o token no header Authorization
  }

  return config;
});