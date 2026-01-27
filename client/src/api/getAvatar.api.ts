import axios from "axios";
import { store } from "../store/index";

export const api = axios.create({
  baseURL:"http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAvatar = async(key:string):Promise<{downloadUrl:string}>=>{
    const {data} = await api.get("/download-url",{params:{key}});
    return data;
}
