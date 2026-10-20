"use client";

import { useEffect, useState } from "react";

export default function Loading() {

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
            <style>{`
            @keyframes senda-hint-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .senda-hint {
                opacity: 0;
                animation: senda-hint-in 0.6s ease 4s forwards;
                }
            `}</style>

                <div className="h-10 w-10 rounded-full border-4 border-secondary/30 border-t-primary animate-spin" />
                <p className="font-display text-xl font-semibold text-ink"> Cargando...</p>
                <p className="senda-hint max-w-sm text-sm text-ink-soft">
                    Estamos despertando el servidor. Al usar un plan gratuito, la primera
                    carga puede tardar hasta un par de minutos.
                </p>

        </main>
    );
    
}