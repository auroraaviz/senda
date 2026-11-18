import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Project } from "./api";

export async function getProjectsServer(): Promise<Project[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const res = await fetch(`${process.env.BACKEND_URL}/projects`, {
        headers: token ? { Cookie: `token=${token.value}`} : {},
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
        redirect("/login");
    }

    if (!res.ok) {
        throw new Error("Error al cargar los proyectos");
    }
     
    return res.json();
}

//solo para mostrar el nombre
export async function getUsernameServer(): Promise<string | null> {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;
    try {
        const payload = token.split(".")[1];
        const json = Buffer.from(payload, "base64url").toString("utf-8");
        return JSON.parse(json).sub ?? null;
    } catch {
        return null;
    }
}