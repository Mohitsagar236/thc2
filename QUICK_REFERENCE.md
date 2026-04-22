# Quick Reference: Cross-Repo Theme Sharing

## 📋 One-Page Quick Start

### For Main Theme Repo (thmc2)

#### First Time Setup

```bash
npm run sync:setup
git add .mfe-config.json .github/
git commit -m "chore: setup cross-repo theme sharing"
git push origin develop
```

#### Make Theme Change

```bash
# Edit theme files
code src/theme/themes/dark.ts
code tailwind.config.js

# Commit and push
git push origin develop
# ✅ GitHub Actions automatically syncs to all MFEs
```

#### Manual Sync (if needed)

```bash
# Windows
npm run sync:mfes

# Linux/Mac
bash scripts/sync-theme-to-mfes.sh
```

#### Add New MFE

```bash
npm run sync:add-mfe <repo-url> <mfe-name>
git push origin develop
```

---

### For Each Micro Frontend (mfe-dashboard, mfe-admin, mfe-user-profile)

#### Initial Integration

```bash
# Option A: Git Submodule
git submodule add https://github.com/Mohitsagar236/thmc2.git src/theme-shared

# Option B: Wait for automatic sync (recommended)
# Theme files will be auto-synced to src/theme-shared/
```

#### Wrap App with Theme Provider

```tsx
// src/main.tsx
import { ThemeProvider } from "./theme-shared/provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
```

#### Use in Components

```tsx
import { useTheme } from "../theme-shared/hooks";

const { currentTheme, setTheme, availableThemes } = useTheme();
```

#### CSS Variables

```css
.component {
  color: var(--color-text);
  background: var(--color-surface);
  padding: var(--spacing-md);
}
```

#### Merge Theme Update PR

```bash
git checkout develop
git pull origin develop  # Get the PR
npm run build
npm run deploy
```

---

## 🔄 How Theme Changes Flow

```
Main Theme Repo (thmc2)
    ↓ (developer pushes theme changes)
GitHub Actions Workflow
    ↓ (validates, builds, syncs)
Each MFE Repo (auto-updated)
    ↓ (you review and merge PR)
Production Deployment
    ↓ (all MFEs now have new theme)
Users See Updated Theme ✅
    ↓ (changing theme in one MFE updates all)
Cross-MFE Theme Sync ✅
```

---

## 📚 Available CSS Variables

### Colors

```css
var(--color-primary)      /* Brand color */
var(--color-secondary)    /* Secondary color */
var(--color-bg)          /* Page background */
var(--color-surface)     /* Card background */
var(--color-text)        /* Text color */
var(--color-text-muted)  /* Muted text */
var(--color-error)       /* Error color */
var(--color-success)     /* Success color */
var(--color-warning)     /* Warning color */
var(--color-info)        /* Info color */
var(--color-border)      /* Border color */
var(--color-focus)       /* Focus ring color */
```

### Spacing

```css
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */
```

### Typography

```css
var(--font-family-base)      /* Font family */
var(--font-size-base)        /* Base size */
var(--font-size-sm)          /* Small */
var(--font-size-lg)          /* Large */
var(--font-size-xl)          /* Extra large */
var(--font-weight-regular)   /* 400 */
var(--font-weight-medium)    /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--line-height-base)      /* Line height */
```

### Layout

```css
var(--sidebar-width)        /* Sidebar width */
var(--header-height)        /* Header height */
var(--container-max-width)  /* Max width */
```

---

## 🐛 Common Issues & Fixes

| Issue                        | Cause                                 | Fix                                              |
| ---------------------------- | ------------------------------------- | ------------------------------------------------ |
| Theme variables not applying | ThemeProvider missing                 | Wrap app root with `<ThemeProvider>`             |
| No sync PR received          | Workflow disabled or file not changed | Check GitHub Actions, ensure theme files changed |
| Submodule not updating       | Submodule stale                       | `git submodule update --remote --merge`          |
| CSS variable errors          | Linter doesn't know about vars        | Add `.stylelintignore` with `src/theme-shared/`  |
| Theme hook undefined         | Not inside ThemeProvider              | Verify component wrapping                        |
| Sync stuck/timeout           | Git process hung                      | Kill and retry: `npm run sync:mfes`              |

---

## 📞 Support Resources

| Question                  | Answer                                         |
| ------------------------- | ---------------------------------------------- |
| How do I integrate theme? | See `MFE_INTEGRATION_GUIDE.md`                 |
| How do I deploy updates?  | See `DEPLOYMENT_OPERATIONS_GUIDE.md`           |
| How does sync work?       | See `CROSS_REPO_THEME_SETUP.md`                |
| What files are available? | See `src/theme/` folder in main repo           |
| How do I add a new MFE?   | `npm run sync:add-mfe <url> <name>`            |
| How do I disable sync?    | Edit `.mfe-config.json`                        |
| Can I customize theme?    | Yes, edit `src/theme/themes/*.ts` in main repo |

---

## ✅ Deployment Checklist

### Before Pushing Theme Changes

- [ ] Tested locally: `npm run dev`
- [ ] Linting passes: `npm run lint`
- [ ] Format correct: `npm run format:check`
- [ ] No bundle size regression: `npm run theme:check-size`

### Before Merging Theme Update PR in MFE

- [ ] Reviewed `src/theme-shared/` changes
- [ ] Tested theme switching locally
- [ ] No Tailwind class conflicts
- [ ] All tests pass

### After Deployment

- [ ] Check theme loads in production
- [ ] Test all theme colors applied
- [ ] Test theme switching works
- [ ] Monitor for 24 hours

---

## 🎯 Key Takeaways

1. **Theme changes in thmc2** → **GitHub Actions syncs to all MFEs** automatically
2. **Each MFE** gets a PR to review and merge at their own pace
3. **All MFEs sync cross-repo** - changing theme in one updates all
4. **Use CSS variables** - no hardcoded colors
5. **Wrap with ThemeProvider** - always needed in each MFE
6. **No manual sync needed** - automation handles it

---

## 🚀 Next Steps

### Today

1. Run `npm run sync:setup` in main repo
2. Commit and push to develop
3. Check GitHub Actions completes successfully

### This Week

1. Integrate in first MFE (mfe-dashboard)
2. Test theme switching
3. Integrate in remaining MFEs

### Later

1. Monitor for any issues
2. Document any custom theme needs
3. Celebrate working cross-repo theme sharing! 🎉

---

**Questions?** Check the full guides in the main theme repo:

- `MFE_INTEGRATION_GUIDE.md` - How to integrate
- `DEPLOYMENT_OPERATIONS_GUIDE.md` - How to deploy
- `CROSS_REPO_THEME_SETUP.md` - How system works

**Last Updated:** April 2026
**Theme Version:** 2.2.0+
