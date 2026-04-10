/**
 * Layout Variants Documentation & Implementation Guide
 *
 * This document explains how layout variants (sidebar vs top-nav)
 * and density modes (compact vs comfortable) work in the theme system.
 *
 * All MFEs MUST implement CSS for every layout variant and density
 * mode included in the theme catalogue.
 */

// ============================================================================
// PART 1: LAYOUT VARIANTS OVERVIEW
// ============================================================================

export const LAYOUT_VARIANTS_OVERVIEW = `
The theme system supports structural layout variations through CSS classes
applied to the document body. The runtime switcher applies the correct class
based on the selected theme's layout property.

Two layout variants are currently supported:
1. layout-sidebar — Traditional sidebar navigation on the left
2. layout-top-nav — Navigation bar fixed at the top

Every MFE must ship CSS for all layout variants, even if they currently
only support one. This allows for future layout expansion without code changes.
`;

// ============================================================================
// PART 2: LAYOUT-SIDEBAR IMPLEMENTATION
// ============================================================================

export const LAYOUT_SIDEBAR_CSS = `
/* Every MFE must include this CSS */
.layout-sidebar {
  /* Sidebar takes up this much width as defined in theme tokens */
  --mfe-sidebar-width: var(--sidebar-width, 240px);
  
  /* Main grid: sidebar | content */
}

/* Container component example */
.layout-sidebar .mfe-container {
  display: grid;
  grid-template-columns: var(--mfe-sidebar-width) 1fr;
  gap: 0;
  height: 100vh;
}

.layout-sidebar .mfe-sidebar {
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  width: var(--mfe-sidebar-width);
  padding: var(--spacing-lg);
}

.layout-sidebar .mfe-main {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--color-bg);
}

.layout-sidebar .mfe-header {
  height: var(--header-height);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
}

.layout-sidebar .mfe-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

/* At smaller screens, sidebar can collapse or become a modal */
@media (max-width: 768px) {
  .layout-sidebar .mfe-container {
    grid-template-columns: 1fr;
  }
  
  .layout-sidebar .mfe-sidebar {
    position: fixed;
    left: -100%;
    width: var(--mfe-sidebar-width);
    height: 100vh;
    z-index: 1000;
    transition: left 300ms ease;
  }
  
  .layout-sidebar .mfe-sidebar.open {
    left: 0;
  }
}
`;

// ============================================================================
// PART 3: LAYOUT-TOP-NAV IMPLEMENTATION
// ============================================================================

export const LAYOUT_TOP_NAV_CSS = `
/* Every MFE must include this CSS */
.layout-top-nav {
  /* Header height as defined in theme tokens */
  --mfe-header-height: var(--header-height, 64px);
}

/* Container component example */
.layout-top-nav .mfe-container {
  display: grid;
  grid-template-rows: var(--mfe-header-height) 1fr;
  height: 100vh;
}

.layout-top-nav .mfe-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.layout-top-nav .mfe-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.layout-top-nav .mfe-main {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--color-bg);
}

.layout-top-nav .mfe-sidebar {
  display: none; /* Hidden in top-nav layout */
}

.layout-top-nav .mfe-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

/* Optional: Sticky header */
.layout-top-nav .mfe-header {
  position: sticky;
  top: 0;
  z-index: 100;
}
`;

// ============================================================================
// PART 4: DENSITY VARIANTS
// ============================================================================

export const DENSITY_VARIANTS = `
Density controls the "visual breathing room" of the interface.

Two density modes are supported:
1. density-comfortable — Default, spacious layout (default for Light/Dark/Ocean)
2. density-compact — Dense information display (used in Compact theme)

Density is applied as a class on the body element alongside the layout class.

Example: 
- Light theme → layout-sidebar + density-comfortable
- Compact theme → layout-sidebar + density-compact

Changes to spacing, font sizes, and target sizes occur proportionally.
`;

export const DENSITY_COMFORTABLE_CSS = `
/* Comfortable (default) density - more breathing room */
.density-comfortable {
  --mfe-padding: var(--spacing-lg, 16px);
  --mfe-gap: var(--spacing-md, 12px);
  --mfe-font-size: var(--font-size-base, 16px);
  --mfe-line-height: var(--line-height-base, 1.5);
}

.density-comfortable .mfe-card {
  padding: var(--mfe-padding);
  margin-bottom: var(--mfe-gap);
}

.density-comfortable .mfe-button {
  padding: var(--spacing-md) var(--spacing-lg);
  min-height: 44px; /* WCAG target size */
  font-size: var(--mfe-font-size);
}

.density-comfortable .mfe-input {
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 44px;
  font-size: var(--mfe-font-size);
}

.density-comfortable .mfe-list-item {
  padding: var(--spacing-md) var(--spacing-lg);
  line-height: var(--mfe-line-height);
}
`;

export const DENSITY_COMPACT_CSS = `
/* Compact density - dense information display */
.density-compact {
  --mfe-padding: var(--card-padding, 12px);
  --mfe-gap: var(--spacing-sm, 8px);
  --mfe-font-size: var(--font-size-sm, 14px);
  --mfe-line-height: 1.4;
}

.density-compact .mfe-card {
  padding: var(--mfe-padding);
  margin-bottom: var(--mfe-gap);
}

.density-compact .mfe-button {
  padding: var(--spacing-xs) var(--spacing-sm);
  min-height: 32px; /* Smaller but still accessible */
  font-size: var(--mfe-font-size);
}

.density-compact .mfe-input {
  padding: var(--spacing-xs) var(--spacing-sm);
  min-height: 32px;
  font-size: var(--mfe-font-size);
}

.density-compact .mfe-list-item {
  padding: var(--spacing-sm) var(--spacing-md);
  line-height: var(--mfe-line-height);
}

.density-compact .mfe-header {
  height: var(--header-height); /* Uses compact header height from theme */
}
`;

// ============================================================================
// PART 5: COMBINED LAYOUT + DENSITY EXAMPLES
// ============================================================================

export const COMBINED_EXAMPLE = `
An MFE might have CSS rules like:

/* Base styles */
.mfe-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

/* Layout variants */
.layout-sidebar .mfe-container {
  grid-template-columns: 240px 1fr;
}

.layout-top-nav .mfe-container {
  grid-template-rows: var(--header-height) 1fr;
}

/* Density variants */
.density-comfortable .mfe-card {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.density-compact .mfe-card {
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

/* Combined: layout + density */
.layout-sidebar.density-comfortable .mfe-content {
  padding: var(--spacing-lg);
}

.layout-sidebar.density-compact .mfe-content {
  padding: var(--spacing-sm);
}

.layout-top-nav.density-comfortable .mfe-content {
  max-width: 1280px;
  padding: var(--spacing-lg);
  margin: 0 auto;
}

.layout-top-nav.density-compact .mfe-content {
  max-width: 1400px;
  padding: var(--spacing-md);
  margin: 0 auto;
}
`;

// ============================================================================
// PART 6: QA TESTING MATRIX
// ============================================================================

export const QA_TESTING_MATRIX = `
Before any theme version is tagged as stable, QA must test every
combination of layout variant and density mode:

Layout Variants × Density Modes = Test Cases

For 2 layout variants and 2 density modes:
Light theme: 2 × 2 = 4 test cases
Dark theme: 2 × 2 = 4 test cases
Ocean theme: 2 × 2 = 4 test cases
Compact theme: 2 × 2 = 4 test cases (though Compact theme uses compact density)

TOTAL = 16 test cases minimum per MFE

Test matrix:
┌─────────────────┬──────────────────┬──────────────────┐
│ Theme           │ layout-sidebar   │ layout-top-nav   │
├─────────────────┼──────────────────┼──────────────────┤
│ Light +         │ ✓ Test this      │ ✓ Test this      │
│ comfortable     │                  │                  │
│ Light +         │ ✓ Test this      │ ✓ Test this      │
│ compact         │ (if supported)   │ (if supported)   │
├─────────────────┼──────────────────┼──────────────────┤
│ Dark +          │ ✓ Test this      │ ✓ Test this      │
│ comfortable     │                  │                  │
│ Dark +          │ ✓ Test this      │ ✓ Test this      │
│ compact         │ (if supported)   │ (if supported)   │
├─────────────────┼──────────────────┼──────────────────┤
│ Ocean +         │ ✓ Test this      │ ✓ Test this      │
│ comfortable     │                  │                  │
│ Ocean +         │ ✓ Test this      │ ✓ Test this      │
│ compact         │ (if supported)   │ (if supported)   │
├─────────────────┼──────────────────┼──────────────────┤
│ Compact +       │ ✓ Test this      │ ✓ Test this      │
│ compact         │                  │                  │
└─────────────────┴──────────────────┴──────────────────┘

Checklist for each combination:
□ No horizontal scrollbar at 320px viewport width
□ All text readable (font size appropriate)
□ Interactive elements have proper spacing (not too close)
□ Sidebar doesn't overlap content (if sidebar layout)
□ Header height appropriate for content
□ No content cutoff or clipped
□ Focus rings visible and properly positioned
`;

// ============================================================================
// PART 7: BEST PRACTICES
// ============================================================================

export const LAYOUT_BEST_PRACTICES = `
1. Use CSS custom properties for ALL sizing
   ✓ width: var(--sidebar-width)
   ✓ padding: var(--spacing-lg)
   ✗ width: 240px
   ✗ padding: 16px

2. Apply layout classes on body, use descendant selectors
   .layout-sidebar .mfe-container { /* changes apply to all MFE containers */ }

3. Provide CSS for all variations, even if only one is currently used
   This future-proofs your MFE if layout variants expand

4. Test responsive behavior (320px, 768px, 1024px breakpoints)
   Layouts should gracefully degrade on small screens

5. Always include minimum target sizes
   - Normal (comfortable): 44×44px minimum
   - Compact: 32×32px minimum (still accessible)

6. Use CSS Grid or Flexbox, never absolute positioning
   Makes responsive design easier

7. Don't hardcode header/sidebar widths
   They come from CSS variables set by the theme

8. Document which layout variants and density modes your MFE supports
   "Supports: sidebar, top-nav with comfortable and compact density"

9. Test keyboard navigation in all layout/density combinations
   Focus order should remain logical regardless of layout

10. Use semantic HTML (nav, main, aside, header)
    Makes layout intentions clear and aids accessibility
`;

// ============================================================================
// PART 8: TROUBLESHOOTING
// ============================================================================

export const LAYOUT_TROUBLESHOOTING = `
Problem: Sidebar appears below content instead of beside it
Solution: Check grid-template-columns is set correctly in layout-sidebar

Problem: Header disappears when switching layouts
Solution: Verify header-height token is applied in both layouts

Problem: Spacing changes but layout doesn't switch
Solution: Check body element has layout-* class applied (DevTools inspect)

Problem: Sidebar overlaps content on mobile
Solution: Add @media rule to hide sidebar or make it a modal

Problem: Text becomes unreadable in compact density
Solution: font-size-sm token might be too small; use 13-14px minimum

Problem: Focus rings invisible in compact mode
Solution: Ensure --color-focus has 3:1 contrast against backgrounds

Problem: Layout works in sidebar but breaks in top-nav
Solution: Check MFE doesn't hardcode left margin or padding-top
         Should use grid positioning instead of absolute values
`;

export const LAYOUT_VARIANTS_GUIDE = {
  LAYOUT_VARIANTS_OVERVIEW,
  LAYOUT_SIDEBAR_CSS,
  LAYOUT_TOP_NAV_CSS,
  DENSITY_VARIANTS,
  DENSITY_COMFORTABLE_CSS,
  DENSITY_COMPACT_CSS,
  COMBINED_EXAMPLE,
  QA_TESTING_MATRIX,
  LAYOUT_BEST_PRACTICES,
  LAYOUT_TROUBLESHOOTING,
};
