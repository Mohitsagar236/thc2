import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function QAGateSection() {
  const qaChecks = DASHBOARD_CONFIG.qaChecks;

  return (
    <section className="mt-4">
      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">Pre-Stable QA Gate</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          {qaChecks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
