/**
 * Theme System Type Definitions
 * Follows WCAG 2.2 AA accessibility standards
 */

export interface ThemeTokens {
  // Colour tokens
  "color-primary": string;
  "color-secondary": string;
  "color-bg": string;
  "color-surface": string;
  "color-text": string;
  "color-text-muted": string;
  "color-error": string;
  "color-success": string;
  "color-warning": string;
  "color-info": string;
  "color-border": string;
  "color-focus": string;

  // Typography tokens
  "font-family-base": string;
  "font-size-base": string;
  "font-size-lg": string;
  "font-size-sm": string;
  "font-size-xl": string;
  "font-weight-regular": string;
  "font-weight-medium": string;
  "font-weight-semibold": string;
  "line-height-base": string;

  // Spacing tokens
  "spacing-unit": string;
  "spacing-xs": string;
  "spacing-sm": string;
  "spacing-md": string;
  "spacing-lg": string;
  "spacing-xl": string;
  "card-padding": string;

  // Layout tokens
  "sidebar-width": string;
  "header-height": string;
  "container-max-width": string;

  // Focus and accessibility
  "focus-ring-width": string;
  "focus-ring-offset": string;
  "min-target-size": string;
}

export interface ThemeMeta {
  label: string;
  description: string;
  category?: "standard" | "custom" | "compact";
}

export interface ThemeDefinition {
  themeName: string;
  meta: ThemeMeta;
  tokens: ThemeTokens;
  layout: "layout-sidebar" | "layout-top-nav";
  density: "density-compact" | "density-comfortable";
}

export interface ThemeCatalogue {
  version: string;
  timestamp: string;
  themes: ThemeDefinition[];
  defaults: {
    light: string;
    dark: string;
  };
}

export interface ThemeContextType {
  currentTheme: string;
  themes: ThemeDefinition[];
  catalogueVersion: string;
  catalogueSource: "global" | "cdn" | "local-cache" | "embedded";
  isReady: boolean;
  setTheme: (themeName: string) => void;
  applyTheme: (themeName: string) => void;
  getThemeByName: (name: string) => ThemeDefinition | undefined;
}

export type ColorScheme = "light" | "dark";
