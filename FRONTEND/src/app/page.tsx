import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import ProjectsSummary from "@/components/ProjectsSummary";
import ProjectsList from "@/components/ProjectsList";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  startDate: string | null;
  endDate: string | null;
  progress: number;
  status?: string;
  phases: unknown[];
}

async function getProjects(): Promise<Project[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const res = await fetch(`${process.env.BACKEND_URL}/projects`, {
    headers: token ? { Cookie: `token=${token.value}` } : {},
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

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div>
          <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="" className="h-12 w-12 rounded-xl" />
              <h1 className="font-display text-4xl font-bold text-ink">Senda</h1>
            </div>
              <p className="mt-2 text-base text-ink-soft">Tus proyectos en curso</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/projects/new"
              className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-primary-dark">
                + Nuevo proyecto
              </Link>
              <LogoutButton />
          </div>
        </div>

        <ProjectsSummary projects={projects} />

        {projects.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface/60 py-20 text-center">
            <p className="font-display text-2xl font-semibold text-ink"> Empieza con tu primer proyecto </p>
            <p className="mt-2 text-base text-ink-soft">
              Crea un proyecto para organizar sus fases y seguir su progreso.
            </p>
            <Link 
              href="/projects/new"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-base font-semibold text-paper transition-color hover:bg-primary-dark">
                Crear proyecto
              </Link>
        </div>  
        ) : (
          <ProjectsList projects={projects} />
        )}
        </div>
    </main>
  );
}