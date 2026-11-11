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