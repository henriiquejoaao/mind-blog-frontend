import axios from "axios"; // biblioteca usada para fazer requisições HTTP

export const api = axios.create({
  baseURL: "http://localhost:3333" // URL do backend
});