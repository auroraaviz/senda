import { formatRelative, type UpcomingItem } from "@/lib/upcoming";

interface Props {
    projects: { progress: number; status?: string }[];
    next: UpcomingItem | undefined;
}

export default function StatCards({ projects, next }: Props) {
    const total = projects.length;
    const average = total
        ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / total)
        : 0;
    const delayed = projects.filter((p) => p.status === "DELAYED").length;

    const cards = [
        { label: "Proyectos", value: String(total), unit: "", tone: "text-ink" },
        { label: "Progreso medio", value: String(average), unit: "%", tone: "text-ink" },
        { 
            label: "Retrasados",
            value: String(delayed),
            unit: "",
            tone: delayed > 0 ? "text-oxido" : "text-ink",
        },
    ];

     return (
    <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-card bg-surface p-5 shadow-card">
          <p className="text-sm font-semibold text-ink-soft">{c.label}</p>
          <p className={`mt-2 font-mono text-5xl font-medium leading-none ${c.tone}`}>
            {c.value}
            <span className="text-2xl text-ink-soft">{c.unit}</span>
          </p>
        </div>
      ))}

      <div className="rounded-card bg-surface p-5 shadow-card">
        <p className="text-sm font-semibold text-ink-soft">Próxima entrega</p>
        {next ? (
          <>
            <p
              className={`mt-2 font-display text-2xl font-bold leading-tight ${
                next.days < 0 ? "text-oxido" : "text-ink"
              }`}
            >
              {formatRelative(next.days)}
            </p>
            <p className="mt-1 truncate text-sm text-ink-soft">{next.title}</p>
          </>
        ) : (
          <p className="mt-2 text-base text-ink-soft">Nada pendiente</p>
        )}
      </div>
    </section>
  );
}