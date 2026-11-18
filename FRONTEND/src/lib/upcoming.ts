import { M } from "vitest/dist/chunks/reporters.d.BuRON0I0.js";
import type { CalendarEvent, ProjectDeadline } from "./calendar";

export interface UpcomingItem {
    key: string;
    kind: "phase" | "project";
    title: string;
    subtitle: string;
    projectId: number;
    dueDate: string;
    days: number; 
}

export function daysUntil(iso: string, today: Date = new Date()): number {
    const [y, m, d] = iso.split("-").map(Number);
    const target = new Date (y, m - 1, d);
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((target.getTime() - start.getTime()) / 86400000);
}

export function formatRelative(days: number): string {
    if (days === 0) return "hoy";
    if (days === 1) return "mañana";
    if (days > 1) return `en ${days} días`;
    if (days === -1) return "hace un día";
    return `hace ${-days} días`;
}

// Entregas pendientes (fases y proyectos sin terminar), de la más urgente a la más lejana.
// Las vencidas salen primero porque son lo más urgente.
export function getUpcoming(
    events: CalendarEvent[],
    deadlines: ProjectDeadline[],
    today: Date = new Date(),
    limit = 4
): UpcomingItem[] {
  const phases: UpcomingItem[] = events
    .filter((e) => e.progress < 100)
    .map((e) => ({
      key: `f-${e.phaseId}`,
      kind: "phase",
      title: e.phaseName,
      subtitle: e.projectTitle,
      projectId: e.projectId,
      dueDate: e.dueDate,
      days: daysUntil(e.dueDate, today),
    }));

    const projects: UpcomingItem[] = deadlines
        .filter((d) => d.progress < 100)
        .map((d) => ({
           key: `p-${d.projectId}`,
           kind: "project",
           title: d.projectTitle,
           subtitle: "Entrega del proyecto",
           projectId: d.projectId,
           dueDate: d.endDate,
           days: daysUntil(d.endDate, today),
    }));

      return [...phases, ...projects]
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, limit);
}