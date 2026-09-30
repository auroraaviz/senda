"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function DeletePhaseButton({
    projectId,
    phaseId,
}: {
    projectId: number;
    phaseId: number;
}) {
    const [loading, setLoading] = useState (false);
    const router = useRouter();

    async function handleDelete() {
        const confirmed = window.confirm("¿Seguro que quieres eliminar esta fase?");
        if (!confirmed) return;

        setLoading(true);
        try {
            await api.delete(`/projects/${projectId}/phases/${phaseId}`);
            router.refresh();
        } catch (err) {
            alert("No se ha podido eliminar la fase");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={loading}
            className="text-sm font-semibold text-oxido/70 hover:text-oxido transition-colors disabled:opacity-50">
                {loading ? "Eliminando..." : "Eliminar"}
            </button>
    );
}