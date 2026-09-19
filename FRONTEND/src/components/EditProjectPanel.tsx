"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DeleteProjectButton from "./DeleteProjectButton";

interface Project {
    id: number;
    title:  string;
    size: "SMALL" | "MEDIUM" | "LARGE";
    startDate: string | null;
    endDate: string | null;
    progress: number;
}

const sizeLabels: Record<Project["size"], string> = {
    SMALL: "Pequeño",
    MEDIUM: "Mediano",
    LARGE: "Grande",
};

export default function EditProjectPanel({ project}: { project: Project }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(project.title);
    const [size, setSize] = useState(project.size);
    const [startDate, setStartDate] = useState(project.startDate ?? "");
    const [endDate, setEndDate] = useState(project.endDate ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

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
            setError ("No se han guardado los cambios");
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
            <div className="mt-4 mb-8 flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-display font-semibold text-ink">{project.title}</h1>
                    <p className="text-sm text-ink/60 mt-1 font-mono">
                        {sizeLabels[project.size]} · {project.progress}% recorrido 
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-ink/40 hover:text-primary transition-colors">
                        Editar
                    </button>
                    <DeleteProjectButton projectId={project.id} redirectTo="/" />
                </div>
            </div>
        );
    }

    return (
        <form
        onSubmit={handleSave}
        className="mt-4 mb-8 bg-white/60 border border-border rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink/70">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="px-3 py-2.5 rounded-lg border border-border bg-paper text-ink text-sm focus: outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-ink/70">Tamaño</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value as Project["size"])}
                        className="px-3 py-2.5 rounded-lg border border-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                            <option value="SMALL">Pequeño</option>
                            <option value="MEDIUM">Mediano</option>
                            <option value="LARGE">Grande</option>
                        </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-ink/70">Fecha de inicio</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="px-3 py-2.5 rounded-lg border border-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"/>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-ink/70">Fecha de fin</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="px-3 py-2.5 rounded-lg border border-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"/>
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-primary-dark bg-primary/10 rounded-lg px-3 py-2">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-lg bg-primary text-paper text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                                    {loading ? "Guardando..." : "Guardar"}
                                    </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-lg border border-border text-ink text-sm font-medium hover:bg-white transition-colors">
                                    Cancelar
                                </button>
                        </div>
                            </form>
    );
}