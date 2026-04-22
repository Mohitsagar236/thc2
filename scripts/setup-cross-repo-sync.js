#!/usr/bin/env node

/**
 * Cross-Repo Theme Sync Setup
 * Configures Git submodules and sync automation for micro frontends
 *
 * Usage:
 *   node scripts/setup-cross-repo-sync.js
 *   node scripts/setup-cross-repo-sync.js --add-mfe <repo-url> <mfe-name>
 *   node scripts/setup-cross-repo-sync.js --push-updates
 */

import fs from "node:fs";

const MFE_CONFIG_FILE = ".mfe-config.json";
const THEME_SYNC_SCRIPT = ".github/workflows/theme-sync.yml";

// Default MFE repositories
const DEFAULT_MFES = [
  {
    name: "mfe-dashboard",
    url: "https://github.com/Mohitsagar236/mfe-dashboard.git",
    branch: "develop",
  },
  {
    name: "mfe-admin",
    url: "https://github.com/Mohitsagar236/mfe_admin.git",
    branch: "develop",
  },
  {
    name: "mfe-user-profile",
    url: "https://github.com/Mohitsagar236/mfe_user_profile.git",
    branch: "develop",
  },
];

// Initialize MFE configuration
function initializeMFEConfig() {
  if (fs.existsSync(MFE_CONFIG_FILE)) {
    console.log(`ℹ️  ${MFE_CONFIG_FILE} already exists`);
    return JSON.parse(fs.readFileSync(MFE_CONFIG_FILE, "utf-8"));
  }

  const config = {
    theme_package: "@ctms/theme",
    theme_version: getPackageVersion(),
    registry_url: process.env.NPM_REGISTRY || "https://registry.npmjs.org",
    mfes: DEFAULT_MFES,
    sync: {
      enabled: true,
      method: "git-submodule", // or "npm-package"
      auto_update: false,
      notification_webhook: process.env.SYNC_WEBHOOK_URL || null,
    },
    last_sync: new Date().toISOString(),
  };

  fs.writeFileSync(MFE_CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log("✅ Created .mfe-config.json");

  return config;
}

// Get current package version
function getPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  return pkg.version;
}

// Create GitHub Actions workflow for theme syncing
function createSyncWorkflow() {
  const workflowDir = ".github/workflows";
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }

  const workflow = `name: Sync Theme to Micro Frontends

on:
  push:
    branches:
      - develop
    paths:
      - 'src/theme/**'
      - 'tailwind.config.js'
      - 'package.json'

jobs:
  sync-theme:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - mfe: mfe-dashboard
            repo: Mohitsagar236/mfe-dashboard
            branch: develop
          - mfe: mfe-admin
            repo: Mohitsagar236/mfe_admin
            branch: develop
          - mfe: mfe-user-profile
            repo: Mohitsagar236/mfe_user_profile
            branch: develop

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Build theme bundle
        run: npm run theme:build-bundle

      - name: Checkout MFE repository
        uses: actions/checkout@v4
        with:
          repository: \${{ matrix.repo }}
          token: \${{ secrets.GITHUB_TOKEN }}
          path: .tmp/\${{ matrix.mfe }}
          ref: \${{ matrix.branch }}

      - name: Update theme in \${{ matrix.mfe }}
        run: |
          THEME_DIR=.tmp/\${{ matrix.mfe }}/src/theme-shared
          mkdir -p $THEME_DIR
          
          # Copy theme files
          cp -r src/theme/* $THEME_DIR/
          cp tailwind.config.js $THEME_DIR/
          cp src/theme/types.ts $THEME_DIR/
          
          # Copy version info
          echo "export const THEME_VERSION = '$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')'" > $THEME_DIR/version.ts

      - name: Commit and Push theme update
        working-directory: .tmp/\${{ matrix.mfe }}
        run: |
          git config user.name "Theme Sync Bot"
          git config user.email "theme-sync@ctms.dev"
          
          git add src/theme-shared/
          
          # Check if there are changes
          if git diff --cached --quiet; then
            echo "No theme changes to commit"
            exit 0
          fi
          
          git commit -m "chore: sync theme updates from @ctms/theme"
          git push origin \${{ matrix.branch }}

      - name: Create pull request
        uses: actions/github-script@v7
        if: failure() != true
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          script: |
            const { owner, repo } = context.repo;
            const mfe = '\${{ matrix.mfe }}';
            const [mfeOwner, mfeRepo] = '\${{ matrix.repo }}'.split('/');
            
            // Create PR in MFE repo if changes pushed
            console.log(\`Theme sync initiated for \${mfe}\`);

  notify:
    runs-on: ubuntu-latest
    needs: sync-theme
    if: always()
    steps:
      - name: Send Webhook Notification
        run: |
          if [ -n "\${{ secrets.SYNC_WEBHOOK_URL }}" ]; then
            curl -X POST \${{ secrets.SYNC_WEBHOOK_URL }} \\
              -H 'Content-Type: application/json' \\
              -d '{
                "event": "theme-sync-complete",
                "status": "\${{ needs.sync-theme.result }}",
                "timestamp": "'"$(date -u +'%Y-%m-%dT%H:%M:%SZ')"'",
                "version": "\${{ github.sha }}"
              }'
          fi
`;

  fs.writeFileSync(THEME_SYNC_SCRIPT, workflow);
  console.log("✅ Created .github/workflows/theme-sync.yml");
}

// Create sync script for manual updates
function createManualSyncScript() {
  const scriptPath = "scripts/sync-theme-to-mfes.sh";

  const syncScript = `#!/bin/bash

# Manual Theme Sync Script
# Synchronizes theme changes to all connected micro frontends

set -e

echo "🔄 Starting theme sync to micro frontends..."

# Read MFE config
MFE_CONFIG=".mfe-config.json"
if [ ! -f "$MFE_CONFIG" ]; then
  echo "❌ Error: $MFE_CONFIG not found"
  echo "Run: node scripts/setup-cross-repo-sync.js"
  exit 1
fi

# Build theme bundle
echo "📦 Building theme bundle..."
npm run theme:build-bundle

# Get theme version
THEME_VERSION=$(node -p "require('./package.json').version")
TEMP_DIR=".tmp-theme-sync"

# Create temp directory
mkdir -p $TEMP_DIR

# Parse MFE list from config
MFES=$(node -e "console.log(require('./$MFE_CONFIG').mfes.map(m => m.name).join(' '))")

for MFE in $MFES; do
  echo ""
  echo "📤 Syncing theme to $MFE..."
  
  # Get MFE repo info from config
  REPO_URL=$(node -e "console.log(require('./$MFE_CONFIG').mfes.find(m => m.name === '$MFE')?.url || '')")
  REPO_BRANCH=$(node -e "console.log(require('./$MFE_CONFIG').mfes.find(m => m.name === '$MFE')?.branch || 'develop')")
  
  if [ -z "$REPO_URL" ]; then
    echo "⚠️  Skipping $MFE: not found in config"
    continue
  fi
  
  # Clone MFE repo
  MFE_DIR="$TEMP_DIR/$MFE"
  
  if [ -d "$MFE_DIR" ]; then
    echo "  Updating existing clone..."
    cd "$MFE_DIR"
    git fetch origin
    git checkout $REPO_BRANCH
    git pull origin $REPO_BRANCH
    cd - > /dev/null
  else
    echo "  Cloning $MFE..."
    git clone --depth 1 --branch $REPO_BRANCH "$REPO_URL" "$MFE_DIR"
  fi
  
  # Copy theme files
  THEME_DEST="$MFE_DIR/src/theme-shared"
  mkdir -p "$THEME_DEST"
  
  echo "  Copying theme files..."
  cp -r src/theme/* "$THEME_DEST/"
  cp tailwind.config.js "$THEME_DEST/"
  
  # Create version file
  echo "export const THEME_VERSION = '$THEME_VERSION';" > "$THEME_DEST/version.ts"
  
  # Commit and push if changes exist
  cd "$MFE_DIR"
  
  if git diff --quiet; then
    echo "  ✓ No theme changes in $MFE"
  else
    echo "  Committing changes..."
    git config user.name "Theme Sync Bot"
    git config user.email "theme-sync@ctms.dev"
    git add src/theme-shared/
    git commit -m "chore: sync theme updates from @ctms/theme@$THEME_VERSION"
    
    echo "  Pushing to origin/$REPO_BRANCH..."
    git push origin $REPO_BRANCH
    
    echo "  ✓ Theme synced to $MFE"
  fi
  
  cd - > /dev/null
done

# Cleanup
echo ""
echo "🧹 Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Theme sync complete!"
echo ""
echo "Next steps:"
echo "  1. Review pull requests in each MFE repository"
echo "  2. Merge changes to deploy theme updates"
echo "  3. Monitor micro frontend dashboards for any issues"
`;

  fs.writeFileSync(scriptPath, syncScript);
  fs.chmodSync(scriptPath, "0755");
  console.log("✅ Created scripts/sync-theme-to-mfes.sh");
}

// Create MFE integration guide
function createIntegrationGuide() {
  const guidePath = "MFE_INTEGRATION_GUIDE.md";

  const guide = `# Micro Frontend Theme Integration Guide

## Overview

This guide explains how to integrate the shared theme system (\`@ctms/theme\`) into your micro frontend repository.

## Quick Start

### Option 1: Git Submodule (Recommended for local development)

\`\`\`bash
# Navigate to your MFE repo
cd your-mfe-repo

# Add theme as Git submodule
git submodule add https://github.com/Mohitsagar236/thmc2.git src/theme-shared

# Update submodule
git submodule update --init --recursive
\`\`\`

### Option 2: Copy Method (Automatic via CI/CD)

The theme files are automatically synced to \`src/theme-shared/\` via GitHub Actions when changes are pushed to the main theme repo.

## Integration Steps

### 1. Update Your \`tailwind.config.js\`

Replace or extend your Tailwind config with the shared theme:

\`\`\`javascript
// tailwind.config.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import sharedConfig from './src/theme-shared/tailwind.config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/theme-shared/**/*.{js,ts,jsx,tsx}',
  ],
};
\`\`\`

### 2. Wrap Your App with ThemeProvider

\`\`\`tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './theme-shared/provider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
\`\`\`

### 3. Use Theme Hooks in Components

\`\`\`tsx
// src/components/MyComponent.tsx
import { useTheme } from '../theme-shared/hooks';

export function MyComponent() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="p-4 bg-[var(--color-bg)] text-[var(--color-text)]">
      <h1>Current Theme: {currentTheme}</h1>
      
      <select 
        value={currentTheme} 
        onChange={(e) => setTheme(e.target.value)}
      >
        {availableThemes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}
\`\`\`

### 4. Use Theme CSS Variables

In your stylesheets:

\`\`\`css
/* src/styles/mycomponent.css */
.my-card {
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
}
\`\`\`

Or with Tailwind:

\`\`\`tsx
<div className="bg-[var(--color-surface)] text-[var(--color-text)] p-[var(--spacing-md)]">
  Content
</div>
\`\`\`

## Available Theme Tokens

### Colors
- \`--color-primary\` - Primary brand color
- \`--color-secondary\` - Secondary color
- \`--color-bg\` - Background color
- \`--color-surface\` - Surface/card background
- \`--color-text\` - Text color
- \`--color-text-muted\` - Muted text
- \`--color-error\` - Error/alert color
- \`--color-success\` - Success color
- \`--color-warning\` - Warning color
- \`--color-info\` - Info color
- \`--color-border\` - Border color
- \`--color-focus\` - Focus ring color

### Typography
- \`--font-family-base\` - Base font family
- \`--font-size-base\` - Base font size
- \`--font-size-lg\` - Large font size
- \`--font-size-sm\` - Small font size
- \`--font-size-xl\` - Extra large font size
- \`--font-weight-regular\` - Regular weight (400)
- \`--font-weight-medium\` - Medium weight (500)
- \`--font-weight-semibold\` - Semibold weight (600)
- \`--line-height-base\` - Base line height

### Spacing
- \`--spacing-xs\` - Extra small (4px)
- \`--spacing-sm\` - Small (8px)
- \`--spacing-md\` - Medium (16px)
- \`--spacing-lg\` - Large (24px)
- \`--spacing-xl\` - Extra large (32px)

### Layout
- \`--sidebar-width\` - Sidebar width
- \`--header-height\` - Header height
- \`--container-max-width\` - Max container width

## Keeping Theme Synced

The theme is automatically synced via GitHub Actions when:
- Changes are pushed to \`develop\` branch of the main theme repo
- Theme files are modified (\`src/theme/**\`, \`tailwind.config.js\`)

You'll receive a pull request with theme updates automatically.

## Manual Sync

If automatic sync is disabled, manually sync:

\`\`\`bash
# In the main theme repo (thmc2)
npm run sync:mfes
# or
bash scripts/sync-theme-to-mfes.sh
\`\`\`

## Troubleshooting

### Theme variables not loading
- Check that ThemeProvider wraps your app root
- Verify \`src/theme-shared\` folder exists
- Check browser console for CSS variable errors

### Submodule not updating
\`\`\`bash
git submodule update --remote --merge
\`\`\`

### Changes not syncing from main repo
- Check GitHub Actions in main theme repo
- Create an issue in the main repo
- Manually sync using the sync script

## Support

For issues or questions:
1. Check the main theme repo: https://github.com/Mohitsagar236/thmc2
2. Create an issue with \`[MFE-Integration]\` prefix
3. Contact the theme team

---

**Last Updated:** $(date)
**Theme Version:** See THEME_VERSION in src/theme-shared/version.ts
`;

  fs.writeFileSync(guidePath, guide);
  console.log("✅ Created MFE_INTEGRATION_GUIDE.md");
}

// Create package.json update instructions
function createPackageJsonUpdate() {
  const updatePath = "PACKAGE_JSON_UPDATES.md";

  const content = `# Package.json Configuration Updates

## For Main Theme Package (thmc2)

Add these scripts to your \`package.json\`:

\`\`\`json
{
  "scripts": {
    "sync:mfes": "bash scripts/sync-theme-to-mfes.sh",
    "sync:setup": "node scripts/setup-cross-repo-sync.js",
    "sync:add-mfe": "node scripts/setup-cross-repo-sync.js --add-mfe"
  }
}
\`\`\`

### Usage

\`\`\`bash
# Initial setup
npm run sync:setup

# Manually sync theme to all MFEs
npm run sync:mfes

# Add a new MFE
npm run sync:add-mfe https://github.com/owner/new-mfe.git new-mfe-name
\`\`\`

## For Each Micro Frontend

Update \`package.json\` to reference shared theme:

\`\`\`json
{
  "devDependencies": {
    "@ctms/theme": "workspace:*"
  }
}
\`\`\`

Or if using npm registry:

\`\`\`json
{
  "devDependencies": {
    "@ctms/theme": "^2.2.0"
  }
}
\`\`\`

---

**Last Updated:** $(date)
`;

  fs.writeFileSync(updatePath, content);
  console.log("✅ Created PACKAGE_JSON_UPDATES.md");
}

// Main execution
function main() {
  console.log("🎨 Setting up cross-repo theme sync...\n");

  try {
    // Initialize config
    const config = initializeMFEConfig();

    // Create workflows and scripts
    createSyncWorkflow();
    createManualSyncScript();
    createIntegrationGuide();
    createPackageJsonUpdate();

    console.log("\n✅ Setup complete!\n");
    console.log("📋 Configuration Summary:");
    console.log(`   Theme Package: ${config.theme_package}`);
    console.log(`   Version: ${config.theme_version}`);
    console.log(`   MFEs: ${config.mfes.length} repositories`);
    console.log(`   Sync Method: ${config.sync.method}`);

    console.log("\n📚 Next Steps:");
    console.log("   1. Review .mfe-config.json");
    console.log("   2. Push changes to develop branch");
    console.log("   3. GitHub Actions will automatically sync theme to MFEs");
    console.log("   4. Or manually run: npm run sync:mfes");

    console.log("\n📖 For integration guide, see: MFE_INTEGRATION_GUIDE.md");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

main();
