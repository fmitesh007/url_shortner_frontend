import axios from "axios";

const API_BASE = import.meta.env.API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateUrlData {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface ShortUrl {
  _id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  expiresAt?: string;
  createdAt: string;
  user: string;
}

export interface AnalyticsData {
  totalClicks: number;
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
}

export const authApi = {
  register: (data: RegisterData) => api.post("/api/auth/register", data),
  login: (data: LoginData) => api.post("/api/auth/login", data),
};

export const urlApi = {
  getAll: () => api.get<ShortUrl[]>("/api/url"),
  create: (data: CreateUrlData) => api.post("/api/url", data),
  delete: (shortCode: string) => api.delete(`/api/url/${shortCode}`),
  analytics: (shortCode: string) =>
    api.get<AnalyticsData>(`/api/url/${shortCode}/analytics`),
};

export default api;
