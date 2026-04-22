import { DASHBOARD_CONFIG } from "@/config/dashboard.config";
import { SectionFrame } from "@/components/SectionFrame";

export function QAGateSection() {
  const { title } = DASHBOARD_CONFIG.qaGate;
  const qaChecks = DASHBOARD_CONFIG.qaChecks;

  return (
    <section className="mt-4" aria-labelledby="qa-gate-title">
      <SectionFrame>
        <h3 id="qa-gate-title" className="m-0 text-lg font-semibold">
          {title}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          {qaChecks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </SectionFrame>
    </section>
  );
}
