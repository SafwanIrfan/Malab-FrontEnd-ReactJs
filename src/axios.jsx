import axios from "axios";
import { getToken } from "./utils/authToken";

const API = axios.create({
   baseURL: "http://localhost:8080/api",
});

axios.interceptors.request.use((config) => {
   const token = getToken();
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

export default API;
