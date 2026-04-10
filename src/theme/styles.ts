/**
 * CSS Utility for Theme System
 * GlobalStyles that configure CSS custom properties and layout classes
 * Import this in your main app file
 */

// Base CSS custom properties
const baseStyles = `
  :root {
    /* These will be overridden by applyTheme() at runtime */
    --color-primary: #2563EB;
    --color-secondary: #7C3AED;
    --color-bg: #F9FAFB;
    --color-surface: #FFFFFF;
    --color-text: #111827;
    --color-text-muted: #4B5563;
    --color-error: #B91C1C;
    --color-success: #065F46;
    --color-warning: #B45309;
    --color-info: #0369A1;
    --color-border: #D1D5DB;
    --color-focus: #2563EB;

    --font-family-base: 'Inter', sans-serif;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-sm: 14px;
    --font-size-xl: 20px;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --line-height-base: 1.5;

    --spacing-unit: 4px;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --card-padding: 24px;

    --sidebar-width: 240px;
    --header-height: 64px;
    --container-max-width: 1280px;

    --focus-ring-width: 2px;
    --focus-ring-offset: 2px;
    --min-target-size: 44px;

    color-scheme: light;
  }

  :root[data-theme="dark"] {
    color-scheme: dark;
  }

  html {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    margin: 0;
    padding: 0;
    transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Focus styles - WCAG 2.4.11 */
  *:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-focus);
    outline-offset: var(--focus-ring-offset);
  }

  /* Minimum target size - WCAG 2.5.8 */
  a,
  button,
  input[type="button"],
  input[type="submit"],
  input[type="reset"],
  [role="button"],
  [role="link"] {
    min-width: var(--min-target-size);
    min-height: var(--min-target-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Reflow support - WCAG 1.4.10 */
  @media (max-width: 320px) {
    html {
      font-size: 14px;
    }
  }

  /* Layout variants */
  body.layout-sidebar {
    --sidebar-enabled: true;
  }

  body.layout-top-nav {
    --sidebar-enabled: false;
  }

  /* Density variants */
  body.density-compact {
    --spacing-unit: 2px;
    --spacing-xs: 2px;
    --spacing-sm: 4px;
    --spacing-md: 8px;
    --spacing-lg: 12px;
    --spacing-xl: 16px;
    --card-padding: 12px;
    --font-size-base: 14px;
  }

  body.density-comfortable {
    --spacing-unit: 4px;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --card-padding: 24px;
    --font-size-base: 16px;
  }

  /* Prefers-reduced-motion support - Accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Dark mode supports for browsers */
  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
    }
  }
`;

/**
 * Inject theme CSS variables and layout styles into the document
 * Call this in your application root
 */
export function injectThemeStyles(): void {
  const style = document.createElement("style");
  style.textContent = baseStyles;
  style.id = "theme-system-styles";
  document.head.appendChild(style);
}

/**
 * Get a spacing value
 */
export function getSpacing(
  amount: "xs" | "sm" | "md" | "lg" | "xl" | number,
): string {
  const map: Record<string, string> = {
    xs: "var(--spacing-xs)",
    sm: "var(--spacing-sm)",
    md: "var(--spacing-md)",
    lg: "var(--spacing-lg)",
    xl: "var(--spacing-xl)",
  };
  return typeof amount === "number" ? `${amount}px` : map[amount] || "0";
}

/**
 * Get a color value
 */
export function getColor(colorName: string): string {
  return `var(--color-${colorName})`;
}

/**
 * Get a font size value
 */
export function getFontSize(size: "sm" | "base" | "lg" | "xl"): string {
  const map: Record<string, string> = {
    sm: "var(--font-size-sm)",
    base: "var(--font-size-base)",
    lg: "var(--font-size-lg)",
    xl: "var(--font-size-xl)",
  };
  return map[size];
}
