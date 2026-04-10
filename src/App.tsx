import { useTheme } from "@/theme";
import { ThemeSelector } from "@/components/ThemeSelector";
import { ThemedCard } from "@/components/ThemedCard";

function App() {
  const { currentTheme, themes } = useTheme();

  const features = [
    {
      title: "Theme System",
      description:
        "Runtime theme switching with CSS custom properties. No page reload required.",
      status: "success" as const,
    },
    {
      title: "Multiple Themes",
      description: `Choose from ${themes.length} available themes: Light, Dark, Ocean, and Compact.`,
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

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        padding: "var(--spacing-lg)",
      }}
    >
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Header with Theme Selector */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--spacing-xl)",
            paddingBottom: "var(--spacing-lg)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 var(--spacing-sm) 0",
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Theme Configuration System
            </h1>
            <p
              style={{
                margin: 0,
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              Current theme: <strong>{currentTheme}</strong>
            </p>
          </div>
          <ThemeSelector />
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--spacing-lg)",
            marginTop: "var(--spacing-xl)",
          }}
        >
          {features.map((feature) => (
            <ThemedCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              status={feature.status}
            />
          ))}
        </div>

        {/* Documentation Section */}
        <div
          style={{
            marginTop: "var(--spacing-xl)",
            padding: "var(--card-padding)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        >
          <h2
            style={{
              margin: "0 0 var(--spacing-md) 0",
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            How It Works
          </h2>
          <ul
            style={{
              margin: "0",
              paddingLeft: "var(--spacing-lg)",
              lineHeight: "var(--line-height-base)",
            }}
          >
            <li style={{ marginBottom: "var(--spacing-sm)" }}>
              <strong>Pipeline Flow:</strong> Designers update tokens → CI
              validates accessibility → bundle compiled → deployed to CDN
            </li>
            <li style={{ marginBottom: "var(--spacing-sm)" }}>
              <strong>Runtime Flow:</strong> Bundle loaded once → user selects
              theme → CSS variables applied → all MFEs reflect change instantly
            </li>
            <li style={{ marginBottom: "var(--spacing-sm)" }}>
              <strong>Storage:</strong> Selection persisted to localStorage,
              cached bundle used as CDN fallback
            </li>
            <li>
              <strong>Accessibility:</strong> Every theme tested against WCAG
              2.2 AA criteria automatically
            </li>
          </ul>
        </div>

        {/* Integration Section */}
        <div
          style={{
            marginTop: "var(--spacing-xl)",
            padding: "var(--card-padding)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        >
          <h2
            style={{
              margin: "0 0 var(--spacing-md) 0",
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            MFE Integration
          </h2>
          <p style={{ margin: "var(--spacing-md) 0 0 0" }}>
            All MFEs consuming this theme system must follow the integration
            contract:
          </p>
          <ul
            style={{
              marginTop: "var(--spacing-md)",
              paddingLeft: "var(--spacing-lg)",
            }}
          >
            <li>
              Use CSS custom properties exclusively (var() instead of hardcoded
              values)
            </li>
            <li>Ship CSS for all layout variants and density classes</li>
            <li>Never load the theme bundle independently</li>
            <li>Listen for theme-changed custom event on window if needed</li>
          </ul>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "var(--spacing-xl)",
            paddingTop: "var(--spacing-lg)",
            borderTop: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-sm)",
            textAlign: "center",
          }}
        >
          <p>
            Theme catalogue version 1.0.0 • WCAG 2.2 AA compliant • All themes
            support dark mode and multiple layout variants
          </p>
        </footer>
      </section>
    </main>
  );
}

export default App;
