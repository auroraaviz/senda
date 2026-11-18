import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ProjectsSummary from "@/components/ProjectsSummary";
import ProjectsList from "@/components/ProjectsList";
import StatCards from "@/components/StatCards";
import UpcomingList from "@/components/UpcomingList";
import { getProjectsServer, getUsernameServer } from "@/lib/server-api";
import { getCalendarEvents, getProjectDeadlines } from "@/lib/calendar";
import { getUpcoming } from "@/lib/upcoming";

export default async function Home() {
  const [projects, username] = await Promise.all([
    getProjectsServer(),
    getUsernameServer(),
  ]);

  const upcoming = getUpcoming(
    getCalendarEvents(projects),
    getProjectDeadlines(projects)
  );

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric", 
    month: "long",
  });

  const all = getUpcoming(
    getCalendarEvents(projects),
    getProjectDeadlines(projects),
    new Date(),
    1000
  );

  const pending = all.filter((u) => u.days >= 0);
  const overdueCount = all.filter((u) => u.days < 0).length;

 return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="" className="h-12 w-12 rounded-xl" />
              <h1 className="font-display text-4xl font-bold text-ink">
                Hola{username ? `, ${username}` : ""}
              </h1>
            </div>
            <p className="mt-2 text-base first-letter:uppercase text-ink-soft">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/calendario"
              className="rounded-full border border-border px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface"
            >
              Calendario
            </Link>
            <Link
              href="/projects/new"
              className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-primary-dark"
            >
              + Nuevo proyecto
            </Link>
            <LogoutButton />
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface/60 py-20 text-center">
            <p className="font-display text-2xl font-semibold text-ink">
              Empieza con tu primer proyecto
            </p>
            <p className="mt-2 text-base text-ink-soft">
              Crea un proyecto para organizar sus fases y seguir su progreso.
            </p>
            <Link
              href="/projects/new"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-primary-dark"
            >
              Crear proyecto
            </Link>
          </div>
        ) : (
          <>
            <StatCards projects={projects} next={pending[0]} />
            <div className="mb-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
                <ProjectsSummary projects={projects} />
                <UpcomingList items={pending.slice(0, 3)} overdue={overdueCount} />
            </div>
            <ProjectsList projects={projects} />
          </>
        )}
      </div>
    </main>
  );
}