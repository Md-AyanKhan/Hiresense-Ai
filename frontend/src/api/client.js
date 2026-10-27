import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 60000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthenticationRequest = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/signup");
    if (error.response?.status === 401 && !isAuthenticationRequest) {
      window.dispatchEvent(new Event("hiresense:unauthorized"));
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hiresense_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me")
};

export const resumeApi = {
  parse: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/resume/parse", formData, { headers: { "Content-Type": "multipart/form-data" } });
  }
};

export const analysisApi = {
  analyze: (file, jobDescription) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);
    return api.post("/analysis/analyze", formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
  match: (payload) => api.post("/analysis/match", payload),
  history: () => api.get("/analysis/history"),
  historyItem: (id) => api.get(`/analysis/history/${id}`)
};

export const interviewApi = {
  generate: (payload) => api.post("/interview/generate", payload)
};

export const chatbotApi = {
  message: (payload) => api.post("/chatbot/message", payload)
};

export const adminApi = {
  stats: () => api.get("/admin/stats"),
  users: () => api.get("/admin/users")
};
