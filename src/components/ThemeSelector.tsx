/**
 * Theme Selector Component
 * Dropdown for switching between available themes
 * Demonstrates proper usage of the theme system
 */

import { useTheme } from "@/theme";
import { JSX } from "react";

export function ThemeSelector(): JSX.Element {
  const { currentTheme, themes, setTheme } = useTheme();
  const activeTheme = themes.find((theme) => theme.themeName === currentTheme);

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:min-w-[360px] md:flex-row md:items-center md:gap-3">
      <div className="md:min-w-[115px]">
        <label
          htmlFor="theme-select"
          className="m-0 text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]"
        >
          Appearance
        </label>
        <p className="m-0 mt-1 text-xs text-[var(--color-text-muted)]">
          Active: {activeTheme?.meta.label || currentTheme}
        </p>
      </div>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value)}
        className="min-h-[44px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text)] shadow-sm outline-none transition hover:border-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] md:min-w-[210px]"
        aria-label="Select application theme"
      >
        {themes.map((theme) => (
          <option key={theme.themeName} value={theme.themeName}>
            {theme.meta.label}
          </option>
        ))}
      </select>
    </div>
  );
}
