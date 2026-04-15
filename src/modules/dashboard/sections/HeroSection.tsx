import { useTheme } from "@/theme";
import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function HeroSection() {
  const { themes, catalogueVersion, catalogueSource } = useTheme();
  const {
    badge,
    title,
    description,
    availableThemesLabel,
    complianceLabel,
    switchTimeLabel,
    catalogueLabel,
  } = DASHBOARD_CONFIG.hero;

  return (
    <section className="mt-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm md:p-8">
      <p className="inline-flex rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
        {badge}
      </p>
      <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
        {description}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
          <p className="m-0 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            {availableThemesLabel}
          </p>
          <p className="m-0 mt-1 text-lg font-semibold">{themes.length}</p>
        </article>
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
          <p className="m-0 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            {complianceLabel}
          </p>
          <p className="m-0 mt-1 text-lg font-semibold">WCAG 2.2 AA</p>
        </article>
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
          <p className="m-0 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            {switchTimeLabel}
          </p>
          <p className="m-0 mt-1 text-lg font-semibold">Instant</p>
        </article>
      </div>

      <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <p className="m-0 w-fit rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {catalogueLabel} v{catalogueVersion} ({catalogueSource})
        </p>
      </div>
    </section>
  );
}
