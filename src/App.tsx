import { getThemeBundleUrl, useTheme } from "@/theme";
import { ThemeSelector } from "@/components/ThemeSelector";
import { ThemedCard } from "@/components/ThemedCard";

function App() {
  const { currentTheme, themes, catalogueVersion, catalogueSource } =
    useTheme();
  const activeTheme = themes.find((theme) => theme.themeName === currentTheme);
  const stableBundleUrl = getThemeBundleUrl();
  const themeNames = themes.map((theme) => theme.meta.label).join(", ");

  const features = [
    {
      title: "Theme System",
      description:
        "Runtime theme switching with CSS custom properties. No page reload required.",
      status: "success" as const,
    },
    {
      title: "Multiple Themes",
      description: `Choose from ${themes.length} available themes: ${themeNames}.`,
      status: "info" as const,
    },
    {
      title: "WCAG 2.2 AA",
      description:
        "All themes pass automated accessibility checks. 4.5:1 contrast ratio, 2px focus rings.",
      status: "success" as const,
    },
    {
      title: "Responsive Design",
      description:
        "Layout variants and density classes apply atomically with token updates.",
      status: "info" as const,
    },
    {
      title: "Local Storage Persistence",
      description: "Theme selection saved and restored on page reload.",
      status: "success" as const,
    },
    {
      title: "OS Preference Detection",
      description:
        "Respects system prefers-color-scheme. Defaults to dark if OS prefers dark.",
      status: "info" as const,
    },
  ];

  const stats = [
    {
      label: "Active Theme",
      value: currentTheme,
    },
    {
      label: "Available Themes",
      value: String(themes.length),
    },
    {
      label: "Compliance",
      value: "WCAG 2.2 AA",
    },
    {
      label: "Switch Time",
      value: "Instant",
    },
    {
      label: "Layout",
      value: activeTheme?.layout || "n/a",
    },
    {
      label: "Density",
      value: activeTheme?.density || "n/a",
    },
  ];

  const cachingPolicy = [
    {
      location: "CDN Stable URL",
      ttl: "60 seconds",
      note: "Picks up the latest published bundle quickly on refresh.",
    },
    {
      location: "CDN Versioned URL",
      ttl: "Forever",
      note: "Immutable historical bundle for audit and rollback safety.",
    },
    {
      location: "Browser localStorage",
      ttl: "Preference: persistent; token cache: cleared on logout",
      note: "Cold-load fallback when CDN is unavailable.",
    },
  ];

  const startupResolutionOrder = [
    "Read ctms:theme-preference and apply if present in the catalogue.",
    "If absent, resolve OS prefers-color-scheme and map to default dark or light.",
    "Apply theme atomically and dispatch theme-changed event for MFEs.",
    "Render selector values from loaded catalogue data only.",
  ];

  const qaChecks = [
    "200% zoom with no clipped content and no horizontal scroll at 320px.",
    "Keyboard-only traversal with visible focus in each theme.",
    "Theme by layout matrix validation across sidebar and top-nav variants.",
    "Focus visibility on colored controls in every theme and density mode.",
  ];

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
        <header className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-primary)] text-sm font-bold text-[var(--color-surface)]"
              aria-hidden="true"
            >
              CT
            </span>
            <div>
              <p className="m-0 text-sm font-semibold tracking-wide">
                CTMS Theme Hub
              </p>
              <p className="m-0 mt-0.5 text-xs text-[var(--color-text-muted)]">
                Live token orchestration for micro frontends
              </p>
            </div>
          </div>
          <ThemeSelector />
        </header>

        <section className="mt-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm md:p-8">
          <p className="inline-flex rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Design Operations
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
            Professional Runtime Theme Experience
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
            Ship new visual systems without redeploying every MFE. Users switch
            themes in real time, and token updates stay governed by
            accessibility gates, versioning, and rollback safety.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
              >
                <p className="m-0 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  {stat.label}
                </p>
                <p className="m-0 mt-1 text-lg font-semibold">{stat.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="m-0 text-2xl font-semibold">Capability Matrix</h2>
              <p className="m-0 mt-1 text-sm text-[var(--color-text-muted)]">
                Runtime switching, accessibility enforcement, and release
                safety.
              </p>
            </div>
            <p className="m-0 w-fit rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Catalogue v{catalogueVersion} ({catalogueSource})
            </p>
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

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
            <h3 className="m-0 text-lg font-semibold">Pipeline Flow</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
              <li>
                Token updates enter source control with semantic versioning.
              </li>
              <li>CI validates WCAG rules across every published theme.</li>
              <li>
                Verdaccio stores every version for instant rollback options.
              </li>
              <li>CDN receives stable and versioned all-themes.js bundles.</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
            <h3 className="m-0 text-lg font-semibold">Runtime Flow</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
              <li>Host loads one bundle and populates selector dynamically.</li>
              <li>
                Selection applies variables plus layout and density classes.
              </li>
              <li>MFEs reflect changes instantly through CSS inheritance.</li>
              <li>
                Preference persists locally and recovers on next page load.
              </li>
            </ul>
          </article>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
            <h3 className="m-0 text-lg font-semibold">Caching Policy</h3>
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
            <h3 className="m-0 text-lg font-semibold">
              Startup Resolution Order
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
              {startupResolutionOrder.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 break-all rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
              Stable Bundle: {stableBundleUrl}
            </p>
          </article>
        </section>

        <section className="mt-4">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
            <h3 className="m-0 text-lg font-semibold">
              MFE Integration Contract
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-text-muted)]">
              <li>Use CSS variables for color, spacing, and typography.</li>
              <li>Ship rules for both layout-sidebar and layout-top-nav.</li>
              <li>Support density-comfortable and density-compact styles.</li>
              <li>
                Do not write to ctms:theme-preference or ctms:token-cache.
              </li>
              <li>
                Listen to theme-changed for non-CSS renderers like canvas.
              </li>
            </ul>
          </article>
        </section>

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

        <footer className="mt-6 border-t border-[var(--color-border)] pt-4">
          <p className="m-0 text-center text-sm text-[var(--color-text-muted)]">
            Theme updates roll out from stable CDN URL with no website
            redeployment required.
          </p>
        </footer>
      </section>
    </main>
  );
}

export default App;
