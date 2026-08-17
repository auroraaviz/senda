import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  startDate: string | null;
  endDate: string | null;
  progress: number;
  status?: string;
  phases: unknown[];
}

async function getProjects(): Promise<Project[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const res = await fetch("http://localhost:8080/projects", {
    headers: token ? { Cookie: `token=${token.value}` } : {},
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    redirect("/login");
  }

  if (!res.ok) {
    throw new Error("Error al cargar los proyectos");
  }

  return res.json();
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "28px", margin: 0 }}>Senda</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link
            href="/projects/new"
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              textDecoration: "none",
              color: "black",
            }}
          >
            + Nuevo proyecto
          </Link>
          <LogoutButton />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>{project.title}</h2>
            <p style={{ margin: "4px 0", color: "#666" }}>
              Tamaño: {project.size} · Progreso: {project.progress}%
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}