import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

//Interceptor, si la petición da 401/403 se redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export interface Project {
  id: number;
  title: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  startDate: string | null;
  endDate: string | null;
  progress: number;
  status?: string;
  phases: unknown[];
}

export async function getProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>("/projects");
  return response.data;
}