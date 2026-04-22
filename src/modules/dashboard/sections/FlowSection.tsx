import { DASHBOARD_CONFIG } from "@/config/dashboard.config";
import { SectionFrame } from "@/components/SectionFrame";

export function FlowSection() {
  const { pipeline, runtime } = DASHBOARD_CONFIG.flow;

  return (
    <section
      className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
      aria-labelledby="flow-section-heading"
    >
      <h2 id="flow-section-heading" className="sr-only">
        Workflow overview
      </h2>

      <SectionFrame className="p-4 md:p-5 shadow-sm">
        <h3 className="m-0 text-lg font-semibold">{pipeline.title}</h3>
        <dl className="mt-3 space-y-3 text-sm leading-6 text-[var(--color-text-muted)]">
          {pipeline.items.map((item) => (
            <div key={item}>
              <dt className="sr-only">Pipeline step</dt>
              <dd>• {item}</dd>
            </div>
          ))}
        </dl>
      </SectionFrame>

      <SectionFrame className="p-4 md:p-5 shadow-sm">
        <h3 className="m-0 text-lg font-semibold">{runtime.title}</h3>
        <dl className="mt-3 space-y-3 text-sm leading-6 text-[var(--color-text-muted)]">
          {runtime.items.map((item) => (
            <div key={item}>
              <dt className="sr-only">Runtime expectation</dt>
              <dd>• {item}</dd>
            </div>
          ))}
        </dl>
      </SectionFrame>
    </section>
  );
}
