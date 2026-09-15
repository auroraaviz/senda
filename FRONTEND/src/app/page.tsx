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

const sizeStyles: Record<Project["size"], string> = {
  SMALL: "bg-secondary/20 text-primary-dark",
  MEDIUM: "bg-primary/15 text-primary-dark",
  LARGE: "bg-primary-dark/15 text-primary-dark",
};

const sizeLabels: Record<Project["size"], string> = {
  SMALL: "Pequeño",
  MEDIUM: "Mediano",
  LARGE: "Grande",
};

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-display font-semibold text-ink"> Senda </h1>
            <p className="text-sm text-ink/60 mt-0.5"> Tus proyectos en curso </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/projects/new"
              className="px-4 py-2 rounded-lg bg-primary text-paper text-sm font-medium hover:bg-primary-dark transition-colors">
                + Nuevo proyecto
              </Link>
              <LogoutButton />
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2x1">
            <p className="text-ink font-medium"> Empieza con tu primer proyecto </p>
            <p className="text-sm text-ink/60 mt-1">
              Crea un proyecto para organizar sus fases y seguir su progreso.
            </p>
            <Link 
              href="/projects/new"
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-primary text-paper text-sm font-medium hover:bg-primary-dark transition-colors">
                Crear proyecto
              </Link>
        </div>  
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block bg-white/60 border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-medium text-ink">{project.title}</h2>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${sizeStyles[project.size]} `}>
                        {sizeLabels[project.size]}
                      </span>
                  </div>

                  <div className="mt-2">
                    <StatusBadge status={project.status} />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-ink/50 font-mono"> Progreso </span>
                      <span className="text-xs text-ink/70 font-mono font-medium">
                        {project.progress}%
                      </span>                   
                    </div>
                    <div className="relative h-1.5 rounded-full bg-border">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-secondary"
                        style={{ width: `${project.progress}%` }}
                        />
                      <div
                        className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-paper -translate-y-1/2"
                        style={{ left: `calc(${project.progress}% - 5px)` }}
                        />
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
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