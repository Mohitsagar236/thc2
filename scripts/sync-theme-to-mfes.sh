#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MFE_CONFIG="$PROJECT_ROOT/.mfe-config.json"
TEMP_DIR="$PROJECT_ROOT/.tmp-theme-sync"
GIT_TOKEN="${MFE_SYNC_TOKEN:-}"

function auth_url() {
  local url="$1"
  if [ -n "$GIT_TOKEN" ]; then
    printf '%s' "${url/https:\/\/github.com\//https://x-access-token:$GIT_TOKEN@github.com/}"
  else
    printf '%s' "$url"
  fi
}

if [ ! -f "$MFE_CONFIG" ]; then
  echo "❌ Error: $MFE_CONFIG not found"
  echo "Please run: yarn sync:setup"
  exit 1
fi

echo "📦 Installing dependencies..."
cd "$PROJECT_ROOT"
yarn install --immutable

echo "📦 Building theme bundle..."
yarn theme:build-bundle

THEME_VERSION="$(node -p "require('./package.json').version")"
echo "✅ Theme version: $THEME_VERSION"

if [ -d "$TEMP_DIR" ]; then
  echo "🧹 Cleaning previous sync data..."
  rm -rf "$TEMP_DIR"
fi

mkdir -p "$TEMP_DIR"

echo "🔎 Loading micro frontend list from $MFE_CONFIG..."
readarray -t MFE_LINES < <(node - <<'NODE'
const cfg = require(process.argv[1]);
for (const mfe of cfg.mfes.filter((m) => m.enabled)) {
  console.log([mfe.name, mfe.url, mfe.branch || 'develop'].join('|'))
}
NODE
"$MFE_CONFIG")

if [ ${#MFE_LINES[@]} -eq 0 ]; then
  echo "⚠️  No enabled micro frontends found in $MFE_CONFIG"
  exit 1
fi

echo "🔄 Syncing theme to ${#MFE_LINES[@]} micro frontend(s)..."

for line in "${MFE_LINES[@]}"; do
  IFS='|' read -r MFE_NAME REPO_URL BRANCH <<< "$line"
  echo "\n📤 Syncing theme to $MFE_NAME ($REPO_URL@$BRANCH)..."

  MFE_DIR="$TEMP_DIR/$MFE_NAME"

  if [ -d "$MFE_DIR" ]; then
    echo "  ⏳ Updating existing clone..."
    cd "$MFE_DIR"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    cd "$PROJECT_ROOT"
  else
    echo "  ⏳ Cloning $MFE_NAME..."
    AUTH_REPO_URL="$(auth_url "$REPO_URL")"
    git clone --depth 1 --branch "$BRANCH" "$AUTH_REPO_URL" "$MFE_DIR"
  fi

  THEME_DEST="$MFE_DIR/src/theme-shared"
  rm -rf "$THEME_DEST"
  mkdir -p "$THEME_DEST"

  echo "  📂 Copying theme files to $THEME_DEST..."
  cp -r "$PROJECT_ROOT/src/theme/"* "$THEME_DEST/"
  cp "$PROJECT_ROOT/tailwind.config.js" "$THEME_DEST/"

  SYNC_TIMESTAMP="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  cat > "$THEME_DEST/version.ts" <<EOF
/**
 * Auto-generated theme version file
 * Last synced: $SYNC_TIMESTAMP
 */

export const THEME_METADATA = {
  version: '$THEME_VERSION',
  syncedAt: '$SYNC_TIMESTAMP',
  syncedBy: 'Theme Sync Script',
  syncTrigger: 'manual',
  repository: 'https://github.com/${GITHUB_REPOSITORY:-unknown}'
} as const;

export const THEME_VERSION = THEME_METADATA.version;
EOF

  cd "$MFE_DIR"
  git config user.name "Theme Sync Bot"
  git config user.email "theme-sync@ctms.dev"

  git add src/theme-shared/ || true

  if git diff --cached --quiet; then
    echo "  ✓ No theme changes detected in $MFE_NAME"
  else
    echo "  ✅ Theme changes detected in $MFE_NAME"
    git commit -m "chore(theme): sync theme updates from @ctms/theme@$THEME_VERSION"
    if git push origin "$BRANCH"; then
      echo "  ✓ Pushed theme updates to $MFE_NAME@$BRANCH"
    else
      echo "  ⚠️  Push failed for $MFE_NAME@$BRANCH"
      echo "    Please verify git credentials and branch protection rules."
    fi
  fi
  cd "$PROJECT_ROOT"
done

echo "\n🧹 Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "\n✅ Theme sync complete!"
echo "Version: $THEME_VERSION"
echo "Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
