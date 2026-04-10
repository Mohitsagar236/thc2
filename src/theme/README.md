# Theme System — Complete Documentation

This directory contains the complete theme configuration system for the CTMS host application. It covers:

- **Design tokens** — colors, typography, spacing, and layout
- **Runtime theme switching** — instant, no-reload theme changes
- **Accessibility compliance** — WCAG 2.2 AA validation built-in
- **Production deployment** — Verdaccio, CI/CD, CDN pipeline
- **MFE integration** — contract and guidelines for micro frontends

## Quick Start

### 1. Use Themes in Your Component

```tsx
import { useTheme } from "@/theme";

export function MyComponent() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div style={{ color: "var(--color-text)" }}>
      <button onClick={() => setTheme("ocean")}>Switch to Ocean</button>
    </div>
  );
}
```

### 2. Style with CSS Variables

Never hardcode colors, fonts, or spacing. Always use CSS custom properties:

```css
/* ✅ CORRECT */
.button {
  background-color: var(--color-primary);
  color: var(--color-surface);
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-family-base);
}

/* ❌ WRONG */
.button {
  background-color: #6467f2; /* Don't do this */
  color: white;
  padding: 12px 20px;
  font-family: "Inter, sans-serif";
}
```

## File Structure

```
src/theme/
├── index.ts                    # Public API exports
├── types.ts                    # TypeScript types and interfaces
├── context.ts                  # React Context (in separate file to avoid Fast Refresh warning)
├── provider.tsx                # ThemeProvider component
├── loader.ts                   # CDN/global/cache catalogue loader
├── hooks/
│   └── useTheme.ts            # Custom hook for accessing theme
├── switcher.ts                 # Runtime theme application logic
├── styles.ts                   # CSS injection and utility functions
├── wcag-validation.ts          # Accessibility validation utilities
├── versioning.ts               # Version management and constraints
├── mfe-integration-contract.ts # MFE integration guidelines
├── deployment-guide.ts         # Verdaccio, CI/CD, CDN setup
├── DOCUMENTATION.tsx           # Implementation documentation component
└── themes/
  ├── catalogue.json         # Single source of truth for all themes
    ├── index.ts               # Theme catalogue export

src/components/
├── ThemeSelector.tsx          # Theme selector dropdown
├── ThemeSelector.module.css   # Selector styles
├── ThemedCard.tsx             # Example themed component
└── ThemedCard.module.css      # Card component styles

scripts/
├── build-theme-bundle.js      # Build all-themes.js for CDN
├── validate-themes.js         # Run WCAG accessibility checks
└── check-bundle-size.js       # Verify bundle size limits

.github/workflows/
└── theme-publish.yml          # CI/CD pipeline for validation and publishing
```

## Architecture

### Two Flows

**Pipeline Flow** (How themes are shipped)

```
Designer updates tokens → Push to git → CI validates WCAG →
Publish to Verdaccio → Build all-themes.js → Upload to CDN
```

**Runtime Flow** (How users switch themes)

```
Host loads bundle from CDN → User selects theme →
applyTheme() sets CSS variables → All MFEs reflect instantly →
Selection saved to localStorage
```

### Key Pieces

| Component           | Purpose                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Themes**          | 4 complete theme definitions (Light, Dark, Ocean, Compact) with color, typography, spacing, and layout tokens |
| **ThemeProvider**   | React Context wrapper that manages theme state and initialization                                             |
| **useTheme**        | Custom hook for accessing current theme and switching themes                                                  |
| **Switcher**        | Runtime logic that applies theme by setting CSS variables, classes, events, and localStorage                  |
| **WCAG Validation** | Automated contrast checks, focus ring validation, token completeness checks                                   |
| **Deployment**      | Verdaccio registry, GitHub Actions CI/CD, CDN caching strategy                                                |

## Theme Catalogue

Four themes are included, each WCAG 2.2 AA compliant:

### Light Theme

- **When to use:** Default, bright environments, daytime
- **Contrast:** 13.3:1 text on background, 4.5:1 on primary color
- **Colors:** White surface (#FFFFFF), dark text (#111827)

### Dark Theme

- **When to use:** Low-light environments, night mode
- **Contrast:** Same 4.5:1 minimum on all color pairs
- **Colors:** Dark surface (#1F2937), light text (#F9FAFB)

### Ocean Theme

- **When to use:** Branded experience, blue palette preference
- **Contrast:** Validated against all backgrounds
- **Colors:** Ocean blue primary (#0369A1), light sky background (#F0F9FF)

### Compact Theme

- **When to use:** Information-dense interfaces, small screens
- **Layout:** Reduced spacing (4px unit vs 8px), smaller fonts (14px vs 16px)
- **Density:** All components render in compact mode

## Token Categories

Every theme includes tokens across these categories:

### Colors

- `--color-bg` — Page background
- `--color-surface` — Card/container background
- `--color-text` — Primary text color
- `--color-text-muted` — Secondary text, hints
- `--color-primary` — Brand primary color
- `--color-error`, `--color-success`, `--color-warning` — Semantic colors
- `--color-border` — Border color
- `--color-focus` — Focus ring color

### Typography

- `--font-family-base` — Default font stack
- `--font-size-base` — Default text size
- `--line-height-base` — Line height for readability

### Spacing

- `--spacing-unit` — Base unit (4px or 2px)
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl` — Spacing scale

### Layout

- `--sidebar-width` — Sidebar column width
- `--header-height` — Header/nav height
- `--container-max-width` — Max content width
- `--card-padding` — Padding inside cards

### Classes (not CSS variables)

- `layout-sidebar` — Sidebar navigation layout
- `layout-top-nav` — Top navigation layout
- `density-compact` — Dense information display
- `density-comfortable` — Spacious layout

## Using the Theme System

### In Components

```tsx
import { useTheme } from "@/theme";
import styles from "./MyComponent.module.css";

export function MyComponent() {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div className={styles.container}>
      <h1>Current: {currentTheme}</h1>

      <select onChange={(e) => setTheme(e.target.value)}>
        {themes.map((theme) => (
          <option key={theme.themeName} value={theme.themeName}>
            {theme.meta.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### In CSS Modules

```css
.container {
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.container:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Support layout variants */
.layout-sidebar .container {
  grid-column: 2;
}

.layout-top-nav .container {
  padding-top: var(--header-height);
}

/* Support density modes */
.density-compact .container {
  padding: var(--spacing-sm);
}

.density-comfortable .container {
  padding: var(--spacing-lg);
}
```

### Reacting to Theme Changes

If your component needs to re-render when theme changes (e.g., canvas-based components):

```tsx
useEffect(() => {
  const handleThemeChange = (event: CustomEvent) => {
    console.log("Theme changed to:", event.detail.themeName);
    // Redraw canvas, refresh charts, etc.
  };

  window.addEventListener("theme-changed", handleThemeChange as EventListener);
  return () =>
    window.removeEventListener(
      "theme-changed",
      handleThemeChange as EventListener,
    );
}, []);
```

## Accessibility Compliance

### Automatic Checks (CI/CD)

- ✅ Contrast ratios: 4.5:1 for normal text, 3:1 for large text
- ✅ Focus ring visibility: 2px minimum width, 3:1 contrast
- ✅ Target size: 44×44px recommended minimum
- ✅ Token completeness: Every theme has all required tokens
- ✅ Runs on EVERY publish — failures block deployment

### Manual Checks (QA)

- ✅ 200% zoom: No content cut off or horizontal scroll
- ✅ Keyboard navigation: Tab through all interactive elements
- ✅ Dark mode contrast: Visually verify readability in dark variants
- ✅ Focus rings on colored buttons: Outline visible on any color
- ✅ Layout variants: Test every theme × every layout combination

See Section 9 of [Theme Configuration Spec](./deployment-guide.ts) for full accessibility requirements.

## Production Deployment

### Publishing a New Version

```bash
# 1. Update token values in theme definitions
# 2. Bump version in package.json
npm version minor

# 3. Push to repository
git push origin develop

# 4. CI automatically:
#    - Validates WCAG compliance
#    - Publishes to Verdaccio
#    - Builds all-themes.js bundle
#    - Uploads to CDN
#    - Updates stable tag

# 5. QA runs manual checks from Section 9.2
# 6. Tag version as stable (or CI does this automatically)
npm dist-tag add @ctms/theme@1.2.0 stable
```

### Rolling Back

```bash
# If issues found, quickly revert to previous version
npm dist-tag add @ctms/theme@1.1.0 stable

# CI detects tag change and:
# - Rebuilds bundle from v1.1.0
# - Re-uploads to CDN stable URL
# - Users get old version on next page load
```

### CDN Setup

The bundle is hosted on CDN at:

- **Stable URL** (short TTL, 60s cache): `/themes/stable/all-themes.js`
- **Versioned URL** (permanent, forever cache): `/themes/1.2.0/all-themes.js`

Host application must ALWAYS load from the stable URL, never hardcode a version.

For detailed CDN setup instructions (AWS S3, Cloudflare, etc.), see [Deployment Guide](./deployment-guide.ts#part-4-cdn-deployment-options).

## MFE Integration Contract

All micro frontend teams must follow these rules:

### What MFEs Must Do

1. ✅ Use CSS custom properties for ALL colors, typography, spacing
2. ✅ Ship CSS for all layout (`layout-sidebar`, `layout-top-nav`) and density (`density-compact`, `density-comfortable`) classes
3. ✅ Never load the bundle independently — host app loads it once
4. ✅ Never write to `ctms:theme-preference` or `ctms:token-cache` keys
5. ✅ Optionally listen for `theme-changed` event if you need programmatic reaction

### What Host Application Must Do

1. ✅ Always load from stable CDN URL (never hardcoded version)
2. ✅ Apply theme atomically (variables + classes + event + storage in one operation)
3. ✅ Dispatch `theme-changed` custom event on window
4. ✅ Resolve theme priority: localStorage → OS preference → default light

See [MFE Integration Contract](./mfe-integration-contract.ts) for full details.

## Available Scripts

```bash
# Development
npm run dev                    # Start Vite dev server

# Building
npm run build                  # Build app + compile TypeScript
npm run preview               # Preview production build

# Quality
npm run lint                  # Run ESLint
npm run lint:fix             # Fix ESLint issues
npm run format               # Auto-format with Prettier
npm run format:check         # Check formatting

# Theme-Specific
npm run theme:validate       # Run WCAG accessibility checks
npm run theme:build-bundle   # Build all-themes.js for CDN
npm run theme:check-size     # Verify bundle size limits
npm run theme:publish        # Publish to Verdaccio + tag stable
```

## Environment Variables

For local development and CI/CD:

```bash
# .env.local
VERDACCIO_URL=https://verdaccio.company.com
CDN_URL=https://cdn.company.com/themes
VITE_THEME_STABLE_URL=https://cdn.company.com/themes/stable/all-themes.js
VITE_THEME_BUNDLE_TIMEOUT_MS=6000
THEME_OUTPUT_DIR=dist/theme
THEME_BUNDLE_VERSION=1.0.0
NODE_ENV=production
```

**NEVER** commit `.env.local`. Use GitHub repository secrets for sensitive values.

## Troubleshooting

### Theme not applying

- Check browser DevTools Network tab: Is `/themes/stable/all-themes.js` loading?
- Check DevTools Console: `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')`
- Should return hex value. If empty, bundle didn't load.

### MFE doesn't update with theme

- MFE using hardcoded colors instead of CSS variables?
- MFE CSS for layout/density variants missing?
- Not listening to `theme-changed` event if needed?

### Contrast validation fails in CI

- Run locally: `npm run theme:validate`
- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Update token values to meet 4.5:1 minimum
- Re-publish

### Old theme bundle in browser cache

- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear localStorage: `localStorage.clear()`
- Wait 60s for CDN cache TTL

## Further Reading

- [WCAG 2.2 Accessibility Standards](https://www.w3.org/WAI/WCAG22/quickref/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Semantic Versioning](https://semver.org/)
- [Verdaccio Documentation](https://verdaccio.org/)

## Support

For questions about the theme system:

1. Check [MFE Integration Contract](./mfe-integration-contract.ts)
2. See [Deployment Guide](./deployment-guide.ts)
3. Read [WCAG Validation](./wcag-validation.ts)
4. Review example components: [ThemeSelector](../components/ThemeSelector.tsx), [ThemedCard](../components/ThemedCard.tsx)
