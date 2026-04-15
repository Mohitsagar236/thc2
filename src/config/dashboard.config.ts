/**
 * Dashboard Configuration
 * All constants for the theme dashboard
 */

export const DASHBOARD_CONFIG = {
  // Header config
  header: {
    title: "CTMS Theme Hub",
    subtitle: "Live token orchestration for micro frontends",
    logoText: "CT",
  },

  // Hero section config
  hero: {
    badge: "Design Operations",
    title: "Professional Runtime Theme Experience",
    description:
      "Ship new visual systems without redeploying every MFE. Users switch themes in real time, and token updates stay governed by accessibility gates, versioning, and rollback safety.",
  },

  // Stats configuration
  stats: [
    {
      label: "Active Theme",
      value: "currentTheme", // Dynamic - will be replaced at runtime
    },
    {
      label: "Available Themes",
      value: "themeCount", // Dynamic
    },
    {
      label: "Compliance",
      value: "WCAG 2.2 AA",
    },
    {
      label: "Switch Time",
      value: "Instant",
    },
    {
      label: "Layout",
      value: "layout", // Dynamic
    },
    {
      label: "Density",
      value: "density", // Dynamic
    },
  ],

  // Features/Capabilities configuration
  features: [
    {
      title: "Theme System",
      description:
        "Runtime theme switching with CSS custom properties. No page reload required.",
      status: "success" as const,
    },
    {
      title: "Multiple Themes",
      description: `Choose from available themes.`,
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
        "Layout variants and density classes apply atomically with token updates.",
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
  ],

  // Caching policy configuration
  cachingPolicy: [
    {
      location: "CDN Stable URL",
      ttl: "60 seconds",
      note: "Picks up the latest published bundle quickly on refresh.",
    },
    {
      location: "CDN Versioned URL",
      ttl: "Forever",
      note: "Immutable historical bundle for audit and rollback safety.",
    },
    {
      location: "Browser localStorage",
      ttl: "Preference: persistent; token cache: cleared on logout",
      note: "Cold-load fallback when CDN is unavailable.",
    },
  ],

  // Startup resolution order
  startupResolutionOrder: [
    "Read ctms:theme-preference and apply if present in the catalogue.",
    "If absent, resolve OS prefers-color-scheme and map to default dark or light.",
    "Apply theme atomically and dispatch theme-changed event for MFEs.",
    "Render selector values from loaded catalogue data only.",
  ],

  // QA checks configuration
  qaChecks: [
    "200% zoom with no clipped content and no horizontal scroll at 320px.",
    "Keyboard-only traversal with visible focus in each theme.",
    "Theme by layout matrix validation across sidebar and top-nav variants.",
    "Focus visibility on colored controls in every theme and density mode.",
  ],

  // MFE integration contract
  mfeContract: [
    "Use CSS variables for color, spacing, and typography.",
    "Ship rules for both layout-sidebar and layout-top-nav.",
    "Support density-comfortable and density-compact styles.",
    "Do not write to ctms:theme-preference or ctms:token-cache.",
    "Listen to theme-changed for non-CSS renderers like canvas.",
  ],

  // Footer config
  footer: {
    text: "Theme updates roll out from stable CDN URL with no website redeployment required.",
  },
};
