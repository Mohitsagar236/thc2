import { getThemeBundleUrl } from "@/theme";
import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function CachingAndStartupSection() {
  const { title: cachingTitle } = DASHBOARD_CONFIG.caching;
  const { title: startupTitle, stableBundleLabel } = DASHBOARD_CONFIG.startup;
  const cachingPolicy = DASHBOARD_CONFIG.cachingPolicy;
  const startupResolutionOrder = DASHBOARD_CONFIG.startupResolutionOrder;
  const stableBundleUrl = getThemeBundleUrl();

  return (
    <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">{cachingTitle}</h3>
        <ul className="mt-3 space-y-3">
          {cachingPolicy.map((policy) => (
            <li
              key={policy.location}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
            >
              <p className="m-0 text-sm font-semibold">{policy.location}</p>
              <p className="m-0 mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                {policy.ttl}
              </p>
              <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">
                {policy.note}
              </p>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
        <h3 className="m-0 text-lg font-semibold">{startupTitle}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
          {startupResolutionOrder.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-3 break-all rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
          {stableBundleLabel}: {stableBundleUrl}
        </p>
      </article>
    </section>
  );
}
