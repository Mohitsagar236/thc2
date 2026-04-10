/**
 * Example Component Using Theme System
 * Demonstrates proper consumption of CSS custom properties
 * MFEs must use var() instead of hardcoded values
 */

import { JSX } from "react";

export interface ThemedCardProps {
  title: string;
  description: string;
  status?: "success" | "error" | "warning" | "info";
}

export function ThemedCard({
  title,
  description,
  status = "info",
}: ThemedCardProps): JSX.Element {
  const statusLabel = {
    success: "Validated",
    error: "Critical",
    warning: "Attention",
    info: "Operational",
  };

  const statusColor = {
    success: "var(--color-success)",
    error: "var(--color-error)",
    warning: "var(--color-warning)",
    info: "var(--color-primary)",
  }[status];

  return (
    <article
      className="group flex min-h-[44px] flex-col gap-3 rounded-2xl border border-[var(--color-border)] border-t-4 bg-[var(--color-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
      style={{ borderTopColor: statusColor }}
      role="article"
      tabIndex={0}
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-bg)] px-2 py-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: statusColor }}
          aria-hidden="true"
        />
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: statusColor }}
        >
          {statusLabel[status]}
        </span>
      </div>
      <h2 className="m-0 text-lg font-semibold leading-snug text-[var(--color-text)]">
        {title}
      </h2>
      <p className="m-0 text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
    </article>
  );
}
