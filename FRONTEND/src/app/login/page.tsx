"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      // El token ya viaja en una cookie httpOnly, no hace falta leerlo aquí
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "360px", margin: "80px auto", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "24px" }}>Iniciar sesión</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "14px" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "14px" }}
        />

        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", fontSize: "14px", cursor: "pointer" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p style={{ marginTop: "16px", fontSize: "13px" }}>
        ¿No tienes cuenta? <Link href="/register">Regístrate</Link>
      </p>
    </div>
  );
}