import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { formatRelative, type UpcomingItem } from "@/lib/upcoming";

export default function UpcomingList({ 
  items,
  overdue = 0,
 }: { 
  items: UpcomingItem[];
  overdue?: number;
}) {
    return (
    <section className="h-full rounded-card bg-surface p-6 shadow-card md:p-8">
      <h2 className="font-display text-xl font-bold text-ink">Próximas entregas</h2>

      {overdue > 0 && (
        <p className="mt-2 text-sm font-semibold text-oxido">
          {overdue} {overdue === 1 ? "entrega vencida" : "entregas vencidas"} sin terminar
        </p>
      )}
      {items.length === 0 ? (
        <p className="mt-4 text-base text-ink-soft">
          No tienes nada pendiente. Buen momento para planificar.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const late = item.days < 0;
            return (
              <li key={item.key}>
                <Link
                  href={`/projects/${item.projectId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-ink">
                      {item.kind === "project" ? "⚑ " : ""}
                      {item.title}
                    </p>
                    <p className="truncate text-sm text-ink-soft">{item.subtitle}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-semibold ${late ? "text-oxido" : "text-ink"}`}>
                      {formatRelative(item.days)}
                    </p>
                    <p className="font-mono text-xs text-ink-soft">{formatDate(item.dueDate)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}