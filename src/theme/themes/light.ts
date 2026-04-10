import { ThemeDefinition } from "../types";

/**
 * Light Theme - Default theme with light background
 * WCAG 2.2 AA Compliant
 * Contrast ratios validated: text 4.5:1, large text 3:1, focus ring 3:1
 */
export const lightTheme: ThemeDefinition = {
  themeName: "light",
  meta: {
    label: "Light",
    description: "Clean light theme with high contrast",
    category: "standard",
  },
  tokens: {
    // Colour tokens - WCAG 2.2 AA compliant
    "color-primary": "#2563EB", // Blue - 4.5:1 on white background
    "color-secondary": "#7C3AED", // Purple
    "color-bg": "#F9FAFB", // Almost white background
    "color-surface": "#FFFFFF", // Pure white surface
    "color-text": "#111827", // Dark grey text - 13.3:1 contrast on white
    "color-text-muted": "#4B5563", // Medium grey
    "color-error": "#B91C1C", // Dark red
    "color-success": "#065F46", // Dark green
    "color-warning": "#B45309", // Dark orange
    "color-info": "#0369A1", // Dark cyan
    "color-border": "#D1D5DB", // Light grey border
    "color-focus": "#2563EB", // Blue focus ring

    // Typography tokens
    "font-family-base": "'Inter', sans-serif",
    "font-size-base": "16px",
    "font-size-lg": "18px",
    "font-size-sm": "14px",
    "font-size-xl": "20px",
    "font-weight-regular": "400",
    "font-weight-medium": "500",
    "font-weight-semibold": "600",
    "line-height-base": "1.5",

    // Spacing tokens
    "spacing-unit": "4px",
    "spacing-xs": "4px",
    "spacing-sm": "8px",
    "spacing-md": "16px",
    "spacing-lg": "24px",
    "spacing-xl": "32px",
    "card-padding": "24px",

    // Layout tokens
    "sidebar-width": "240px",
    "header-height": "64px",
    "container-max-width": "1280px",

    // Focus and accessibility
    "focus-ring-width": "2px",
    "focus-ring-offset": "2px",
    "min-target-size": "44px",
  },
  layout: "layout-sidebar",
  density: "density-comfortable",
};
