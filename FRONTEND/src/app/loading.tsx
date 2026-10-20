"use client";

import { useEffect, useState } from "react";

export default function Loading() {
    const [slow, setSlow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setSlow(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
            <div className="h-10 w-10 rounded-full border-4 border-secondary/30 border-t-primary animate-spin" />
            <p className="font-display text-xl font-semibold text-ink"> Cargando... </p>
            {slow && ( 
                <p className="max-w-sm text-sm text-ink-soft">
                     Estamos despertando el servidor. Al usar un plan gratuito, la primera
                     carga puede tardar hasta un par de minutos.
                </p>
            )}
        </main>
    );
    
}