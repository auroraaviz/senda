"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "24px" }}>Nuevo proyecto</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="Título del proyecto"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "14px" }}
        />

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={{ padding: "10px", fontSize: "14px" }}
        >
          <option value="SMALL">Pequeño</option>
          <option value="MEDIUM">Mediano</option>
          <option value="LARGE">Grande</option>
        </select>

        <label style={{ fontSize: "13px", color: "#666" }}>
          Fecha de inicio
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "14px", width: "100%", marginTop: "4px" }}
          />
        </label>

        <label style={{ fontSize: "13px", color: "#666" }}>
          Fecha de fin
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "14px", width: "100%", marginTop: "4px" }}
          />
        </label>

        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", fontSize: "14px", cursor: "pointer" }}
        >
          {loading ? "Creando..." : "Crear proyecto"}
        </button>
      </form>
    </div>
  );
}