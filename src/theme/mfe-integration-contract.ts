/**
 * MFE Integration Contract & Guidelines
 *
 * This document defines the obligations of each team for the theme system
 * to work correctly across all micro frontends.
 *
 * All MFE teams MUST read and follow this contract.
 */

// MFE Integration Contract & Documentation

/**
 * SECTION 1: WHAT EACH MFE MUST DO
 *
 * 1. Use CSS Custom Properties Exclusively
 *    - Never hardcode colors, typography, or spacing values
 *    - Always use var(--color-*), var(--font-*), var(--spacing-*)
 *    - Example: ✗ "color: #2563EB" → ✓ "color: var(--color-primary)"
 *
 * 2. Ship CSS for All Layout Variants
 *    - Provide CSS rules for: layout-sidebar, layout-top-nav
 *    - Provide CSS rules for: density-compact, density-comfortable
 *    - Host application applies these classes at runtime
 *    - If your MFE doesn't support a variant, explicitly declare it in docs
 *
 * 3. Never Load Theme Bundle Independently
 *    - The host application loads it once on startup
 *    - All CSS variables are set on document.documentElement
 *    - MFEs inherit through CSS cascade automatically
 *    - Do NOT fetch /themes/stable/all-themes.js yourself
 *
 * 4. Never Write to Theme localStorage Keys
 *    - Only host application manages ctms:theme-preference
 *    - Only host application manages ctms:token-cache
 *    - Reading is OK, writing is forbidden
 *
 * 5. Optionally Listen for theme-changed Event
 *    - Dispatch location: window (bubbles: true, composed: true)
 *    - Event type: CustomEvent<{ themeName: string; layout: string; density: string; source: string; emittedAt: string }>
 *    - Use case: re-render canvas/SVG that doesn't respond to CSS changes
 *    - Example: canvas-based charting libraries
 */

/**
 * Code Example: MFE Component Using Theme Correctly
 */
export const MFE_INTEGRATION_EXAMPLE = `
// ✅ CORRECT: Using theme CSS variables
import { useTheme } from "@/theme";
import styles from "./MyComponent.module.css";

export function MyComponent() {
  const { currentTheme } = useTheme(); // Optional, for programmatic access

  // Listen for theme changes if needed (e.g., canvas elements)
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      console.log("Theme changed to:", event.detail.themeName);
      // Redraw canvas, refresh charts, etc.
    };

    window.addEventListener("theme-changed", handleThemeChange as EventListener);
    return () =>
      window.removeEventListener("theme-changed", handleThemeChange as EventListener);
  }, []);

  return (
    <div className={styles.container}>
      <button className={styles.button}>Click me</button>
    </div>
  );
}

// ✅ CORRECT: CSS Module using CSS variables
/* MyComponent.module.css */
.container {
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
}

.button {
  background-color: var(--color-primary);
  color: var(--color-surface);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 4px;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  transition: all 200ms ease;
}

.button:hover {
  background-color: var(--color-info);
}

.button:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Layout variant support */
.layout-sidebar .container {
  grid-column: 2; /* Right of sidebar */
}

.layout-top-nav .container {
  padding-top: var(--header-height); /* Below top nav */
}

/* Density variant support */
.density-compact .button {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
}

.density-comfortable .button {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
}

/* ✗ INCORRECT: Hardcoded values
.button {
  background-color: #6467f2;        // NO! Use var(--color-primary)
  color: white;                      // NO! Use var(--color-surface)
  padding: 12px 20px;                // NO! Use var(--spacing-*)
  font-family: "Inter, sans-serif";  // NO! Use var(--font-family-base)
}
*/
`;

/**
 * SECTION 2: WHAT THE HOST APPLICATION MUST DO
 */
export const HOST_OBLIGATIONS = {
  "1. Always load stable URL": `
    ✓ CORRECT: <script src="https://cdn.example.com/themes/stable/all-themes.js"></script>
    ✗ WRONG:   <script src="https://cdn.example.com/themes/2.1.0/all-themes.js"></script>
    
    The stable URL gets updated when new versions are published.
    Never hardcode a versioned URL into HTML.
  `,

  "2. Populate dropdown from loaded bundle": `
    ✓ CORRECT: const themes = window.__THEME_CATALOGUE__.themes;
               theme.forEach(t => dropdown.add(t.meta.label));
    
    ✗ WRONG:   const hardcodedThemes = ['Light', 'Dark', 'Ocean'];
               hardcodedThemes.forEach(t => dropdown.add(t));
    
    Hardcoded lists become stale when new themes are added to the catalogue.
  `,

  "3. Apply theme atomically": `
    ✓ CORRECT: 
      applyTheme(selectedTheme);
      // Simultaneously:
      // - Sets all CSS variables on document.documentElement
      // - Applies layout-* class to body
      // - Applies density-* class to body
      // - Dispatches theme-changed event
      // - Saves to localStorage
    
    ✗ WRONG:   Applying variables first, then layout class later.
               This causes visual flicker and can break layout.
  `,

  "4. Dispatch theme-changed event": `
    ✓ CORRECT:
      const event = new CustomEvent("theme-changed", {
        detail: {
          themeName: theme.themeName,
          layout: activeLayout,
          density: activeDensity,
          source: "host-theme-switch",
          emittedAt: new Date().toISOString()
        },
        bubbles: true,
        composed: true
      });
      window.dispatchEvent(event);
    
    ✗ WRONG:   Not dispatching, so MFEs can't react to theme changes.
  `,

  "5. Resolve active theme using priority order": `
    ✓ CORRECT order:
      1. Check localStorage (ctms:theme-preference)
      2. Check OS preference (prefers-color-scheme media query)
      3. Default to light theme
    
    ✗ WRONG:   Always defaulting to light, ignoring OS and user preference.
  `,
};

/**
 * SECTION 3: WHAT CI MUST ENFORCE
 */
export const CI_OBLIGATIONS = {
  "1. WCAG checks on every theme": `
    - Run contrast validation on every theme, not just the default
    - Validate 4.5:1 for normal text, 3:1 for large text
    - Validate focus ring visibility (3:1 contrast minimum)
    - Validate all theme combinations, not just light mode
    - Block publish if ANY theme fails
  `,

  "2. Token completeness validation": `
    - Every theme MUST declare all required token categories
    - Missing tokens list: See Section 5.2 in Theme Configuration
    - Block publish if any theme is incomplete
  `,

  "3. Layout variant support": `
    - Validate that every theme declares a layout-* class
    - Validate that every theme declares a density class
    - Block if either is missing
  `,

  "4. Bundle size monitoring": `
    - Keep all-themes.js under 50KB (gzipped: 15KB)
    - Alert if new themes would exceed threshold
    - Archive old bundles but never serve them by default
  `,
};

/**
 * SECTION 4: TESTING CHECKLIST FOR QA
 *
 * Before any version is tagged as stable, QA must complete:
 */
export const QA_CHECKLIST = {
  "1. 200% Zoom Test": [
    "Open each theme in browser",
    "Zoom to 200%",
    "Verify: No content cut off",
    "Verify: No horizontal scrollbar",
    "Applies to: All themes",
  ],

  "2. Keyboard Navigation": [
    "Tab through entire page",
    "Verify: Every interactive element has focus ring",
    "Verify: Focus ring is clearly visible in both light/dark",
    "Verify: Tab order is logical",
    "Applies to: All themes",
  ],

  "3. Dark Mode Contrast": [
    "Switch to dark theme",
    "Read every page visually",
    "Verify: Text is readable",
    "Verify: Passing CI numbers != visually correct in context",
    "Applies to: Dark/Ocean/Compact themes",
  ],

  "4. Focus Ring on Coloured Buttons": [
    "Click through every theme",
    "Tab to coloured buttons",
    "Verify: Focus outline visible on coloured background",
    "Applies to: All themes",
  ],

  "5. Keyboard Accessibility": [
    "All theme switching must be keyboard accessible",
    "No time-based interactions",
    "Content must remain accessible at all zoom levels",
  ],

  "6. Layout Variant Matrix": [
    "Switch between layout-sidebar and layout-top-nav",
    "Verify each MFE renders correctly in each",
    "A theme that passes in sidebar may break in top-nav",
    "Matrix = all-themes × all-layout-variants",
  ],
};

/**
 * SECTION 5: EXAMPLE - LISTENING FOR THEME CHANGES
 *
 * MFE use case: A charting library that renders to <canvas>
 * CSS changes don't affect canvas. Listen for theme-changed event.
 */
export const CANVAS_EXAMPLE = `
import { useEffect, useRef } from 'react';

export function ChartComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawChart = (themeName: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Read CSS variables to get current theme colors
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--color-primary').trim();
    const bgColor = style.getPropertyValue('--color-bg').trim();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw using current theme colors
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = primaryColor;
    // ... draw chart elements using theme colors
  };

  useEffect(() => {
    // Draw on mount with current theme
    // Read from CSS variables for active theme
    drawChart('initial');

    // Redraw when theme changes
    const handleThemeChange = (event: CustomEvent) => {
      drawChart(event.detail.themeName);
    };

    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    return () =>
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
  }, []);

  return <canvas ref={canvasRef} width={400} height={300} />;
}
`;

/**
 * SECTION 6: VERSIONING STRATEGY
 *
 * Applies to: Theme catalogue versions
 */
export const VERSIONING_GUIDE = {
  "Major (X.0.0)": "Breaking changes to theme API or token structure",
  "Minor (1.X.0)": "New themes added, new tokens, non-breaking changes",
  "Patch (1.0.X)": "Bug fixes, token value updates, no structure changes",

  "Example Flow": [
    "1. Designer updates color tokens → bump to 1.2.1",
    "2. New Ocean theme added → bump to 1.3.0",
    "3. Breaking API change → bump to 2.0.0",
  ],

  Rollback: [
    "$ npm dist-tag add @ctms/theme@2.0.1 stable",
    "CI detects, rebuilds bundle from 2.0.1, re-uploads to CDN",
    "Old versions never deleted from Verdaccio",
    "Users on next page load receive rolled-back bundle",
  ],
};

/**
 * SECTION 7: TROUBLESHOOTING
 */
export const TROUBLESHOOTING = {
  "Theme not applying": [
    "Verify: Host loaded bundle from stable URL (not versioned)",
    "Verify: CSS variables are set on document.documentElement",
    "Check: Browser DevTools Styles tab for --color-* variables",
    "Open: DevTools Console, run getComputedStyle(document.documentElement).getPropertyValue('--color-primary')",
  ],

  "MFE doesn't reflect theme change": [
    "MFE uses hardcoded colors (should use CSS variables)",
    "MFE CSS imports not loaded when testing locally",
    "MFE needs layout/density CSS but didn't ship them",
    "Check: MFE .module.css uses var(--color-*) syntax",
  ],

  "theme-changed event not firing": [
    "Check: Host is calling applyTheme() in switcher",
    "Check: Browser console for JavaScript errors",
    "Check: Event listener attached BEFORE theme switch",
    "Verify: Event detail has { themeName: 'theme-name' } shape",
  ],

  "Contrast validation failing in CI": [
    "Run locally: npm run theme:validate",
    "Check: All text/background pairs in tokens",
    "Use: WebAIM Contrast Checker tool",
    "Update: Theme token values to meet 4.5:1 minimum",
    "Re-publish: Version bump triggers CI checks again",
  ],
};

/**
 * SECTION 8: SECURITY CONSIDERATIONS
 */
export const SECURITY = {
  "Theme bundle is public":
    "All-themes.js is visible in DevTools. No secrets here.",

  "Design tokens not encrypted":
    "Color hex values, font names, spacing numbers — all visible.",

  "NPM auth tokens":
    "Stored in CI secrets manager. Never appear in code or config.",

  "localStorage keys":
    "ctms:theme-preference is user preference (can be public). ctms:token-cache cleared on logout.",

  "HTTPS only":
    "All bundles served over HTTPS. No MITM interception of theme bundle.",
};

// Export for documentation generation
export const MFE_CONTRACT = {
  MFE_INTEGRATION_EXAMPLE,
  HOST_OBLIGATIONS,
  CI_OBLIGATIONS,
  QA_CHECKLIST,
  CANVAS_EXAMPLE,
  VERSIONING_GUIDE,
  TROUBLESHOOTING,
  SECURITY,
};
