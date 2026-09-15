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
            className="text-xs text-ink/40 hover:text-primary-dark transition-colors disabled:opacity-50">
                {loading ? "Eliminando..." : "Eliminar"}
            </button>
    );
} 
