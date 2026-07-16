import { getProjects } from "@/lib/api";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "24px" }}>Senda</h1>
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