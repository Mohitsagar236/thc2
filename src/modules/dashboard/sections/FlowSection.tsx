import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function FlowSection() {
  const { pipeline, runtime } = DASHBOARD_CONFIG.flow;

  return (
    <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">{pipeline.title}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          {pipeline.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">{runtime.title}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          {runtime.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
