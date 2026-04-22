# Micro Frontend Theme Integration Guide

## Quick Overview

Your micro frontend (`mfe-dashboard`, `mfe-admin`, or `mfe-user-profile`) will automatically receive theme updates when they're published from the main theme repository (`thmc2`).

The theme system provides:

- ✅ **Shared design tokens** (colors, fonts, spacing)
- ✅ **Global CSS variables** that can be used anywhere
- ✅ **React hooks** for theme switching
- ✅ **Automatic sync** from main repository
- ✅ **Cross-MFE theme sync** (changing theme in one MFE updates all MFEs)

---

## Integration Steps

### Step 1: Copy Theme Files to Your MFE

When theme updates are synced from the main repo, a folder `src/theme-shared/` is automatically created in your MFE with all theme files.

Or manually add it as a Git submodule:

```bash
cd your-mfe-repo
git submodule add https://github.com/Mohitsagar236/thmc2.git src/theme-shared
git submodule update --init --recursive
```

### Step 2: Update `tailwind.config.js`

If your MFE uses Tailwind CSS, extend the shared theme config:

```javascript
// tailwind.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedConfig = () => {
  try {
    return require("./src/theme-shared/tailwind.config.js");
  } catch {
    // Fallback if theme not yet synced
    return {};
  }
};

export default {
  ...sharedConfig(),
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/theme-shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
    },
  },
};
```

### Step 3: Wrap App with ThemeProvider

In your main entry file, wrap the app with the ThemeProvider:

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./theme-shared/provider";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
```

### Step 4: Use Theme in Components

#### Option A: React Hook (Recommended)

```tsx
import { useTheme } from "../theme-shared/hooks";

export function ThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="p-4">
      <h2>Theme: {currentTheme}</h2>

      <select
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-2 py-1 rounded border border-[var(--color-border)]"
      >
        {availableThemes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

#### Option B: CSS Variables (Universal)

In any HTML or styled component:

```css
/* src/styles/my-component.css */
.my-component {
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  font-family: var(--font-family-base);
}

.button-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
}
```

#### Option C: Tailwind + CSS Variables

```tsx
<div className="bg-[var(--color-surface)] text-[var(--color-text)] p-[var(--spacing-md)] rounded-lg">
  <h3 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)]">
    Styled with theme variables
  </h3>
</div>
```

---

## Available Theme Tokens

### Colors

| Variable             | Purpose                   |
| -------------------- | ------------------------- |
| `--color-primary`    | Primary brand color       |
| `--color-secondary`  | Secondary brand color     |
| `--color-bg`         | Page background           |
| `--color-surface`    | Card/component background |
| `--color-text`       | Primary text color        |
| `--color-text-muted` | Secondary/muted text      |
| `--color-error`      | Error/alert color         |
| `--color-success`    | Success color             |
| `--color-warning`    | Warning color             |
| `--color-info`       | Info color                |
| `--color-border`     | Border/divider color      |
| `--color-focus`      | Focus ring color          |

### Typography

| Variable                 | Purpose                  |
| ------------------------ | ------------------------ |
| `--font-family-base`     | Base font family         |
| `--font-size-base`       | Base size (usually 16px) |
| `--font-size-sm`         | Small (12-13px)          |
| `--font-size-lg`         | Large (18-20px)          |
| `--font-size-xl`         | Extra large (24px)       |
| `--font-weight-regular`  | Regular (400)            |
| `--font-weight-medium`   | Medium (500)             |
| `--font-weight-semibold` | Semibold (600)           |
| `--line-height-base`     | Base line height         |

### Spacing

| Variable       | Value |
| -------------- | ----- |
| `--spacing-xs` | 4px   |
| `--spacing-sm` | 8px   |
| `--spacing-md` | 16px  |
| `--spacing-lg` | 24px  |
| `--spacing-xl` | 32px  |

### Layout

| Variable                | Purpose             |
| ----------------------- | ------------------- |
| `--sidebar-width`       | Sidebar width       |
| `--header-height`       | Header height       |
| `--container-max-width` | Max container width |

### Accessibility

| Variable              | Purpose                   |
| --------------------- | ------------------------- |
| `--focus-ring-width`  | Focus ring border width   |
| `--focus-ring-offset` | Focus ring offset         |
| `--min-target-size`   | Minimum touch target size |

---

## Cross-MFE Theme Synchronization

When a user changes the theme in **any micro frontend**, **all MFEs instantly reflect the change**.

### How It Works

1. **User changes theme in mfe-dashboard**

   ```tsx
   const { setTheme } = useTheme();
   setTheme("dark"); // User clicks theme switcher
   ```

2. **Theme is saved and broadcast**

   ```tsx
   // In src/theme-shared/switcher.ts
   localStorage.setItem("theme-preference", "dark");
   window.dispatchEvent(
     new CustomEvent("theme-changed", { detail: { theme: "dark" } }),
   );
   ```

3. **All other open MFEs listen and update**

   ```tsx
   // In mfe-admin and mfe-user-profile
   window.addEventListener("theme-changed", (e) => {
     applyTheme(e.detail.theme);
   });
   ```

4. **Result:** ✅ All MFEs instantly switch to dark theme

---

## Automatic Theme Updates

### What Happens When Theme Changes in Main Repo

1. **Developer updates theme** in `thmc2` repository
   - Changes colors in `src/theme/themes/dark.ts`
   - Updates layout in `tailwind.config.js`

2. **Push to develop branch** triggers GitHub Actions

   ```bash
   git push origin develop
   ```

3. **Automated workflow** in `.github/workflows/theme-sync.yml`:
   - Builds the theme bundle
   - Validates all themes
   - Updates each MFE automatically

4. **Each MFE gets updates** in `src/theme-shared/`
   - New theme files
   - Updated Tailwind config
   - Version metadata

5. **Review and merge** the automatic pull request
   - You'll see a PR in your MFE repo
   - Review the changes
   - Merge to deploy

---

## Troubleshooting

### Theme Variables Not Applying

**Symptom:** Colors and spacing not updating

**Solution:**

```tsx
// Make sure ThemeProvider wraps your entire app
<ThemeProvider>
  <App />
</ThemeProvider>

// Check browser console for CSS errors
// Verify src/theme-shared folder exists
ls src/theme-shared/  // Linux/Mac
dir src\theme-shared  // Windows
```

### Theme Not Syncing from Main Repo

**Symptom:** No PR received after theme changes in main repo

**Check:**

1. Monitor GitHub Actions in main repo
2. Check network tabs if using proxy
3. Verify `.mfe-config.json` has correct repo URL
4. Check git credentials for push access

### Submodule Not Updating

**To manually update the Git submodule:**

```bash
git submodule update --remote --merge
```

### CSS Variables Not Found

**Symptom:** CSS linter complains about `--color-primary` etc.

**Solution:** Create `.stylelintignore` or disable rule:

```bash
# .stylelintignore
src/theme-shared/
```

Or in CSS/SCSS:

```scss
/* stylelint-disable property-no-unknown */
.myclass {
  color: var(--color-text);
}
```

### Theme Hooks Not Working

**Symptom:** `useTheme` hook undefined

**Make sure:**

1. Component is inside `<ThemeProvider>`
2. Import path is correct: `src/theme-shared/hooks`
3. Running in browser (not SSR context)

---

## Best Practices

### ✅ DO:

- Use CSS variables for all theme-dependent styles
- Use `useTheme` hook for dynamic theme logic
- Wrap app root with ThemeProvider
- Keep theme-shared as read-only (don't edit manually)
- Use automatic sync (GitHub Actions)

### ❌ DON'T:

- Hardcode colors instead of using CSS variables
- Modify `src/theme-shared/` files directly
- Override theme styles without good reason
- Ignore theme update PRs

---

## Example Components

### Theme Switcher Button

```tsx
import { useTheme } from "../theme-shared/hooks";

export function ThemeSwitcherButton() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="flex gap-2">
      {availableThemes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setTheme(theme.id)}
          className={`
            px-3 py-1 rounded transition-all
            ${
              currentTheme === theme.id
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-border)] text-[var(--color-text)]"
            }
          `}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
```

### Card Component Using Theme

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div
      className="rounded-lg shadow-sm"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        padding: "var(--spacing-md)",
        borderColor: "var(--color-border)",
        borderWidth: "1px",
      }}
    >
      <h3
        style={{
          fontSize: "var(--font-size-lg)",
          fontWeight: "var(--font-weight-semibold)",
          marginBottom: "var(--spacing-sm)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
```

---

## Support & Questions

- **Main theme repo:** https://github.com/Mohitsagar236/thmc2
- **Documentation:** See `CROSS_REPO_THEME_SETUP.md` in main repo
- **Issues:** Create issue with `[MFE-Integration]` prefix
- **Theme version:** Check `src/theme-shared/version.ts` in your MFE

---

**Last Updated:** April 2026
**Compatible Theme Versions:** 2.2.0+
