import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddPhaseForm from "@/components/AddPhaseForm";
import PhaseProgressControl from "@/components/PhaseProgressControl"; 
import DeleteProjectButton from "@/components/DeleteProjectButton";

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

const sizeLabels: Record<Project["size"], string> = {
    SMALL: "Pequeño",
    MEDIUM: "Mediano",
    LARGE: "Grande",
};

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [project, phases] = await Promise.all([getProject(id), getPhases(id)]);
    const sortedPhases = [...phases].sort((a, b) => a.orderNumber - b.orderNumber);

    return (
        <main className="min-h-screen px-6 py-10 md:px-12">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="text-sm text-ink/60 hover:text-primary transition-colors">
                Volver
                </Link>

                <div className="mt-4 mb-8 flex items-start justify-between gap-3">
                    <div>
                    <h1 className="text-2xl font-display font-semibold text-ink">{project.title}</h1>
                    <p className="text-sm text-ink/60 mt-1 font-mono">
                        {sizeLabels[project.size]} · {project.progress}% recorrido
                    </p>
                </div>
                <DeleteProjectButton projectId={project.id} redirectTo="/" />
                </div>

                <h2 className="text-lg font-display font-semibold text-ink mb-4"> Fases del proyecto </h2>
                
                {sortedPhases.length === 0 ? (
                    <p className="text-sm text-ink/50 mb-8"> Este proyecto aún no tiene fases </p>
                ) : ( 
                    <div className="mb-8">
                        {sortedPhases.map((phase, index) => {
                            const done = phase.progress >= 100;
                            const isLast = index === sortedPhases.length - 1;
                            return (
                                <div key={phase.id} className="relative pl-8 pb-6 last:pb-0">
                                    {!isLast && (
                                        <span 
                                        className={`absolute left-[7px] top-4 w-0.5 h-full ${
                                            done ? "bg-primary" : "bg-border"
                                        }`}
                                        />
                                    )}
                                    <span
                                    className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
                                        done
                                        ? "bg-primary border-primary"
                                        : "bg-paper border-secondary"
                                    }`}
                                    />
                                    <div className="bg-white/60 border border-border rounded-xl p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="font-medium text-ink">
                                                {phase.orderNumber}. {phase.name}
                                            </h3>
                                            <span className="text-xs font-mono text-ink/60 whitespace-nowrap">
                                            {phase.progress}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-ink/50 mt-1.5 font-mono">
                                        Peso {phase.weight} · {phase.dueDate ?? "sin fecha límite"}
                                        </p>
                                        <PhaseProgressControl projectId={project.id} phase={phase} />
                                    </div>
                               </div>
                            );
                        })}
                  </div>
                )}
 
                <div className="bg-white/60 border border-border rounded-2xl p-5">
                    <AddPhaseForm projectId={project.id} />
                </div>
            </div>
        </main>
    );
} 