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
  const activeTheme = themes.find((theme) => theme.themeName === currentTheme);

  return (
    <div className={styles.selector}>
      <div className={styles.labelBlock}>
        <label htmlFor="theme-select" className={styles.label}>
          Appearance
        </label>
        <p className={styles.helperText}>
          Active: {activeTheme?.meta.label || currentTheme}
        </p>
      </div>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value)}
        className={styles.select}
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
