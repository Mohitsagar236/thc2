import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function MFEIntegrationSection() {
  const mfeContract = DASHBOARD_CONFIG.mfeContract;

  return (
    <section className="mt-4">
      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">MFE Integration Contract</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          {mfeContract.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
