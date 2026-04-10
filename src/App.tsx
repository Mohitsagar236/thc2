import { useTheme } from "@/theme";
import { ThemeSelector } from "@/components/ThemeSelector";
import styles from "./App.module.css";

function App() {
  const { currentTheme, themes, catalogueVersion, catalogueSource } =
    useTheme();
  const themeNames = themes.map((theme) => theme.meta.label).join(", ");

  const checklist = [
    "React + Vite + TypeScript scaffold active",
    "Tailwind CSS v3 and PostCSS configured",
    "ESLint + Prettier + Husky + lint-staged wired",
    "Absolute imports configured with @ aliases",
    "Inter font loaded from Google CDN",
    "Theme runtime switcher + local cache fallback working",
    "WCAG 2.2 AA validation scripts integrated",
    "Theme bundle build + size checks integrated",
  ];

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Disha Frontend Setup</h1>
            <p className={styles.subtitle}>
              Vite + React + Tailwind v3 + ESLint + Prettier + Husky
            </p>
          </div>
          <ThemeSelector />
        </header>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Current Runtime State</h2>
          <ul className={styles.inlineList}>
            <li>Active theme: {currentTheme}</li>
            <li>Available themes: {themes.length}</li>
            <li>Theme catalogue: v{catalogueVersion}</li>
            <li>Catalogue source: {catalogueSource}</li>
          </ul>
          <p className={styles.note}>Available theme labels: {themeNames}</p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Setup Checklist</h2>
          <ul className={styles.checklist}>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Common Commands</h3>
            <ul className={styles.commandList}>
              <li>
                <code>npm run dev</code>
              </li>
              <li>
                <code>npm run format:check</code>
              </li>
              <li>
                <code>npm run lint</code>
              </li>
              <li>
                <code>npm run build</code>
              </li>
              <li>
                <code>npm run theme:validate</code>
              </li>
            </ul>
          </article>

          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Project Conventions</h3>
            <ul className={styles.commandList}>
              <li>
                Use absolute imports via <code>@/*</code> aliases.
              </li>
              <li>
                Keep design tokens in theme catalogue and avoid hardcoded
                values.
              </li>
              <li>Run lint + format checks before every commit.</li>
              <li>Use SSH remote for GitHub push operations.</li>
            </ul>
          </article>
        </section>

        <footer className={styles.footer}>
          <p>
            Disha frontend baseline is active. Theme runtime remains available
            behind this setup shell.
          </p>
        </footer>
      </section>
    </main>
  );
}

export default App;
