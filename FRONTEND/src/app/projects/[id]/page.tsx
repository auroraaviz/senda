import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddPhaseForm from "@/components/AddPhaseForm";

interface Project {
    id: number;
    title: string;
    size: "SMALL" | "MEDIUM" | "LARGE";
    startDate: string | null;
    endDate: string | null;
    progress: number;
    status?: string;
} 

interface Phase { 
    id: number;
    name: string;
    orderNumber: number;
    progress: number;
    weight: number;
    dueDate: string | null;
}

async function getProject(id: string): Promise<Project> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const res = await fetch(`http://localhost:8080/projects/${id}`, {
        headers: token ? { Cookie: `token=${token.value}` } : {},
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
        redirect("/login");
    }
    if (!res.ok) {
        throw new Error("Proyecto no encontrado");
    }
    return res.json();
}

async function getPhases(id: string): Promise<Phase[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const res = await fetch(`http://localhost:8080/projects/${id}/phases`, {
        headers: token ? { Cookie: `token=${token.value}` } : {},
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
        redirect("/login");
    }
    if (!res.ok) {
        throw new Error("Error al cargar las fases");
    }
    return res.json();
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [project, phases] = await Promise.all([getProject(id), getPhases(id)]);

    return (
        <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
            <Link href="/" style={{ fontSize: "14px", color: "#666" }}>
            Volver
            </Link>

            <h1 style={{ fontSize: "28px", margin: "16px 0 4px" }}>{project.title}</h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
                Tamaño: {project.size} Progreso: {project.progress}%
            </p>

            <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Fases</h2>

            {phases.length === 0 ? (
                <p style={{ color: "#999" }}> Este proyecto aún no tiene fases.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                    {phases
                    .sort((a,b) => a.orderNumber - b.orderNumber)
                    .map((phase) => (
                        <div
                        key={phase.id}
                        style={{ border: "1px solid #eee", borderRadius: "6px", padding: "12px" }}
                        >
                            <strong>{phase.orderNumber}. {phase.name}</strong>
                            <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>
                                Progreso: {phase.progress}% · Peso: {phase.weight} · Fecha límite: {phase.dueDate ?? "sin definir"}
                            </p>
                </div>
            ))}
        </div>
    )}
    <AddPhaseForm projectId={project.id} />
        </main>
    );
}