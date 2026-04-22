# Cross-Repository Theme Sharing System

## Overview

This system enables **theme and layout changes in the main `thmc2` repository to automatically sync across all micro frontends** in different GitHub repositories.

### Architecture

```
thmc2 (Main Theme Package)
├── src/theme/
├── tailwind.config.js
├── .github/workflows/theme-sync.yml (CI/CD automation)
└── scripts/setup-cross-repo-sync.js

    ↓ Auto-syncs when changed ↓

mfe-dashboard (via Git/Actions)
mfe-admin (via Git/Actions)
mfe-user-profile (via Git/Actions)

Each gets: src/theme-shared/ (theme files + config)
```

## 🚀 Quick Start

### 1. Initialize Cross-Repo Sync Setup

```bash
# From the main theme repo (thmc2)
npm run sync:setup
```

This creates:

- `.mfe-config.json` - Configuration of all connected MFEs
- `.github/workflows/theme-sync.yml` - Automatic CI/CD workflow
- `scripts/sync-theme-to-mfes.sh` - Manual sync script
- `MFE_INTEGRATION_GUIDE.md` - How to integrate in each MFE

### 2. Commit the Setup Files

```bash
git add .mfe-config.json .github/workflows/ scripts/setup-cross-repo-sync.js
git commit -m "chore: setup cross-repo theme sharing"
git push origin develop
```

### 3. Integrate Each MFE

For each micro frontend (`mfe-dashboard`, `mfe-admin`, `mfe-user-profile`):

#### Option A: Git Submodule (for local development)

```bash
cd your-mfe-repo
git submodule add https://github.com/Mohitsagar236/thmc2.git src/theme-shared
```

#### Option B: Wait for Automatic Sync (for production)

When you push changes to the main theme repo, GitHub Actions automatically:

1. Builds the theme bundle
2. Creates PRs in each MFE with theme updates
3. You review and merge the PR

## 📋 Configuration

Edit `.mfe-config.json` to manage MFE repositories:

```json
{
  "theme_package": "@ctms/theme",
  "theme_version": "2.2.0",
  "mfes": [
    {
      "name": "mfe-dashboard",
      "url": "https://github.com/Mohitsagar236/mfe-dashboard.git",
      "branch": "develop",
      "enabled": true
    }
    // ... more MFEs
  ],
  "sync": {
    "enabled": true,
    "method": "git-submodule",
    "auto_update": false
  }
}
```

### Adding a New MFE

```bash
npm run sync:add-mfe https://github.com/owner/new-mfe.git new-mfe-name
```

This updates `.mfe-config.json` and triggers a sync.

## 🔄 How Theme Changes Sync

### Automatic (Recommended)

**When:**

- You push changes to the `develop` branch
- Theme files are modified (`src/theme/**`, `tailwind.config.js`, `package.json`)

**What happens:**

1. `.github/workflows/theme-sync.yml` triggers
2. Theme bundle is built
3. Each MFE repo gets a commit with updated files in `src/theme-shared/`
4. Optional: Create pull requests for review

**Result:** All MFEs automatically have latest theme within minutes

### Manual Sync

If automatic sync is disabled or for immediate testing:

```bash
npm run sync:mfes
```

This script:

1. Builds the theme bundle
2. Clones each MFE repo
3. Updates `src/theme-shared/` with latest theme files
4. Pushes changes to each MFE

## 📦 What Gets Synced

When theme changes are synced, the following files are updated in each MFE:

```
src/theme-shared/
├── themes/
│   ├── light.ts
│   ├── dark.ts
│   ├── ocean.ts
│   └── compact.ts
├── hooks/
│   ├── useTheme.ts
│   └── useLayoutConfig.ts
├── provider.tsx
├── context.ts
├── types.ts
├── styles.ts
├── switcher.ts
├── loader.ts
└── version.ts (auto-generated with sync timestamp)

tailwind.config.js (copied to theme-shared/)
```

## 🎨 Using Shared Theme in MFE

Each MFE uses the synced theme like this:

### 1. Wrap App with ThemeProvider

```tsx
// src/main.tsx
import { ThemeProvider } from "./theme-shared/provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
```

### 2. Use Theme Hooks

```tsx
import { useTheme } from "../theme-shared/hooks";

export function MyComponent() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div style={{ color: "var(--color-text)" }}>Current: {currentTheme}</div>
  );
}
```

### 3. CSS Variables Apply Automatically

All theme changes apply globally via CSS variables:

- `--color-primary`
- `--color-text`
- `--spacing-md`
- etc.

When user switches theme in ANY micro frontend, **all MFEs instantly update** (via localStorage and custom events).

## 🔐 Cross-Browser Theme Sync

Themes are synced across all open MFE tabs/windows:

```ts
// When user changes theme in one MFE
localStorage.setItem("theme-preference", "dark");
window.dispatchEvent(
  new CustomEvent("theme-changed", { detail: { theme: "dark" } }),
);

// All other MFEs listen and update instantly
window.addEventListener("theme-changed", (e) => {
  applyTheme(e.detail.theme);
});
```

## 🛠️ Troubleshooting

### Theme files not syncing

**Check:**

1. `.github/workflows/theme-sync.yml` exists
2. Workflow is enabled in GitHub Actions
3. Theme files were actually changed (`src/theme/**`)
4. Check workflow run logs for errors

```bash
# Force manual sync
npm run sync:mfes
```

### MFE not updating

**Check:**

1. `.mfe-config.json` has correct repo URL
2. Branch name is correct (usually `develop`)
3. Git credentials have push access

### Theme variables not working in MFE

**Check:**

1. ThemeProvider wraps the entire app
2. `src/theme-shared/` folder exists
3. Tailwind config includes theme-shared in content paths

## 📊 Status Commands

```bash
# See current sync status
cat .mfe-config.json | grep last_sync

# View workflow logs
# Visit: https://github.com/Mohitsagar236/thmc2/actions

# Check MFE config
cat .mfe-config.json
```

## 🔄 Sync Workflow Details

### GitHub Actions Workflow File

See `.github/workflows/theme-sync.yml` for the automated workflow that:

- Runs on push to `develop` with theme changes
- Builds the theme bundle
- Updates all connected MFEs
- Optionally creates pull requests
- Sends notifications via webhook

### Manual Sync Script

See `scripts/sync-theme-to-mfes.sh` for:

- Cloning MFE repos
- Copying theme files
- Creating commits with version info
- Pushing to each branch

## 🚨 Important Notes

1. **GitHub Token Permissions:** Workflows need push access to MFE repos
2. **Branch Protection:** If MFEs have branch protection, PRs will be created instead of direct pushes
3. **Credentials:** Set up SSH keys or tokens for git operations
4. **Version Tracking:** Each sync updates version.ts in theme-shared/

## 📚 Related Documentation

- `MFE_INTEGRATION_GUIDE.md` - How to integrate in each MFE
- `PACKAGE_JSON_UPDATES.md` - Required package.json changes
- `.mfe-config.json` - Configuration reference
- `.github/workflows/theme-sync.yml` - CI/CD workflow details

## 🎯 Next Steps

1. ✅ Run `npm run sync:setup`
2. ✅ Commit and push to develop
3. ✅ Wait for GitHub Actions to sync theme to MFEs
4. ✅ Or manually run `npm run sync:mfes`
5. ✅ Check each MFE for `src/theme-shared/` folder
6. ✅ Integrate in each MFE following `MFE_INTEGRATION_GUIDE.md`

---

**Questions?** Check `MFE_INTEGRATION_GUIDE.md` or create an issue with \`[CROSS-REPO-SYNC]\` prefix.
