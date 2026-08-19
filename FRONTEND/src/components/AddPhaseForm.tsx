"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AddPhaseForm({ projectId}: { projectId: number }) {
    const [name, setName] = useState("");
    const [orderNumber, setOrderNumber] = useState(1);
    const [weight, setWeight] = useState(1);
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        await api.post(`/projects/${projectId}/phases`, {
            name,
            orderNumber,
            progress: 0,
            weight,
            dueDate: dueDate || null,
        });
        setName("");
        router.refresh();
    } catch (err) {
        setError("No se ha creado la fase correctamente.")
    } finally {
        setLoading(false);
    }
}

return (
    <form
    onSubmit={handleSubmit}
    style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "320px" }}
    >
        <h3 style={{ fontSize: "16px", margin: "0 0 4px" }}> Nueva fase </h3>
        <input
            type="text"
            placeholder="Nombre de la fase"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px", fontSize: "14px" }}
            />
        <input
            type="number"
            placeholder="Orden"
            value={orderNumber}
            onChange={(e) => setOrderNumber(Number(e.target.value))}
            min={1}
            style={{ padding: "8px", fontSize: "14px" }}
            />
        <input
            type="number"
            placeholder="Peso"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            min={1}
            style={{ padding: "8px", fontSize: "14px" }}
            />
        <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: "8px", fontSize: "14px" }}
            />

            {error && <p style={{ color: "red", fontSize: "13px"}}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: "8px", fontSize: "14px", cursor: "pointer" }}>
                {loading ? "Añadiendo..." : "Añadir fase"}
            </button>
            </form>
);
}