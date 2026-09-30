type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";

const STYLES: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
    PLANNED: { label: "Planificado", className: "bg-border text-ink-soft", dot: "bg-ink-soft" },
    IN_PROGRESS: { label: "En progreso", className: "bg-accent/25 text-ink", dot: "bg-accent" },
    COMPLETED: { label: "Completado", className: "bg-secondary/30 text-ink", dot: "bg-secondary" },
    DELAYED: { label: "Retrasado", className: "bg-oxido/15 text-oxido", dot: "bg-oxido" },
};

export default function StatusBadge({ status }: { status?: string }) {
    if (!status || !(status in STYLES)) return null;

    const { label, className, dot } = STYLES[status as ProjectStatus];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${className}`} >
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label} 
            </span>
    );
}