"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import { formatDate } from "@/lib/dates";
import { daysUntil, formatRelative } from "@/lib/upcoming";

interface Project {
  id: number;
  title: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  startDate: string | null;
  endDate: string | null;
  progress: number;
  status?: string;
}

const sizeLabels: Record<Project["size"], string> = {
  SMALL: "Pequeño",
  MEDIUM: "Mediano",
  LARGE: "Grande",
};

const FILTERS = [
  { key: "ALL", label: "Todos" },
  { key: "IN_PROGRESS", label: "En curso" },
  { key: "COMPLETED", label: "Completados" },
  { key: "DELAYED", label: "Retrasados" },
  { key: "PLANNED", label: "Planificados" },
];

type SortKey = "default" | "progress" | "endDate" | "title";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Orden por defecto" },
  { key: "progress", label: "Mayor progreso" },
  { key: "endDate", label: "Entrega más próxima" },
  { key: "title", label: "Título (A-Z)" },
];

function barColorFor(status?: string): string {
  if (status === "COMPLETED") return "bg-secondary";
  if (status === "DELAYED") return "bg-oxido";
  return "bg-accent";
}

function dueInfo(p: Project): { text: string; late: boolean } | null {
  if (!p.endDate || p.progress >= 100) return null;
  const days = daysUntil(p.endDate.slice(0, 10));
  return { text: formatRelative(days), late: days < 0};
}

function sortProjects(list: Project[], sort: SortKey): Project[] {
  const copy = [...list];

  switch (sort) {
    case "progress":
      return copy.sort((a, b) => b.progress - a.progress);
    case "endDate":
      return copy.sort((a, b) => {
        // los proyectos sin fecha de entrega van al final
        if (!a.endDate && !b.endDate) return 0;
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return a.endDate.localeCompare(b.endDate);
      });
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title, "es"));
    default:
      return copy;
  }
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState<SortKey>("default");

  function countFor(key: string): number {
    if (key === "ALL") return projects.length;
    return projects.filter((p) => p.status === key).length;
  }

  const filtered =
    filter === "ALL" ? projects : projects.filter((p) => p.status === filter);
  const visible = sortProjects(filtered, sort);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary text-paper"
                    : "border border-border bg-surface text-ink-soft hover:border-primary hover:text-primary"
                }`}
              >
                {label}{" "}
                <span className="font-mono">{countFor(key)}</span>
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          Ordenar
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {SORTS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface/60 py-16 text-center text-base text-ink-soft">
          No hay proyectos con este estado.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => {
  const due = dueInfo(project);
  return (
    <Link
      key={project.id}
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-card bg-surface p-6 shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-2xl font-bold leading-tight text-ink">
          {project.title}
        </h2>
        <DeleteProjectButton projectId={project.id} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
        <span className="text-sm font-semibold text-ink-soft">
          {sizeLabels[project.size]}
        </span>
      </div>

      <div className="mt-6">
        <p className="font-mono text-5xl font-medium leading-none text-ink">
          {project.progress}
          <span className="text-2xl text-ink-soft">%</span>
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all ${barColorFor(project.status)}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-ink-soft">
          Entrega{" "}
          <span className="font-semibold text-ink">{formatDate(project.endDate)}</span>
        </span>
        {due && (
          <span className={`font-semibold ${due.late ? "text-oxido" : "text-ink-soft"}`}>
            {due.text}
          </span>
        )}
      </div>
    </Link>
  );
})}
        </div>
      )}
    </div>
  );
}