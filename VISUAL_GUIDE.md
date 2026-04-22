# 🎨 Cross-Repo Theme Sharing - Visual Guide

## The Problem Solved

### Before: Manual Theme Updates ❌

```
Developer updates theme in thmc2
     ↓
Manually notifies MFE teams
     ↓
Each MFE manually copies files
     ↓
Merge conflicts, inconsistencies
     ↓
Different users see different themes 😞
```

**Problems:**

- Error-prone
- Takes hours
- Theme gets out of sync
- Poor user experience

---

### After: Automated Theme Sharing ✅

```
Developer updates theme in thmc2
     ↓ (GitHub Actions)
Automatically syncs to all MFEs
     ↓
Each MFE gets PR with updates
     ↓
Review and merge (at your pace)
     ↓
All users see consistent theme 😊
```

**Benefits:**

- Automatic
- Fast (minutes)
- Always in sync
- Great UX

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    thmc2 Repository                             │
│                 (Main Theme Package)                            │
│                                                                  │
│  Source Files:                                                   │
│  ├─ src/theme/                                                   │
│  │  ├─ themes/                                                   │
│  │  │  ├─ light.ts   (light theme colors)                       │
│  │  │  ├─ dark.ts    (dark theme colors)                        │
│  │  │  ├─ ocean.ts   (ocean theme colors)                       │
│  │  │  └─ compact.ts (compact theme colors)                     │
│  │  ├─ provider.tsx (ThemeProvider component)                   │
│  │  ├─ hooks/       (useTheme hook)                             │
│  │  └─ types.ts     (TypeScript definitions)                    │
│  ├─ tailwind.config.js (shared Tailwind config)                │
│  └─ .mfe-config.json (MFE registry)                            │
│                                                                  │
│  Automation:                                                     │
│  └─ .github/workflows/theme-sync.yml                           │
│     └─ Triggers on: push to develop + theme files changed       │
└──────────┬──────────────────────────────────────────────────────┘
           │
           │ GitHub Actions Workflow (Automatic)
           │ ┌────────────────────────────────────┐
           │ │ 1. Validate theme files            │
           │ │ 2. Build theme bundle              │
           │ │ 3. Sync to each MFE                │
           │ │ 4. Create commits/PRs              │
           │ └────────────────────────────────────┘
           │
     ┌─────┴──────────────┬──────────────────────────┐
     │                    │                          │
     ▼                    ▼                          ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ mfe-dashboard│  │ mfe-admin    │  │ mfe-user-profile │
└──────────────┘  └──────────────┘  └──────────────────┘
│                 │                 │
│ New commit:     │ New commit:     │ New commit:
│ src/theme-     │ src/theme-     │ src/theme-
│ shared/ (all   │ shared/ (all   │ shared/ (all
│ theme files)   │ theme files)   │ theme files)
│                │                │
│ Optional PR    │ Optional PR    │ Optional PR
│ for review     │ for review     │ for review
│                │                │
│ You merge     │ You merge     │ You merge
│ You deploy    │ You deploy    │ You deploy
└──────────────┘  └──────────────┘  └──────────────────┘
```

---

## Theme Changes Flow

### Scenario 1: Color Change in Dark Theme

```
1. Edit Dark Theme
   └─ src/theme/themes/dark.ts
      primary: "#6467f2" → "#FF6B6B"

2. Commit & Push
   └─ git push origin develop

3. GitHub Actions Detects Change
   └─ Workflow triggers automatically

4. Build & Validate
   └─ Lint, test, bundle size check

5. Sync to MFEs
   ├─ mfe-dashboard: src/theme-shared/ updated
   ├─ mfe-admin: src/theme-shared/ updated
   └─ mfe-user-profile: src/theme-shared/ updated

6. Each MFE Receives Commit/PR
   └─ Review and merge

7. Deploy
   └─ New color live in production ✅
```

---

## How Components Use Theme

### Scenario 2: Using Theme Variables in Components

```
MFE Component Code:
┌───────────────────────────────────────────┐
│ import { useTheme } from './theme-shared' │
│                                           │
│ export function Button() {                │
│   const { currentTheme } = useTheme();    │
│   return (                                │
│     <button style={{                      │
│       color: 'var(--color-text)',         │
│       background: 'var(--color-primary)'  │
│     }}>                                    │
│       Click me                            │
│     </button>                             │
│   );                                      │
│ }                                         │
└───────────────────────────────────────────┘
           ↓
        Browser CSS
┌───────────────────────────────────────────┐
│ When user selects "dark" theme:           │
│                                           │
│ :root {                                   │
│   --color-text: "#ffffff"                 │
│   --color-primary: "#FF6B6B"              │
│ }                                         │
│                                           │
│ Button renders with white text,           │
│ red background ✅                         │
└───────────────────────────────────────────┘
```

---

## Cross-MFE Synchronization

### Scenario 3: User Changes Theme in One MFE

```
User Action:
┌─────────────────────────────────────────────────────────┐
│ In Browser Tab 1 (mfe-dashboard):                       │
│ User clicks theme selector: Light → Dark               │
└─────────────────────────────────────────────────────────┘
           ↓
           ↓ (src/theme-shared/switcher.ts)
┌─────────────────────────────────────────────────────────┐
│ 1. Save to localStorage:                               │
│    localStorage.setItem('theme-preference', 'dark')    │
│                                                         │
│ 2. Broadcast event:                                    │
│    window.dispatchEvent(                               │
│      new CustomEvent('theme-changed',                  │
│        { detail: { theme: 'dark' } }                  │
│      )                                                 │
│    )                                                   │
└─────────────────────────────────────────────────────────┘
           ↓
           ├─────────────────────────────────────┐
           ▼                                      ▼
┌──────────────────────────┐    ┌───────────────────────────┐
│ Browser Tab 1            │    │ Browser Tabs 2 & 3        │
│ (mfe-dashboard)          │    │ (mfe-admin,               │
│                          │    │  mfe-user-profile)        │
│ Already dark ✅          │    │                           │
│                          │    │ Listen for event:         │
│                          │    │ 'theme-changed'           │
│                          │    │                           │
│                          │    │ Update CSS variables:     │
│                          │    │ --color-text: "#ffffff"   │
│                          │    │ --color-primary: "#FF6B6B"│
│                          │    │                           │
│                          │    │ Components re-render:     │
│                          │    │ Dark theme applied ✅     │
└──────────────────────────┘    └───────────────────────────┘

Result:
✅ All 3 MFEs instantly in dark theme
✅ No page reload needed
✅ Seamless user experience
```

---

## GitHub Actions Workflow Timeline

### Scenario 4: Automated Sync Timeline

```
Time    Event                           Status
────────────────────────────────────────────────────────
00:00   Dev pushes to develop           ⏳ Workflow queued
00:05   Workflow starts                 🔄 Running
        - Checkout code
        - Setup Node

00:10   Build theme                    🔄 Running
        - npm run lint
        - npm run theme:validate
        - npm run build

00:15   Sync mfe-dashboard             🔄 Running
        - Clone repo
        - Update src/theme-shared/
        - Commit and push

00:18   Sync mfe-admin                 🔄 Running
        - Clone repo
        - Update src/theme-shared/
        - Commit and push

00:21   Sync mfe-user-profile          🔄 Running
        - Clone repo
        - Update src/theme-shared/
        - Commit and push

00:25   All syncs complete             ✅ Success!
        Notify (webhook, etc)
────────────────────────────────────────────────────────
Total time: 25 minutes from push to all MFEs updated
```

---

## Integration Steps (Per MFE)

### Scenario 5: Adding Theme to a New MFE

```
Step 1: Get Theme Files
┌─────────────────────────────────────┐
│ Option A: Git Submodule            │
│ git submodule add                  │
│   https://github.com/.../thmc2.git │
│   src/theme-shared                 │
│                                     │
│ Option B: Auto-Sync                │
│ Wait for automatic commit from      │
│ GitHub Actions                     │
└─────────────────────────────────────┘

Step 2: Wrap App with Provider
┌─────────────────────────────────────┐
│ src/main.tsx                        │
│ ┌─────────────────────────────────┐ │
│ │ <ThemeProvider>                 │ │
│ │   <App />                       │ │
│ │ </ThemeProvider>                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Step 3: Use Theme in Components
┌─────────────────────────────────────┐
│ useTheme hook                       │
│ CSS variables: var(--color-text)   │
│ Tailwind classes                    │
└─────────────────────────────────────┘

Step 4: Test
┌─────────────────────────────────────┐
│ npm run dev                         │
│ Switch theme in UI                  │
│ Should update instantly ✅          │
└─────────────────────────────────────┘

Step 5: Commit
┌─────────────────────────────────────┐
│ git add .                           │
│ git commit -m "chore: integrate     │
│   shared theme"                     │
│ git push origin develop             │
└─────────────────────────────────────┘
```

---

## File Structure

```
thmc2/ (Main Theme Package)
├── .github/
│   └── workflows/
│       └── theme-sync.yml ⭐ (Auto-sync trigger)
│
├── src/
│   └── theme/
│       ├── themes/ (Theme definitions)
│       │   ├── light.ts
│       │   ├── dark.ts
│       │   ├── ocean.ts
│       │   └── compact.ts
│       ├── provider.tsx ⭐ (ThemeProvider)
│       ├── hooks/ ⭐ (useTheme hook)
│       ├── context.ts
│       ├── types.ts
│       └── ...
│
├── tailwind.config.js ⭐ (Shared config)
├── .mfe-config.json ⭐ (MFE registry)
├── package.json (updated with sync commands)
│
├── Documentation/
├── START_HERE.md ⭐ (Read this first!)
├── QUICK_REFERENCE.md
├── MFE_INTEGRATION_GUIDE.md
├── DEPLOYMENT_OPERATIONS_GUIDE.md
├── CROSS_REPO_THEME_SETUP.md
└── SYSTEM_BUILT_SUMMARY.md

mfe-dashboard/
├── src/
│   ├── theme-shared/ ⭐ (Auto-synced from thmc2)
│   │   ├── themes/
│   │   ├── provider.tsx
│   │   ├── hooks/
│   │   └── ...
│   └── main.tsx (uses <ThemeProvider>)
└── ...

mfe-admin/ & mfe-user-profile/ (Same structure)
```

---

## Decision Tree: What To Do When

```
I want to...                                    Action
═══════════════════════════════════════════════════════════

Change a theme color
  └─ Edit src/theme/themes/[name].ts
     git push origin develop
     GitHub Actions syncs automatically ✅

Add a new theme
  └─ Create src/theme/themes/newtheme.ts
     Register in src/theme/themes/index.ts
     git push origin develop
     All MFEs get it automatically ✅

Add a new MFE
  └─ Run: npm run sync:add-mfe <url> <name>
     git push origin develop
     Workflow will sync to new MFE ✅

Integrate theme in my MFE
  └─ See MFE_INTEGRATION_GUIDE.md
     1. Add src/theme-shared/ (submodule or auto-sync)
     2. Wrap with <ThemeProvider>
     3. Use useTheme hook in components
     4. Apply CSS variables in styles
     5. Test: npm run dev ✅

Debug theme not syncing
  └─ Check GitHub Actions logs
     Check .mfe-config.json for MFE URLs
     Check file changes match workflow trigger ✅

Rollback bad theme change
  └─ git revert <commit-hash>
     git push origin develop
     GitHub Actions auto-syncs revert ✅

Test theme changes locally
  └─ npm run dev
     Use theme switcher in UI
     Should update instantly ✅

Deploy to production
  └─ Review theme sync PR in MFE repo
     Merge PR
     Deploy using your normal process ✅

Monitor sync health
  └─ Visit: github.com/Mohitsagar236/thmc2/actions
     Check workflow runs
     Check each MFE repo for commits ✅
```

---

## Success Indicators

When everything is working:

```
✅ Checklist:

Development:
□ Created .mfe-config.json
□ Created .github/workflows/theme-sync.yml
□ npm run sync:setup works
□ npm run sync:mfes works

GitHub Actions:
□ Workflow appears in Actions tab
□ Workflow runs on push to develop
□ Workflow completes in <30 minutes
□ Status shows "Success"

MFE Syncing:
□ mfe-dashboard has src/theme-shared/
□ mfe-admin has src/theme-shared/
□ mfe-user-profile has src/theme-shared/
□ All synced within minutes of push

Integration:
□ Each MFE has <ThemeProvider> in main.tsx
□ Theme switcher works in MFE
□ CSS variables apply correctly
□ useTheme hook available

Cross-MFE:
□ Changing theme in mfe-dashboard updates mfe-admin
□ Changing theme in mfe-admin updates mfe-user-profile
□ All tabs sync instantly (no reload needed)

Production:
□ Theme changes deploy without errors
□ Users see consistent theme everywhere
□ All 3 MFEs in sync

Performance:
□ Sync completes in <30 min
□ No bundle size regression
□ No slow performance issues
```

---

## One More Thing...

### The Power of This System

```
Before:
- Update theme in thmc2
- Manually tell 3 teams
- Each team manually updates
- Inconsistent versions
- Bugs and confusion
- Takes hours

After:
- Update theme in thmc2
- Push to develop
- Done! ✅ Everything synced
- Consistent versions
- No confusion
- Takes minutes

And if you're on Windows like you? ✅
- Work normally on Windows
- Script handles everything
- No need for bash or complex setup
- Just npm run sync:mfes and done!
```

---

**Ready to get started? Open `START_HERE.md`** 👆

**Questions? Check `QUICK_REFERENCE.md`** 📖

**How it works? Check `CROSS_REPO_THEME_SETUP.md`** 🔧

Enjoy your unified theme system! 🎨🚀
