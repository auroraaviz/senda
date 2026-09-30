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

function barColorFor(progress: number, dueDate: string | null): string {
    if (progress >= 100) return "bg-secondary";
    if (dueDate && new Date(dueDate) < new Date()) return "bg-oxido";
    return "bg-accent";
}

export default function PhaseProgressControl ({
    projectId,
    phase,
}: {
    projectId: number;
    phase: Phase;
}) {
    const [progress, setProgress] = useState(phase.progress);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    async function handleSave() {
        setSaving(true);
        try {
            await api.put(`/projects/${projectId}/phases/${phase.id}`, {
                name: phase.name,
                orderNumber: phase.orderNumber,
                progress,
                weight: phase.weight,
                dueDate: phase.dueDate
            });
            router.refresh();
        } catch (err) {
        } finally {
            setSaving(false);
        }
    }

    const color = barColorFor(progress, phase.dueDate);

    return (
        <div className="mt-3">
            <div className="flex items-center gap-4">
                <div className="relative h-8 flex-1">
                    {/*Pista y relleno*/}
                    <div className="absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full bg-border">
                    <div
                        className={`h-full rounded-full transition-all duration-200 ${color}`}
                        style={{ width: `${progress}%` }} />
                    </div>

                    {/*Slider invisible para arrastrar*/}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        aria-label={`Progreso de ${phase.name}`}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                </div>

                    <span className="w-14 text-right font-mono text-lg font-semibold text-ink">
                        {progress}%
                    </span>
            </div>

            {progress !== phase.progress && (
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-primary-dark disabled:opacity-60">
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
            )}
        </div>
    );
}