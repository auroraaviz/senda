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
            aria-label="Eliminar proyecto"
            className="rounded-full p-2 text-ink-soft opacity-60 transition hover:bg-oxido/10 hover:text-oxido hover:opacity-100 focus-visible:opacity-100 disabled:opacity-40">
                {loading ? (
                    <span className="text-xs font-semibold"> ... </span>
                ) : (
                    <svg viewBox="0 0 24 24" className="h-5  w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M6 6l1 14h10l1-14" />
                        <path d="M10 11v5M14 11v5" />
                    </svg>
                )}
            </button>
    );
} 