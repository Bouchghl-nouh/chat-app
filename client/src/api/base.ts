import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { store } from "../store/index";
import { refreshTokenOnce } from "./refreshToken.api";
import { setAccessToken, clearCredentials } from "../store/slices/userSlice";

export const api = axios.create({
  baseURL: import.meta.env.SERVER_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}
api.interceptors.request.use((config) => {
  const user = store.getState().user;
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const data = await refreshTokenOnce();
          store.dispatch(setAccessToken(data.accessToken));
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (err) {
          try {
            await api.post("/auth/logout");
          } catch (logoutErr) {
            console.error("Logout failed:", logoutErr);
          }
          
          // Clear credentials from Redux store
          store.dispatch(clearCredentials());
          toast.error("Session expired. Please login again.");
          
          // Redirect to login page
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  },
);

async function request<T>(
  fn: () => Promise<{ data: ApiResponse<T> }>,
  showToast = true
): Promise<T> {
  try {
    const res = await fn();
    if (!res.data.success) {
      showToast && toast.error(res.data.message || "server error");
      throw new Error(res.data.message || "server error");
    }
    showToast && toast.success(res.data.message || "success");
    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      showToast && toast.error(error?.response?.data?.message || "server error");
      throw new Error(error?.response?.data?.message || "server error");
    }
    showToast && toast.error("network error");
    throw new Error("network error");
  }
}

const get = <T>(url: string, params?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
  request(() => api.get<ApiResponse<T>>(url, { ...(config ?? {}), params }), showToast);

const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
  request(() => api.post<ApiResponse<T>>(url, data, config), showToast);

const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
  request(() => api.put<ApiResponse<T>>(url, data, config), showToast);
const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
  request(() => api.patch<ApiResponse<T>>(url, data, config), showToast);
const del = <T>(url: string, data?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
  request(() => api.delete<ApiResponse<T>>(url, { ...(config ?? {}), data }), showToast);

export const http = { get, post, put, del,patch };
