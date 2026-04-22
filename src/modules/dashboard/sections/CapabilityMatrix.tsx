import { ThemedCard } from "@/components/ThemedCard";
import { DASHBOARD_CONFIG } from "@/config/dashboard.config";
import { SectionFrame } from "@/components/SectionFrame";

export function CapabilityMatrix() {
  const { title, description } = DASHBOARD_CONFIG.capabilityMatrix;
  const features = DASHBOARD_CONFIG.features;

  return (
    <section className="mt-5" aria-labelledby="capability-matrix-title">
      <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="capability-matrix-title"
            className="m-0 text-2xl font-semibold"
          >
            {title}
          </h2>
          <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>
      </div>

      <SectionFrame>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title}>
              <ThemedCard
                title={feature.title}
                description={feature.description}
                status={feature.status}
              />
            </div>
          ))}
        </div>
      </SectionFrame>
    </section>
  );
}
