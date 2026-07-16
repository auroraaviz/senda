import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

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