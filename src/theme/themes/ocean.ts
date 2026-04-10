import { ThemeDefinition } from "../types";

/**
 * Ocean Theme - Ocean-inspired blue palette
 * WCAG 2.2 AA Compliant
 * For use with light backgrounds
 */
export const oceanTheme: ThemeDefinition = {
  themeName: "ocean",
  meta: {
    label: "Ocean",
    description: "Ocean-inspired blue palette with calming aesthetics",
    category: "custom",
  },
  tokens: {
    // Colour tokens - ocean blue palette
    "color-primary": "#0369A1", // Deep ocean blue
    "color-secondary": "#0EA5E9", // Bright cyan
    "color-bg": "#F0F9FF", // Very light blue background
    "color-surface": "#FFFFFF", // White surface
    "color-text": "#0C2340", // Deep navy text
    "color-text-muted": "#475569", // Slate grey
    "color-error": "#B91C1C", // Red (shared)
    "color-success": "#059669", // Emerald
    "color-warning": "#B45309", // Amber
    "color-info": "#0369A1", // Deep ocean
    "color-border": "#BAE6FD", // Light blue border
    "color-focus": "#0369A1", // Ocean blue focus

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
