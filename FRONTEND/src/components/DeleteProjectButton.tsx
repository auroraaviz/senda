"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function DeleteProjectButton({ 
    projectId,
    redirectTo,
    }: { 
        projectId: number;
        redirectTo?: string;
     }) { 
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = window.confirm("¿Seguro que quieres eliminar este proyecto?");
        if (!confirmed) return;

        setLoading(true);
        try {
            await api.delete(`/projects/${projectId}`);
            if(redirectTo) {
                router.push(redirectTo);
            } else {
            router.refresh();
            }
        } catch (err) {
            alert("No se ha podido eliminar el proyecto");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={loading}
            className="rounded-full border border-oxido/30 px-5 py-2 text-sm font-semibold text-oxido transition-colors hover:bg-oxido/10 disabled:opacity-50">
                {loading ? "Eliminando..." : "Eliminar"}
            </button>
    );
} 