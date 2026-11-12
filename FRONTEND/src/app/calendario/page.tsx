import Link from "next/link";
import { getProjectsServer } from "@/lib/server-api";
import { getCalendarEvents, getProjectDeadlines } from "@/lib/calendar";
import CalendarView from "@/components/CalendarView";

export default async function CalendarPage() {
    const projects = await getProjectsServer();
    const events = getCalendarEvents(projects);
    const deadlines = getProjectDeadlines(projects);

    return (
        <main className="min-h-screen px-6 py-10 md:px-12">
            <div className="mx-auto max-w-6xl">
                <Link href="/" className="text-sm text-ink-soft hover:text-primary">← Volver a proyectos</Link>
                <h1 className="mb-8 mt-2 font-display text-4xl font-bold text-ink">Calendario</h1>
                <CalendarView events={events} deadlines={deadlines} />
            </div>
        </main>
    );
}