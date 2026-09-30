import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddPhaseForm from "@/components/AddPhaseForm";
import PhaseProgressControl from "@/components/PhaseProgressControl";
import EditProjectPanel from "@/components/EditProjectPanel";
import DeletePhaseButton from "@/components/DeletePhaseButton"; 
import EditPhasePanel from "@/components/EditPhasePanel";


interface Project {
    id: number;
    title: string;
    size: "SMALL" | "MEDIUM" | "LARGE";
    startDate: string | null;
    endDate: string | null;
    progress: number;
    status?: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
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

function formatDate(date: string | null): string {
    if (!date) return "Sin fecha límite";
    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [project, phases] = await Promise.all([getProject(id), getPhases(id)]);
    const sortedPhases = [...phases].sort((a, b) => a.orderNumber - b.orderNumber);
    const today = new Date();
    
    return (
        <main className="min-h-screen px-6 py-10 md:px-12">
            <div className="mx-auto max-w-5xl space-y-10">
                <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-base font-semibold text-ink-soft transition-colors hover:text-primary">
                Volver a mis proyectos
                </Link>

                <EditProjectPanel project={project} />

                <section>
                    <div className="mb-6 flex items-baseline justify-between">
                        <h2 className="font-display text-3xl font-bold text-ink">
                            Fases del proyecto
                        </h2>
                        <span className="font-mono text-base text-ink-soft">
                            {sortedPhases.filter((p) => p.progress >= 100).length} / {sortedPhases.length} completadas
                        </span>
                    </div>

                {sortedPhases.length === 0 ? ( 
                    <div className="rounded-card border border-dashed border-border bg-surface/60 p-10 text-center text-base text-ink-soft">
                        Este proyecto aún no tiene fases. Añade la primera.
                        </div>
                ) : (
                    <div className="space-y-5">
                        {sortedPhases.map((phase) => {
                            const overdue = 
                                phase.progress < 100 &&
                                phase.dueDate !== null &&
                                new Date(`${phase.dueDate.slice(0, 10)}T00:00:00`) < today;

                            return (
                                <article
                                    key={phase.id}
                                    className="rounded-card bg-surface p-6 shadow-card md:p-8">
                                        <div className="flex items-start gap-4">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-base font-semibold text-paper">
                                            {phase.orderNumber}
                                            </span>
                                        <div className="min-w-0 flex-1">
                                            <EditPhasePanel projectId={project.id} phase={phase} />
                                            <p className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
                                                <span>
                                                    Peso{" "}
                                                    <span className="font-mono font-semibold text-ink">
                                                        {phase.weight}
                                                    </span>
                                                </span>
                                                <span>
                                                    Fecha límite{" "}
                                                    <span 
                                                        className={`font-semibold ${
                                                            overdue ? "text-oxido" : "text-ink"
                                                        }`}
                                                        >
                                                            {formatDate(phase.dueDate)}
                                                        </span>
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <PhaseProgressControl projectId={project.id} phase={phase} />
                                    </div>

                                    <div className="mt-4 flex justify-end border-t border-border pt-4">
                                        <DeletePhaseButton projectId={project.id} phaseId={phase.id} />
                                    </div>
                                 </article>
                            );
                        })}
                     </div>
                )}
            </section>

                <section className="rounded-card bg-surface p-6 shadow-card md:p-8">
                <AddPhaseForm projectId={project.id} />
                </section>
            </div>
        </main>
    );
}

    