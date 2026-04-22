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
  if (fs.existsSync(THEME_SYNC_SCRIPT)) {
    console.log(
      `ℹ️  ${THEME_SYNC_SCRIPT} already exists, keeping current workflow`,
    );
    return;
  }

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

// Main execution
function main() {
  console.log("🎨 Setting up cross-repo theme sync...\n");

  try {
    // Initialize config
    const config = initializeMFEConfig();

    // Create workflows and scripts only (no docs)
    createSyncWorkflow();
    createManualSyncScript();

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
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

main();
