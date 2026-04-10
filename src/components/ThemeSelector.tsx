/**
 * Theme Selector Component
 * Dropdown for switching between available themes
 * Demonstrates proper usage of the theme system
 */

import { useTheme } from "@/theme";
import { JSX } from "react";
import styles from "./ThemeSelector.module.css";

export function ThemeSelector(): JSX.Element {
  const { currentTheme, themes, setTheme } = useTheme();

  return (
    <div className={styles.selector}>
      <label htmlFor="theme-select" className={styles.label}>
        Theme:
      </label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value)}
        className={styles.select}
        aria-label="Select application theme"
      >
        {themes.map((theme) => (
          <option key={theme.themeName} value={theme.themeName}>
            {theme.meta.label} - {theme.meta.description}
          </option>
        ))}
      </select>
    </div>
  );
}
