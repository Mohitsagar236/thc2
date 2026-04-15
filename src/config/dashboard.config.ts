/**
 * Dashboard Configuration
 * All constants for the theme dashboard
 */

export const DASHBOARD_CONFIG = {
  header: {
    title: "CTMS Theme Hub",
    subtitle: "Live token orchestration for micro frontends",
    logoText: "CT",
  },

  hero: {
    badge: "Design Operations",
    title: "Professional Runtime Theme Experience",
    description:
      "Ship new visual systems without redeploying every MFE. Users switch themes in real time, and token updates stay governed by accessibility gates, versioning, and rollback safety.",
    availableThemesLabel: "Available Themes",
    complianceLabel: "Compliance",
    switchTimeLabel: "Switch Time",
    catalogueLabel: "Catalogue",
  },

  capabilityMatrix: {
    title: "Capability Matrix",
    description:
      "Runtime switching, accessibility enforcement, and release safety.",
  },

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

  flow: {
    pipeline: {
      title: "Pipeline Flow",
      items: [
        "Token updates enter source control with semantic versioning.",
        "CI validates WCAG rules across every published theme.",
        "Verdaccio stores every version for instant rollback options.",
        "CDN receives stable and versioned all-themes.js bundles.",
      ],
    },
    runtime: {
      title: "Runtime Flow",
      items: [
        "Host loads one bundle and populates selector dynamically.",
        "Selection applies variables plus layout and density classes.",
        "MFEs reflect changes instantly through CSS inheritance.",
        "Preference persists locally and recovers on next page load.",
      ],
    },
  },

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

  caching: {
    title: "Caching Policy",
  },

  startupResolutionOrder: [
    "Read ctms:theme-preference and apply if present in the catalogue.",
    "If absent, resolve OS prefers-color-scheme and map to default dark or light.",
    "Apply theme atomically and dispatch theme-changed event for MFEs.",
    "Render selector values from loaded catalogue data only.",
  ],

  startup: {
    title: "Startup Resolution Order",
    stableBundleLabel: "Stable Bundle",
  },

  mfeIntegration: {
    title: "MFE Integration Contract",
  },

  qaChecks: [
    "200% zoom with no clipped content and no horizontal scroll at 320px.",
    "Keyboard-only traversal with visible focus in each theme.",
    "Theme by layout matrix validation across sidebar and top-nav variants.",
    "Focus visibility on colored controls in every theme and density mode.",
  ],

  qaGate: {
    title: "Pre-Stable QA Gate",
  },

  mfeContract: [
    "Use CSS variables for color, spacing, and typography.",
    "Ship rules for both layout-sidebar and layout-top-nav.",
    "Support density-comfortable and density-compact styles.",
    "Do not write to ctms:theme-preference or ctms:token-cache.",
    "Listen to theme-changed for non-CSS renderers like canvas.",
  ],

  footer: {
    text: "Theme updates roll out from stable CDN URL with no website redeployment required.",
  },
};
