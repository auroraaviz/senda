import type { ReactNode } from "react";

interface Props {
  title: string;
  text: string;
  action?: ReactNode;
  compact?: boolean;
}

export default function EmptyState({ title, text, action, compact = false }: Props) {
  return (
    <div
      className={`rounded-card border border-dashed border-border bg-surface/60 text-center ${
        compact ? "px-6 py-10" : "px-6 py-16"
      }`}
    >
      <svg
        viewBox="0 0 200 60"
        className={`mx-auto ${compact ? "h-10 w-32" : "h-14 w-48"}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 45 C 45 45, 45 15, 80 15 S 120 45, 150 30 S 180 12, 190 15"
          className="stroke-border"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 7"
        />
        <circle cx="10" cy="45" r="6" className="fill-secondary" />
        <circle cx="80" cy="15" r="6" className="fill-accent" />
        <circle cx="150" cy="30" r="6" className="fill-primary" />
        <circle cx="190" cy="15" r="6" className="fill-oxido" opacity="0.5" />
      </svg>
      <p className="mt-5 font-display text-2xl font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-base text-ink-soft">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}