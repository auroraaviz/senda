import type { Project } from "./api";   
import { formatDate } from "@/lib/dates";

export interface CalendarEvent {
    phaseId: number;
    phaseName: string;
    projectId: number;
    projectTitle: string;
    dueDate: string;
    progress: number;
    delayed: boolean;
}

export function toISODate(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

//Aplana las fases de todos los proyectos que tienen fecha límite
//Retrasada = igual que en el backend
export function getCalendarEvents(
    projects: Project[],
    today: Date = new Date()
) : CalendarEvent[] {
    const todayISO = toISODate(today);
    return projects.flatMap((p) =>
    (p.phases ?? [])
        .filter((ph) => ph.dueDate !== null)
        .map((ph)=> ({
        phaseId: ph.id,
        phaseName: ph.name,
        projectId: p.id,
        projectTitle: p.title,
        dueDate: ph.dueDate as string,
        progress: ph.progress,
        delayed: (ph.dueDate as string) < todayISO && ph.progress < 100,
      }))
  );
}

//Cuadrícula de un mes, empezando por el lunes, las celdas vacias son null
export function buildMonthGrid(year: number, month: number): (string | null)[] {
    const offset = (new Date(year, month, 1).getDay() +6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(toISODate(new Date(year, month, d)));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells; 
}

export interface ProjectDeadline {
    projectId:  number;
    projectTitle: string;
    endDate: string;
    progress: number;
    delayed: boolean;
}

//una entrega por proyecto que tenga fecha de fin
//retrasada = fecha vencida y progreso <100
export function getProjectDeadlines(
    projects: Project[],
    today: Date = new Date()
): ProjectDeadline[] {
    const todayISO = toISODate(today);
    return projects
    .filter((p) => p.endDate !== null)
    .map((p) => {
        const end = (p.endDate as string).slice(0, 10);
        return {
            projectId: p.id,
            projectTitle: p.title,
            endDate: end,
            progress: p.progress,
            delayed: end < todayISO && p.progress < 100,
        };
    });
}