"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DeleteProjectButton from "./DeleteProjectButton";
import StatusBadge from "./StatusBadge";

interface Project {
    id: number;
    title: string;
    size: "SMALL" | "MEDIUM" | "LARGE";
    startDate: string | null;
    endDate: string | null;
    progress: number;
    status?: string;
}

const sizeLabels: Record<Project["size"], string> = {
    SMALL: "Pequeño",
    MEDIUM: "Mediano",
    LARGE: "Grande",
};

function formatDate(date: string | null): string {
    if (!date) return "Sin fecha";
    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function barColorFor(status?: string): string {
    if (status === "COMPLETED") return "bg-secondary";
    if (status === "DELAYED") return "bg-oxido";
    return "bg-accent";
}

const inputClass =
    "w-full rounded-xl border border-border bg-paper px-4 py-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary/40";
const labelClass = "text-sm font-semibold text-ink-soft";

export default function EditProjectPanel({ project }: { project: Project }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(project.title);
    const [size, setSize] = useState(project.size);
    const [startDate, setStartDate] = useState(project.startDate ?? "");
    const [endDate, setEndDate] = useState(project.endDate ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [displayedProgress, setDisplayedProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const target = project.progress;
        const duration = 800;
        const start = performance.now();

        function tick(now: number) {
            const elapsed = now - start;
            const ratio = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - ratio, 3);
            setDisplayedProgress(Math.round(eased * target));

            if (ratio < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }, [project.progress]); 

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.put(`/projects/${project.id}`, {
                title,
                size,
                startDate,
                endDate,
            });
            setIsEditing(false);
            router.refresh();
        } catch (err) {
            setError("No se han guardado los cambios");
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        setTitle(project.title);
        setSize(project.size);
        setStartDate(project.startDate ?? "");
        setEndDate(project.endDate ?? "");
        setError("");
        setIsEditing(false);
    }

    if (!isEditing) {
        return (
            <section className="rounded-card bg-surface p-6 shadow-card md:p-10">
                <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                    {/* Izquierda: título y datos */}
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge status={project.status} />
                            <span className="text-sm font-semibold text-ink-soft">
                                Proyecto {sizeLabels[project.size].toLowerCase()}
                            </span>
                        </div>

                        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
                            {project.title}
                        </h1>

                        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
                            <div>
                                <dt className="text-sm text-ink-soft">Inicio</dt>
                                <dd className="text-base font-semibold text-ink">
                                    {formatDate(project.startDate)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-ink-soft">Entrega</dt>
                                <dd className="text-base font-semibold text-ink">
                                    {formatDate(project.endDate)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Derecha: progreso general */}
                    <div className="md:min-w-[260px]">
                        <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                            Progreso general
                        </p>
                        <p className="mt-1 font-mono text-7xl font-medium leading-none text-ink">
                            {displayedProgress}
                            <span className="text-4xl text-ink-soft">%</span>
                        </p>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-border">
                            <div
                                className={`h-full rounded-full ${barColorFor(project.status)}`}
                                style={{ 
                                    width: `${displayedProgress}%`,
                                    transition: "width 800ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-border pt-5">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                    >
                        Editar proyecto
                    </button>
                    <DeleteProjectButton projectId={project.id} redirectTo="/" />
                </div>
            </section>
        );
    }

    return (
        <form
            onSubmit={handleSave}
            className="flex flex-col gap-6 rounded-card bg-surface p-6 shadow-card md:p-10"
        >
            <h2 className="font-display text-2xl font-bold text-ink">Editar proyecto</h2>

            <div className="flex flex-col gap-2">
                <label className={labelClass}>Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={inputClass}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className={labelClass}>Tamaño</label>
                <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as Project["size"])}
                    className={inputClass}
                >
                    <option value="SMALL">Pequeño</option>
                    <option value="MEDIUM">Mediano</option>
                    <option value="LARGE">Grande</option>
                </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className={labelClass}>Fecha de inicio</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className={labelClass}>Fecha de fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            {error && (
                <p className="rounded-xl bg-oxido/10 px-4 py-3 text-sm font-semibold text-oxido">
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-full bg-primary py-3 text-base font-semibold text-paper transition-colors hover:bg-primary-dark disabled:opacity-60"
                >
                    {loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 rounded-full border border-border py-3 text-base font-semibold text-ink transition-colors hover:bg-paper"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}