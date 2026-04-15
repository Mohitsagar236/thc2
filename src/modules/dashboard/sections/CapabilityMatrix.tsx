import { ThemedCard } from "@/components/ThemedCard";
import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function CapabilityMatrix() {
  const features = DASHBOARD_CONFIG.features;

  return (
    <section className="mt-5">
      <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="m-0 text-2xl font-semibold">Capability Matrix</h2>
          <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">
            Runtime switching, accessibility enforcement, and release safety.
          </p>
        </div>
      </div>

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
    </section>
  );
}
