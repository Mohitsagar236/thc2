import { useTheme } from "@/theme";
import { ThemeSelector } from "@/components/ThemeSelector";
import { ThemedCard } from "@/components/ThemedCard";
import styles from "./App.module.css";

function App() {
  const { currentTheme, themes, catalogueVersion, catalogueSource } =
    useTheme();
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
        "Layout variants (sidebar, top-nav) and density modes (compact, comfortable).",
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
  ];

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              CT
            </span>
            <div>
              <p className={styles.brandName}>CTMS Theme Hub</p>
              <p className={styles.brandMeta}>
                Live token orchestration for micro frontends
              </p>
            </div>
          </div>
          <ThemeSelector />
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Design Operations</p>
          <h1 className={styles.heroTitle}>
            Professional Runtime Theme Experience
          </h1>
          <p className={styles.heroLead}>
            Ship new visual systems without redeploying every MFE. Users switch
            themes in real time, and token updates stay governed by
            accessibility gates, versioning, and rollback safety.
          </p>

          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <article key={stat.label} className={styles.stat}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Capability Matrix</h2>
              <p className={styles.sectionKicker}>
                Runtime switching, accessibility enforcement, and release
                safety.
              </p>
            </div>
            <p className={styles.versionPill}>
              Catalogue v{catalogueVersion} ({catalogueSource})
            </p>
          </div>

          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <div key={feature.title} className={styles.featureItem}>
                <ThemedCard
                  title={feature.title}
                  description={feature.description}
                  status={feature.status}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.split}>
          <article className={styles.panel}>
            <h3 className={styles.panelTitle}>Pipeline Flow</h3>
            <ul className={styles.flowList}>
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

          <article className={styles.panel}>
            <h3 className={styles.panelTitle}>Runtime Flow</h3>
            <ul className={styles.flowList}>
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

        <section className={styles.contractPanel}>
          <article className={styles.panel}>
            <h3 className={styles.panelTitle}>MFE Integration Contract</h3>
            <ul className={styles.contractList}>
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

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Theme updates roll out from stable CDN URL with no website
            redeployment required.
          </p>
        </footer>
      </section>
    </main>
  );
}

export default App;
