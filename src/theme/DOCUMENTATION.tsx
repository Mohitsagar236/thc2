/**
 * Theme System Documentation
 * Theme Configuration for Micro Frontend Applications
 *
 * This file is a React component that can be rendered as documentation
 */

export function ThemeSystemDocs() {
  return (
    <div style={{ padding: "32px", fontFamily: "var(--font-family-base)" }}>
      <h1>Theme Configuration System</h1>
      <p>
        Complete implementation of runtime theme switching for micro frontend
        applications with WCAG 2.2 AA compliance.
      </p>

      <h2>Architecture</h2>

      <h3>Pipeline Flow</h3>
      <ol>
        <li>Designer/developer updates token values or adds theme</li>
        <li>CI runs WCAG 2.2 AA contrast checks on all color combinations</li>
        <li>Bundle compiled into all-themes.js</li>
        <li>Uploaded to CDN with versioned and stable URLs</li>
        <li>Host app loads bundle once, users pick up changes on reload</li>
      </ol>

      <h3>Runtime Flow</h3>
      <ol>
        <li>Host app loads theme bundle from CDN on startup</li>
        <li>Theme dropdown populated from loaded bundle</li>
        <li>User selects theme</li>
        <li>applyTheme() sets CSS custom properties and layout classes</li>
        <li>All MFEs reflect change instantly via CSS inheritance</li>
        <li>Selection persisted to localStorage</li>
      </ol>

      <h2>API Reference</h2>

      <h3>useTheme() Hook</h3>
      <pre>{`
import { useTheme } from '@/theme';

function MyComponent() {
  const { currentTheme, themes, setTheme } = useTheme();
  
  return (
    <select value={currentTheme} onChange={(e) => setTheme(e.target.value)}>
      {themes.map(t => <option key={t.themeName}>{t.meta.label}</option>)}
    </select>
  );
}
      `}</pre>

      <h3>applyTheme() Function</h3>
      <pre>{`
import { applyTheme } from '@/theme';

// Apply theme directly
applyTheme(lightTheme);

// Sets CSS variables, layout classes, saves to localStorage,
// and dispatches theme-changed event
      `}</pre>

      <h3>Utility Functions</h3>
      <ul>
        <li>
          <code>resolveInitialTheme()</code> - Resolve theme on startup using
          preference order
        </li>
        <li>
          <code>getOSColorScheme()</code> - Get system light/dark preference
        </li>
        <li>
          <code>onOSColorSchemeChange()</code> - Listen for OS preference
          changes
        </li>
        <li>
          <code>getSavedThemePreference()</code> - Get user's saved theme name
        </li>
        <li>
          <code>cacheThemeBundle()</code> - Cache bundle for CDN fallback
        </li>
      </ul>

      <h2>CSS Custom Properties</h2>

      <h3>Available Tokens</h3>
      <dl>
        <dt>Colors</dt>
        <dd>
          --color-primary, --color-secondary, --color-bg, --color-surface,
          --color-text, --color-text-muted, --color-error, --color-success,
          --color-warning, --color-info, --color-border, --color-focus
        </dd>

        <dt>Typography</dt>
        <dd>
          --font-family-base, --font-size-base, --font-size-lg, --font-size-sm,
          --font-size-xl, --font-weight-regular, --font-weight-medium,
          --font-weight-semibold, --line-height-base
        </dd>

        <dt>Spacing</dt>
        <dd>
          --spacing-unit, --spacing-xs, --spacing-sm, --spacing-md,
          --spacing-lg, --spacing-xl, --card-padding
        </dd>

        <dt>Layout</dt>
        <dd>
          --sidebar-width, --header-height, --container-max-width,
          --focus-ring-width, --focus-ring-offset, --min-target-size
        </dd>
      </dl>

      <h2>Implementation Checklist</h2>

      <h3>✓ What's Included</h3>
      <ul>
        <li>4 complete themes: Light, Dark, Ocean, Compact</li>
        <li>CSS custom properties for colors, typography, spacing, layout</li>
        <li>Layout variants: layout-sidebar, layout-top-nav</li>
        <li>Density variants: density-compact, density-comfortable</li>
        <li>WCAG 2.2 AA accessibility compliance</li>
        <li>Dark mode with OS preference detection</li>
        <li>localStorage persistence</li>
        <li>React Context provider and hooks</li>
        <li>Theme switcher component</li>
        <li>Example themed components</li>
      </ul>

      <h3>Requirements for MFEs</h3>
      <ul>
        <li>
          Use CSS custom properties exclusively for colors, typography, spacing:{" "}
          <code>color: var(--color-primary)</code> NOT{" "}
          <code>color: #2563EB</code>
        </li>
        <li>Ship CSS for all layout variant and density classes</li>
        <li>Never load the theme bundle independently</li>
        <li>Never write to ctms:theme-preference or ctms:token-cache</li>
        <li>
          Optionally listen for theme-changed custom event for programmatic
          reactions
        </li>
      </ul>

      <h2>Accessibility Compliance</h2>

      <h3>Automated CI Checks</h3>
      <ul>
        <li>Colour contrast - text requires 4.5:1, large text 3:1</li>
        <li>Focus ring - minimum 2px wide with 3:1 contrast</li>
        <li>Target size - interactive elements minimum 44×44px (WCAG 2.5.8)</li>
        <li>Token completeness - all required tokens in all themes</li>
      </ul>

      <h3>Manual Testing Before Release</h3>
      <ul>
        <li>200% zoom - no cutoff, no horizontal scroll</li>
        <li>Keyboard navigation - all interactive elements reachable</li>
        <li>Dark mode contrast - verify readability in context</li>
        <li>Focus rings - visible on all colored buttons</li>
        <li>Layout variants - test every theme × every layout combination</li>
      </ul>

      <h2>Storage Keys</h2>
      <dl>
        <dt>ctms:theme-preference</dt>
        <dd>User's selected theme name (persists on logout)</dd>

        <dt>ctms:token-cache</dt>
        <dd>Last loaded theme bundle (cleared on logout)</dd>
      </dl>

      <h2>Caching Strategy</h2>

      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Location</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Duration</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Purpose</th>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <td style={{ padding: "8px" }}>CDN - versioned URL</td>
            <td style={{ padding: "8px" }}>Forever</td>
            <td style={{ padding: "8px" }}>Points to immutable version</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <td style={{ padding: "8px" }}>CDN - stable URL</td>
            <td style={{ padding: "8px" }}>60 seconds</td>
            <td style={{ padding: "8px" }}>
              Updated when new version published
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <td style={{ padding: "8px" }}>Browser memory</td>
            <td style={{ padding: "8px" }}>Session lifetime</td>
            <td style={{ padding: "8px" }}>Loaded bundle in memory</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>localStorage</td>
            <td style={{ padding: "8px" }}>Persistent</td>
            <td style={{ padding: "8px" }}>CDN fallback on cold load</td>
          </tr>
        </tbody>
      </table>

      <h2>Versioning</h2>
      <p>Follows standard NPM semver.</p>
      <ul>
        <li>
          <code>npm publish</code> - publishes new version after WCAG checks
        </li>
        <li>
          <code>npm dist-tag add @ctms/theme@2.1.0 stable</code> - tag version
          as stable
        </li>
        <li>
          <code>npm dist-tag add @ctms/theme@2.0.1 stable</code> - rollback to
          previous
        </li>
      </ul>

      <h2>Integration Example</h2>

      <h3>Basic App Setup</h3>
      <pre>{`
// main.tsx
import { ThemeProvider, injectThemeStyles } from '@/theme';

injectThemeStyles();

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
      `}</pre>

      <h3>Component Using Themes</h3>
      <pre>{`
// MyComponent.tsx
function MyComponent() {
  const { currentTheme, setTheme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text)',
      padding: 'var(--card-padding)',
    }}>
      <h1 style={{ fontSize: 'var(--font-size-lg)' }}>
        Current: {currentTheme}
      </h1>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
      `}</pre>

      <h3>CSS Module Using Variables</h3>
      <pre>{`
/* MyComponent.module.css */
.card {
  padding: var(--card-padding);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: all 200ms ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Density support */
body.density-compact .card {
  padding: var(--spacing-sm);
}
      `}</pre>

      <h2>Event Listening</h2>
      <p>MFEs can react to theme changes programmatically:</p>
      <pre>{`
useEffect(() => {
  const handleThemeChange = (e: CustomEvent) => {
    console.log('Theme changed to:', e.detail.themeName);
    // Re-render canvas elements, charts, etc. that don't respond to CSS
  };
  
  window.addEventListener('theme-changed', handleThemeChange);
  return () => window.removeEventListener('theme-changed', handleThemeChange);
}, []);
      `}</pre>

      <h2>Troubleshooting</h2>

      <h3>CSS Variables Not Applying</h3>
      <ul>
        <li>Verify ThemeProvider wraps entire application</li>
        <li>Check that components use var() in CSS, not hardcoded values</li>
        <li>Ensure injectThemeStyles() called before app renders</li>
        <li>Check browser DevTools - should see --color-* on :root element</li>
      </ul>

      <h3>Theme Selection Not Persisting</h3>
      <ul>
        <li>Check browser localStorage is enabled</li>
        <li>Verify ctms:theme-preference key exists after theme change</li>
        <li>Check browser console for localStorage quota errors</li>
      </ul>

      <h3>MFE Not Reflecting Theme Change</h3>
      <ul>
        <li>Verify MFE CSS uses var() for all colors, spacing, fonts</li>
        <li>Ensure MFE has CSS selectors for layout and density classes</li>
        <li>Check that theme-changed event listener is registered if needed</li>
        <li>
          Verify CSS cascade - no !important overrides on custom properties
        </li>
      </ul>
    </div>
  );
}
