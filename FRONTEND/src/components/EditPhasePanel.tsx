"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Phase {
    id: number;
    name: string;
    orderNumber: number;
    progress: number;
    weight: number;
    dueDate: string | null;
}

export default function EditPhasePanel({
    projectId,
    phase,
}: {
    projectId: number;
    phase: Phase;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(phase.name);
    const [weight, setWeight] = useState(phase.weight);
    const [dueDate, setDueDate] = useState(phase.dueDate ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.put(`/projects/${projectId}/phases/${phase.id}`, {
                name,
                orderNumber: phase.orderNumber,
                progress: phase.progress,
                weight,
                dueDate,
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
        setName(phase.name);
        setWeight(phase.weight);
        setDueDate(phase.dueDate ?? "");
        setError("");
        setIsEditing(false);
    }

    if (!isEditing) {
        return (
            <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-ink">
                    {phase.orderNumber}. {phase.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ink/60 whitespace-nowrap">
                    {phase.progress}%
                    </span>
                    <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-ink/40 hover:text-primary transition-colors">
                        Editar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink/70">Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="px-3 py-2 rounded-lg border border-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-ink/70">Peso</label>
                    <input
                        type="number"
                        min={1}
                        max={100}
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        required
                        className="px-3 py-2 rounded-lg border border-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"/>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-ink/70">Fecha límite</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"/>
                </div>
            </div>

            {error && (
                <p className="text-xs text-primary-dark bg-primary/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 rounded-lg bg-primary text-paper text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 py-2 rounded-lg border border-border text-ink text-sm font-medium hover:bg-white transition-colors">
                            Cancelar
                        </button>
            </div>
        </form>
    );
}