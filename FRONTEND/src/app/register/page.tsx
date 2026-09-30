"use client";

import {useState} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
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
            const res = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            throw new Error("No se ha podido crear el usuario");
        }

        //registro correcto se redirige al login
        router.push("/login");
    } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
        setLoading(false);
    }
        }

        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="w-2 h-2 rounded-full bg-primary-dark" />
                            <span className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <h1 className="text-4xl font-display font-semibold text-ink"> Crear cuenta </h1>
                        <p className="text-base text-ink-soft mt-2"> Sigue el progreso de tu proyecto </p>
                    </div>

                    <form 
                        onSubmit={handleSubmit}
                        className="bg-surface border border-border rounded-card p-8 flex flex-col gap-5"
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-ink-soft"> Usuario </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="px-4 py-3 rounded-xl border border-border bg-paper text-ink text-base focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-ink-soft"> Contraseña </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="px-4 py-3 rounded-xl border border-border bg-paper text-ink text-base focus:outline-none focus:ring-2 focus:ring-primary/40" />
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
                                    {loading ? "Creando..." : "Registrarse"}
                                </button>
                        </form>

                        <p className="mt-6 text-center text-base text-ink-soft">
                            ¿Ya tienes cuenta? {" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Iniciar sesión
                        </Link>
                        </p>
                </div>
            </div>
        );
    }

