"use client"
 
import { useState } from "react";
import Link from "next/link";
import {
  buildMonthGrid,
  toISODate,
  type CalendarEvent,
  type ProjectDeadline,
} from "@/lib/calendar";

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function chipColor(e: CalendarEvent) {
    if (e.delayed) return "bg-[#B8562E] text-white";
    if (e.progress === 100) return "bg-secondary text-ink";
    return "bg-accent text-ink";
}

function deadLineStyle(d: ProjectDeadline) {
  if (d.delayed) return "border-oxido text-oxido";
  if (d.progress === 100) return "border-secondary text-ink";
  return "border-primary text-primary";
}

export default function CalendarView({ 
  events, 
  deadlines, 
}: { 
  events: CalendarEvent[];
  deadlines: ProjectDeadline[];
}) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const todayISO = toISODate(now);

    function shift(delta: number) {
        const d = new Date(year, month + delta, 1);
        setYear(d.getFullYear());
        setMonth(d.getMonth());
    }

    //Agrupa los eventos por fecha para buscarlos rápido al pintar cada celda
    const byDate = new Map<string, CalendarEvent[]>();
    for (const e of events) {
        byDate.set(e.dueDate, [...(byDate.get(e.dueDate) ?? []), e]);
    }

    const deadLinesByDate = new Map<string, ProjectDeadline[]>();
    for (const d of deadlines) {
      deadLinesByDate.set(d.endDate, [...(deadLinesByDate.get(d.endDate) ?? []), d]);
    }

    const cells = buildMonthGrid(year, month);

    return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => shift(-1)}
            className="rounded-full border border-border px-4 py-2 text-ink hover:bg-surface"
            aria-label="Mes anterior"
          >
            ←
          </button>
          <button
            onClick={() => {
              setYear(now.getFullYear());
              setMonth(now.getMonth());
            }}
            className="rounded-full border border-border px-4 py-2 text-ink hover:bg-surface"
          >
            Hoy
          </button>
          <button
            onClick={() => shift(1)}
            className="rounded-full border border-border px-4 py-2 text-ink hover:bg-surface"
            aria-label="Mes siguiente"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-7 gap-px overflow-hidden rounded-card border border-border bg-border">
          {WEEKDAYS.map((d) => (
            <div key={d} className="bg-surface px-2 py-2 text-center text-sm font-semibold text-ink-soft">
              {d}
            </div>
          ))}

          {cells.map((iso, i) => (
            <div
              key={i}
              className={`min-h-24 p-1.5 ${iso ? "bg-white" : "bg-surface/60"}`}
            >
              {iso && (
                <>
                  <span
                    className={`inline-block rounded-full px-2 text-sm ${
                      iso === todayISO ? "bg-primary font-bold text-paper" : "text-ink-soft"
                    }`}
                  >
                    {Number(iso.slice(8))}
                  </span>
                  <div className="mt-1 space-y-1">
                    {(deadLinesByDate.get(iso) ?? []).map((d) => (
                      <Link
                        key={`p-${d.projectId}`}
                        href={`/projects/${d.projectId}`}
                        title={`Entrega: ${d.projectTitle}`}
                        className={`block truncate rounded-md border-2 bg-white px-1.5 py-0.5 text-xs font-bold ${deadLineStyle(d)}`}
                      >
                       ⚑ {d.projectTitle}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-soft">
        <span><span className="mr-1 inline-block h-3 w-3 rounded bg-accent align-middle" />Pendiente</span>
        <span><span className="mr-1 inline-block h-3 w-3 rounded bg-[#B8562E] align-middle" />Retrasada</span>
        <span><span className="mr-1 inline-block h-3 w-3 rounded bg-secondary align-middle" />Completada</span>
        <span><span className="mr-1 inline-block h-3 w-3 rounded border-2 border-primary bg-white align-middle" />⚑ Entrega del proyecto</span>
      </div>
    </div>
  );
}