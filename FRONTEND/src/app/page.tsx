import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import StatusBadge from "@/components/StatusBadge";
import DeleteProjectButton from "@/components/DeleteProjectButton"; 
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

  const res = await fetch("http://localhost:8080/projects", {
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

const sizeLabels: Record<Project["size"], string> = {
  SMALL: "Pequeño",
  MEDIUM: "Mediano",
  LARGE: "Grande",
};

function barColorFor(status?: string): string {
  if (status === "COMPLETED") return "bg-secondary";
  if (status === "DELAYED") return "bg-oxido";
  return "bg-accent";
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb.12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-ink md:text-5xl"> Senda </h1>
            <p className="mt-2 text-base text-ink-soft"> Tus proyectos en curso </p>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex flex-col rounded-card bg-surface p-6 shadow-card transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-xl font-semibold text-ink">
                      {project.title}</h2>
                    <span
                      className="whitespace-nowrap text-sm font-semibold text-ink-soft">
                        {sizeLabels[project.size]}
                      </span>
                  </div>

                  <div className="mt-3">
                    <StatusBadge status={project.status} />
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-ink-soft"> Progreso </span>
                      <span className="font-mono text-base font-semibold text-ink">
                        {project.progress}%
                      </span>                   
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-border">
                      <div
                        className={`h-full rounded-full transition-all ${barColorFor(project.status)}`}
                        style={{ width: `${project.progress}%` }}
                        />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end border-t border-border pt-4">
                    <DeleteProjectButton projectId={project.id} />
                  </div>

                </Link>
            ))}
          </div>
        )}
        </div>
    </main>
  );
}