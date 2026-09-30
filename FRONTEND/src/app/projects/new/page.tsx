"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function NewProjectPage() {
    const [title, setTitle] = useState("");
    const [size, setSize] = useState("MEDIUM");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // 👈 añadido
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/projects", { 
                title,
                size,
                startDate,
                endDate,
            });

            router.push("/");
            //forzar la recarga de proyectos
            router.refresh(); 
        } catch (err) {
            setError("No se ha podido crear el proyecto")
        } finally {
            setLoading(false);
        }
    }
    
    return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="text-base font-semibold text-ink-soft hover:text-primary transition-colors">
          Volver
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-4xl font-display font-semibold text-ink"> Nuevo proyecto </h1>
          <p className="text-base text-ink-soft mt-2"> Empieza con el progreso </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-card p-8 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink-soft"> Título del proyecto </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-border bg-paper text-ink text-base focus:outline-none focus:ring-2 focus:ring-primary/40"/>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink-soft"> Tamaño </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="px-4 py-3 rounded-xl border border-border bg-paper text-ink text-base focus:outline-none focus:ring-2 focus:ring-primary/40"> 
                <option value="SMALL"> Pequeño </option>
                <option value="MEDIUM"> Mediano </option>
                <option value="LARGE"> Grande </option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink-soft"> Fecha de inicio </label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate (e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl border border-border bg-paper text-ink text-base focus:outline-none focus:ring-2 focus:ring-primary/40"/>
              </div>

              <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink-soft"> Fecha de fin </label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate (e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl border border-border bg-paper text-ink text-base focus:outline-none focus:ring-2 focus:ring-primary/40"/>
              </div>
            </div>

            {error && (
              <p className="text-sm text-primary-dark bg-primary/10 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="mt-2 py-3 rounded-full bg-primary text-paper text-base font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60">
                {loading ? "Creando..." : "Crear proyecto"}
              </button>
          </form>

      </div>
    </div>
    );
  }