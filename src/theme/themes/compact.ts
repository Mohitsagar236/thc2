import { ThemeDefinition } from "../types";

/**
 * Compact Light Theme - Dense layout optimized for information density
 * WCAG 2.2 AA Compliant
 * Reduced spacing and smaller font sizes
 */
export const compactTheme: ThemeDefinition = {
  themeName: "light-compact",
  meta: {
    label: "Light Compact",
    description: "Compact light theme with dense information layout",
    category: "compact",
  },
  tokens: {
    // Colour tokens (same as light theme)
    "color-primary": "#2563EB",
    "color-secondary": "#7C3AED",
    "color-bg": "#F9FAFB",
    "color-surface": "#FFFFFF",
    "color-text": "#111827",
    "color-text-muted": "#4B5563",
    "color-error": "#B91C1C",
    "color-success": "#065F46",
    "color-warning": "#B45309",
    "color-info": "#0369A1",
    "color-border": "#D1D5DB",
    "color-focus": "#2563EB",

    // Typography tokens - slightly smaller
    "font-family-base": "'Inter', sans-serif",
    "font-size-base": "14px",
    "font-size-lg": "16px",
    "font-size-sm": "12px",
    "font-size-xl": "18px",
    "font-weight-regular": "400",
    "font-weight-medium": "500",
    "font-weight-semibold": "600",
    "line-height-base": "1.4",

    // Spacing tokens - more compact
    "spacing-unit": "4px",
    "spacing-xs": "2px",
    "spacing-sm": "4px",
    "spacing-md": "8px",
    "spacing-lg": "12px",
    "spacing-xl": "16px",
    "card-padding": "12px",

    // Layout tokens
    "sidebar-width": "200px",
    "header-height": "48px",
    "container-max-width": "1440px",

    // Focus and accessibility
    "focus-ring-width": "2px",
    "focus-ring-offset": "2px",
    "min-target-size": "40px", // Slightly reduced but still accessible
  },
  layout: "layout-sidebar",
  density: "density-compact",
};
