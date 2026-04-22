import { DASHBOARD_CONFIG } from "@/config/dashboard.config";
import { SectionFrame } from "@/components/SectionFrame";

export function MFEIntegrationSection() {
  const { title } = DASHBOARD_CONFIG.mfeIntegration;
  const mfeContract = DASHBOARD_CONFIG.mfeContract;

  return (
    <section className="mt-4" aria-labelledby="mfe-integration-title">
      <SectionFrame>
        <h3 id="mfe-integration-title" className="m-0 text-lg font-semibold">
          {title}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          {mfeContract.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionFrame>
    </section>
  );
}
