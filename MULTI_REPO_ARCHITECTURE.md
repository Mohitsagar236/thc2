# Multi-Repository Microfrontend Architecture with Shared Theme System

## 📋 Overview

This architecture enables multiple independent repositories to be loaded as microfrontends while sharing a centralized theme and layout system via Vite Module Federation.

```
┌─────────────────────────────────────────────────────────┐
│                   HOST SHELL (thmc2)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │ • Theme Provider & Context                        │  │
│  │ • Layout Manager (Sidebar / Top-Nav)              │  │
│  │ • Module Federation Hub                           │  │
│  │ • Routing & Navigation                            │  │
│  │ • Persistent Header/Footer/Sidebar                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
         │                    │                    │
  [CSS Variables]   [CSS Variables]     [CSS Variables]
  [Event Dispatch]  [Event Dispatch]    [Event Dispatch]
         │                    │                    │
    ┌────────────┐      ┌──────────┐      ┌──────────────┐
    │ Dashboard  │      │  Admin   │      │ User Profile │
    │ Repository │      │Repository│      │  Repository  │
    │(MFE)       │      │ (MFE)    │      │   (MFE)      │
    └────────────┘      └──────────┘      └──────────────┘
```

## 🏗️ Architecture Components

### 1. **Host Shell Repository (Current: thmc2)**

- **Location**: `c:\Users\cp813\Desktop\thmc2`
- **Role**: Entry point and theme manager
- **Responsibilities**:
  - Load and manage themes centrally
  - Provide layout switching (Sidebar ↔ Top-Nav)
  - Load remotes via Module Federation
  - Dispatch theme-changed events
  - Manage navigation shell

### 2. **Remote MFE Repositories**

- **Dashboard**: mfe-dashboard
- **Admin**: mfe_admin
- **User Profile**: mfe_user_profile

Each remote:

- Loads CSS variables from host
- Listens to theme-changed events
- Supports layout class selectors (`.layout-sidebar`, `.layout-top-nav`)
- Exposes its App component via Module Federation

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Step 1: Clone All Repositories

```bash
# Host shell (contains theme system)
cd ~/projects
git clone https://github.com/Mohitsagar236/thmc2.git thmc2-host
cd thmc2-host
npm install

# Dashboard MFE
cd ~/projects
git clone https://github.com/Mohitsagar236/mfe-dashboard.git
cd mfe-dashboard
npm install

# Admin MFE
cd ~/projects
git clone https://github.com/Mohitsagar236/mfe_admin.git
cd mfe_admin
npm install

# User Profile MFE
cd ~/projects
git clone https://github.com/Mohitsagar236/mfe_user_profile.git
cd mfe_user_profile
npm install
```

### Step 2: Start Development Servers

**Terminal 1 - Dashboard (Port 5001):**

```bash
cd ~/projects/mfe-dashboard
npm run dev  # Should run on http://localhost:5001
```

**Terminal 2 - Admin (Port 5002):**

```bash
cd ~/projects/mfe_admin
npm run dev  # Should run on http://localhost:5002
```

**Terminal 3 - User Profile (Port 5003):**

```bash
cd ~/projects/mfe_user_profile
npm run dev  # Should run on http://localhost:5003
```

**Terminal 4 - Host Shell (Port 5000):**

```bash
cd ~/projects/thmc2-host
npm run dev  # Should run on http://localhost:5000
```

Navigate to `http://localhost:5000` in your browser. You should see all MFEs loaded.

---

## 🎨 Theme Propagation Flow

### How Theme Changes Reflect Across All MFEs

1. **User changes theme in UI** → Host App state updates
2. **Host calls `applyTheme()`** → CSS variables set on `document.documentElement`
3. **Host dispatches `theme-changed` event** → Window event with theme metadata
4. **All MFEs receive event** → Re-render if needed (canvas/SVG elements)
5. **CSS cascade applies** → All styled components auto-update

### CSS Variable Injection (Host Side)

```typescript
// Host shell injects these on document.documentElement
document.documentElement.style.setProperty("--color-primary", "#2563EB");
document.documentElement.style.setProperty("--color-surface", "#FFFFFF");
document.documentElement.style.setProperty(
  "--font-family-base",
  "system-ui, sans-serif",
);
document.documentElement.style.setProperty("--spacing-md", "12px");
// ... many more
```

### Layout Class Injection (Host Side)

```typescript
// Host shell toggles these on document.documentElement
document.documentElement.classList.add("layout-sidebar"); // or 'layout-top-nav'
document.documentElement.classList.add("density-comfortable"); // or 'density-compact'
```

### Event Dispatch (Host Side)

```typescript
window.dispatchEvent(
  new CustomEvent("theme-changed", {
    detail: {
      themeName: "dark",
      layout: "layout-sidebar",
      density: "density-comfortable",
      source: "theme-selector",
      emittedAt: new Date().toISOString(),
    },
    bubbles: true,
    composed: true,
  }),
);
```

---

## 📦 Remote MFE Implementation

### Minimal Remote MFE Structure

```
mfe-dashboard/
├── src/
│   ├── App.tsx           # Module Federation expose entry
│   ├── components/
│   │   └── Dashboard.tsx # Main component
│   ├── styles/
│   │   └── Dashboard.module.css
│   └── main.tsx
├── vite.config.ts        # Module Federation config
├── package.json
└── tsconfig.json
```

### Remote vite.config.ts Template

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "dashboard",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { requiredVersion: "^19.1.0" },
        "react-dom": { requiredVersion: "^19.1.0" },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
  },
});
```

### Remote App.tsx Template

```typescript
import { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';

export default function App() {
  // Optional: Listen for theme changes for canvas/SVG elements
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      console.log('Theme changed in Dashboard:', event.detail.themeName);
      // Re-render canvas-based content here
    };

    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
    };
  }, []);

  return <Dashboard />;
}
```

### Remote Component Using Theme CSS Variables

```typescript
// Dashboard.tsx
import styles from './Dashboard.module.css';

export function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.text}>Content automatically uses host theme.</p>
    </div>
  );
}
```

```css
/* Dashboard.module.css */
.container {
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-lg);
  border-radius: 8px;
  font-family: var(--font-family-base);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Responsive to layout changes */
:global(.layout-sidebar) .container {
  max-width: calc(100% - 250px);
  margin-left: 0;
}

:global(.layout-top-nav) .container {
  max-width: 100%;
}

/* Responsive to density changes */
:global(.density-compact) .container {
  padding: var(--spacing-sm);
}

:global(.density-comfortable) .container {
  padding: var(--spacing-lg);
}
```

---

## ✅ Remote MFE Checklist

Each remote repository MUST:

- [ ] Export App component in vite.config.ts federation `exposes`
- [ ] Use CSS variables (never hardcode colors/fonts/spacing)
- [ ] Include CSS rules for both layout variants (`.layout-sidebar`, `.layout-top-nav`)
- [ ] Include CSS rules for density variants (`.density-compact`, `.density-comfortable`)
- [ ] Add package.json scripts: `dev` and `build`
- [ ] Set correct dev port (dashboard: 5001, admin: 5002, user: 5003)
- [ ] Never fetch theme bundle independently
- [ ] Never write to `ctms:*` localStorage keys
- [ ] Optional: Listen to `theme-changed` event for canvas/SVG
- [ ] Document supported themes/layouts/densities in README
- [ ] Test locally with host shell running
- [ ] Test theme switching (Light/Dark)
- [ ] Test layout switching (Sidebar/Top-Nav)
- [ ] Test density switching (Compact/Comfortable)

---

## 🔧 Configuration Reference

### Host Shell (vite.config.ts)

```typescript
federation({
  name: "host",
  remotes: {
    dashboard: "http://localhost:5001/assets/remoteEntry.js",
    admin: "http://localhost:5002/assets/remoteEntry.js",
    user: "http://localhost:5003/assets/remoteEntry.js",
  },
  shared: {
    react: { requiredVersion: "^19.1.0" },
    "react-dom": { requiredVersion: "^19.1.0" },
  },
});
```

### Production URLs

For production, update host vite.config.ts remotes:

```typescript
remotes: {
  dashboard: 'https://mfe-dashboard.mycompany.com/assets/remoteEntry.js',
  admin: 'https://mfe-admin.mycompany.com/assets/remoteEntry.js',
  user: 'https://mfe-user-profile.mycompany.com/assets/remoteEntry.js',
}
```

---

## 🎯 Common Issues & Solutions

### Issue: MFE Not Loading

**Solution**: Check console for CORS errors. Ensure remoteEntry.js is accessible.

### Issue: Theme Not Applying in MFE

**Solution**: Verify MFE has CSS that uses `var(--color-*)`. Check browser devtools for CSS variables.

### Issue: Layout Classes Not Working

**Solution**: Ensure MFE CSS includes rules for `.layout-sidebar` and `.layout-top-nav` selectors.

### Issue: Canvas/SVG Not Updating on Theme Change

**Solution**: Add event listener for `theme-changed` event and manually redraw/refresh.

---

## 📚 Available CSS Variables

### Colors

```
--color-primary
--color-secondary
--color-surface
--color-text
--color-text-muted
--color-border
--color-info
--color-success
--color-warning
--color-error
```

### Typography

```
--font-family-base
--font-size-xs
--font-size-sm
--font-size-base
--font-size-lg
--font-size-xl
```

### Spacing

```
--spacing-xs
--spacing-sm
--spacing-md
--spacing-lg
--spacing-xl
```

See [src/theme/catalogue.json](src/theme/catalogue.json) for complete variable definitions per theme.

---

## 🔐 Module Federation Best Practices

1. **Shared Dependencies**: List in `shared` config to avoid duplication
2. **Version Matching**: Keep React/React-DOM versions in sync
3. **Error Handling**: Wrap remote imports with try-catch and error boundaries
4. **Lazy Loading**: Use React.lazy for remote modules
5. **Versioning**: Pin versions in package.json to ensure consistency

---

## 📖 Additional Resources

- [Host Shell Implementation](src/App.tsx)
- [MFE Integration Contract](src/theme/mfe-integration-contract.ts)
- [Theme Types](src/theme/types.ts)
- [Theme Hooks](src/theme/hooks/useTheme.ts)
- [@originjs/vite-plugin-federation](https://www.npmjs.com/package/@originjs/vite-plugin-federation)
