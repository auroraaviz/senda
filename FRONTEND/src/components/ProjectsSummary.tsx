"use client";

import { useEffect, useState } from "react"; 

interface Props {
    projects: { progress: number; status?: string }[];
}

const STATES = [
     { key: "IN_PROGRESS", label: "En curso", dot: "bg-accent", stroke: "stroke-accent" },
     { key: "COMPLETED", label: "Completados", dot: "bg-secondary", stroke: "stroke-secondary" },
     { key: "DELAYED", label: "Retrasados", dot: "bg-oxido", stroke: "stroke-oxido" },
     { key: "PLANNED", label: "Planificados", dot: "bg-ink-soft", stroke: "stroke-ink-soft" },
];

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProjectsSummary({ projects }: Props) {
    const total = projects.length;
    const [k, setK] = useState(0);

    useEffect(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setK(1);
        return;
      }

      const duration = 900;
      const start = performance.now();
      let frame = 0;

      function tick(now: number) {
        const ratio = Math.min((now - start) / duration, 1);
        setK(1 - Math.pow(1 - ratio, 3));
        if (ratio < 1) frame = requestAnimationFrame(tick);
      }

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);

    }, []);
    
    if (total === 0) return null;

    const average = Math.round(
        projects.reduce((sum, p) => sum + p.progress, 0) / total
    );

    const counts = STATES.map((state) => ({
        ...state,
        count: projects.filter((p) => p.status === state.key).length,
    }));

    //proyectos con un estado que no está en la lista
    const others = total - counts.reduce((sum, c) => sum + c.count, 0);
    const entries = 
        others > 0
        ? [
            ...counts,
            {
                key: "OTHER",
                label: "Otros",
                dot: "bg-primary",
                stroke: "stroke-primary",
                count: others,
            },
        ]
        : counts;

    let offset = 0;

    const segments = entries.map((entry) => {
        const length = (entry.count / total) * CIRCUMFERENCE * k;
        const segment = { ...entry, length, offset };
        offset += length;
        return segment;
    });

    const description = entries 
        .filter((e) => e.count > 0)
        .map((e) => `${e.count} ${e.label.toLowerCase()}`)
        .join(", ");

    return (
    <section className="mb-10 grid gap-8 rounded-card bg-surface p-6 shadow-card md:grid-cols-[auto_1fr] md:items-center md:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Progreso medio
        </p>
        <p className="mt-1 font-mono text-6xl font-medium leading-none text-ink">
          {Math.round(average * k)}
          <span className="text-3xl text-ink-soft">%</span>
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          en {total} {total === 1 ? "proyecto" : "proyectos"}
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
        <svg
          viewBox="0 0 100 100"
          className="h-28 w-28 shrink-0"
          role="img"
          aria-label={`Proyectos por estado: ${description}`}
        >
          <g transform="rotate(-90 50 50)">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              className="stroke-border"
              strokeWidth="10"
            />
            {segments.map((segment) => (
              <circle
                key={segment.key}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                className={segment.stroke}
                strokeWidth="10"
                strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                strokeDashoffset={-segment.offset}
              />
            ))}
          </g>

          <text
            x="50"
            y="46"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink font-mono"
            fontSize="19"
            fontWeight="500"
          >
            {total}
          </text>
          <text
            x="50"
            y="62"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink-soft"
            fontSize="9"
          >
            {total === 1 ? "proyecto" : "proyectos"}
          </text>
        </svg>

        <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-5">
          {entries.map(({ key, label, dot, count }) => (
            <div key={key}>
              <dt className="flex items-center gap-2 text-sm text-ink-soft">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {label}
              </dt>
              <dd className="font-mono text-3xl font-medium text-ink">{count}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}