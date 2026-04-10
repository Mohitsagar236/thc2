/**
 * Theme System Deployment & Configuration Guide
 *
 * This file documents the complete setup for:
 * 1. Verdaccio private NPM registry
 * 2. CI/CD pipeline integration
 * 3. CDN configuration and deployment
 * 4. Environment variables and secrets
 */

// ============================================================================
// PART 1: VERDACCIO SETUP
// ============================================================================

export const VERDACCIO_SETUP = `
# 1. Install Verdaccio
npm install -g verdaccio

# 2. Start Verdaccio server
verdaccio

# Runs on http://localhost:4873 by default

# 3. Create .npmrc file in project root
cat > .npmrc << EOF
registry=http://localhost:4873
//:always-auth=true
EOF

# 4. Set authentication token (generate in Verdaccio web UI)
npm adduser --registry http://localhost:4873

# 5. Publish to Verdaccio
npm publish --registry http://localhost:4873

# 6. Verify publication
npm view @ctms/theme --registry http://localhost:4873

# 7. Tag version as stable
npm dist-tag add @ctms/theme@1.0.0 stable --registry http://localhost:4873
`;

// ============================================================================
// PART 2: ENVIRONMENT VARIABLES & SECRETS
// ============================================================================

export const ENV_TEMPLATE = `
# .env.local (NEVER commit this file)
# Theme System Environment Variables

# Verdaccio Configuration
VERDACCIO_URL=https://verdaccio.company.com
VERDACCIO_REGISTRY=@ctms:registry=https://verdaccio.company.com
VERDACCIO_TOKEN=<SENSITIVE - from secrets manager>

# CDN Configuration
CDN_URL=https://cdn.company.com/themes
CDN_BUCKET=company-themes-cdn
CDN_REGION=us-east-1
CDN_ACCESS_KEY=<SENSITIVE - from secrets manager>
CDN_SECRET_KEY=<SENSITIVE - from secrets manager>

# Runtime bundle loading (Vite-exposed)
VITE_THEME_STABLE_URL=https://cdn.company.com/themes/stable/all-themes.js
VITE_THEME_BUNDLE_TIMEOUT_MS=6000

# Build Configuration
THEME_OUTPUT_DIR=dist/theme
THEME_BUNDLE_VERSION=1.0.0
NODE_ENV=production

# GitHub Actions (set in repository secrets)
# Settings > Secrets and variables > Actions
# VERDACCIO_TOKEN
# CDN_UPLOAD_KEY
# CDN_BUCKET
# CDN_REGION
`;

// ============================================================================
// PART 3: GitHub Actions Secrets Setup
// ============================================================================

export const GITHUB_SECRETS_SETUP = `
# In GitHub Repository:
# 1. Go to Settings > Secrets and variables > Actions
# 2. Click "New repository secret"
# 3. Add these secrets (exact names):

VERDACCIO_TOKEN      # NPM auth token for publishing
CDN_BUCKET          # S3 bucket name for theme bundles
CDN_UPLOAD_KEY      # AWS Access Key for CDN uploads
CDN_REGION          # AWS region (e.g., us-east-1)
VERDACCIO_URL       # Registry URL

# To create Verdaccio token:
# 1. Visit http://localhost:4873/-/web/
# 2. Log in with your credentials
# 3. Copy auth token from ~/.npmrc or local storage

# To create AWS credentials:
# 1. AWS Console > IAM > Users > Create User
# 2. Attach S3 full access policy to user
# 3. Generate access key and secret
# 4. Store in GitHub secrets
`;

// ============================================================================
// PART 4: CDN DEPLOYMENT OPTIONS
// ============================================================================

export const CDN_DEPLOYMENT = {
  AWS_S3: `
# AWS S3 + CloudFront CDN Setup

# 1. Create S3 bucket
aws s3 mb s3://company-themes --region us-east-1

# 2. Configure bucket for public reading
aws s3api put-bucket-policy --bucket company-themes --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::company-themes/*"
  }]
}'

# 3. Upload bundle to S3
aws s3 cp dist/theme/all-themes.js s3://company-themes/themes/stable/all-themes.js
aws s3 cp dist/theme/all-themes-v1.0.0.js s3://company-themes/themes/1.0.0/all-themes.js

# 4. Configure versioned URL for permanent caching
aws s3api put-object --bucket company-themes --key themes/1.0.0/all-themes.js \\
  --body dist/theme/all-themes-v1.0.0.js \\
  --cache-control "max-age=31536000,immutable"

# 5. Configure stable URL for short TTL
aws s3api put-object --bucket company-themes --key themes/stable/all-themes.js \\
  --body dist/theme/all-themes.js \\
  --cache-control "max-age=60,must-revalidate"

# 6. Create CloudFront distribution
# - Origin: S3 bucket domain
# - Cache behaviors:
#   - /themes/*/all-themes.js (versioned): Cache forever (31536000s)
#   - /themes/stable/all-themes.js: Cache 60s TTL
# - Compression: Enable gzip
`,

  Cloudflare: `
# Cloudflare CDN Setup

# 1. Upload bundle to Cloudflare
curl -X POST https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/storage/kv/namespaces/NAMESPACE_ID/values/themes/1.0.0/all-themes.js \\
  --data-binary @dist/theme/all-themes.js \\
  -H "Authorization: Bearer CLOUDFLARE_TOKEN"

# 2. Create worker for smart caching
# ============================================================================
# Cloudflare Worker Script (cloudflare-worker.js)
# ============================================================================

addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Versioned URLs: cache forever
  if (url.pathname.match(/\\\\/themes\\\\/v?\\\\d+\\\\/all-themes.js/)) {
    return event.respondWith(
      fetch(event.request, {
        cf: {
          cacheTtl: 31536000, // 1 year
          cacheEverything: true
        }
      })
    );
  }
  
  // Stable URL: cache 60 seconds
  if (url.pathname === '/themes/stable/all-themes.js') {
    return event.respondWith(
      fetch(event.request, {
        cf: {
          cacheTtl: 60,
          minify: { javascript: true }
        }
      })
    );
  }
  
  return event.respondWith(fetch(event.request));
});
`,

  Generic: `
# Generic CDN / Any Provider

# 1. Build and upload bundle
npm run theme:build-bundle

# 2. Upload to your CDN's upload endpoint
# (replace with your CDN provider's method)

curl -X POST https://your-cdn.com/api/upload \\
  -F "file=@dist/theme/all-themes.js" \\
  -F "path=/themes/stable/all-themes.js" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# 3. Set cache headers
# Versioned URL: Cache-Control: max-age=31536000, immutable
# Stable URL:   Cache-Control: max-age=60, must-revalidate

# 4. Verify deployment
curl https://your-cdn.com/themes/stable/all-themes.js -I
`,
};

// ============================================================================
// PART 5: DEPLOYMENT CHECKLIST
// ============================================================================

export const DEPLOYMENT_CHECKLIST = {
  "Pre-Deployment": [
    "✓ All accessibility tests (npm run theme:validate) pass",
    "✓ ESLint and Prettier checks pass (npm run lint && npm run format:check)",
    "✓ Build completes successfully (npm run build)",
    "✓ Bundle size within limits (npm run theme:check-size)",
    "✓ QA approval recorded",
    "✓ All layout variants tested",
    "✓ Dark mode contrast verified",
    "✓ Keyboard navigation tested",
  ],

  "Publishing to Verdaccio": [
    "✓ Version bumped in package.json",
    "✓ CHANGELOG updated",
    "✓ All commits pushed to git",
    "✓ npm publish succeeds",
    "✓ Verdaccio shows new version",
  ],

  "CDN Deployment": [
    "✓ Build theme bundle (npm run theme:build-bundle)",
    "✓ Upload to CDN versioned URL (/themes/1.0.0/all-themes.js)",
    "✓ Upload to CDN stable URL (/themes/stable/all-themes.js)",
    "✓ Verify versioned URL loads (cache forever)",
    "✓ Verify stable URL loads (cache 60s)",
    "✓ Test in browser DevTools: Network tab shows correct URLs",
  ],

  "Post-Deployment": [
    "✓ Stable tag updated (npm dist-tag add @ctms/theme@1.0.0 stable)",
    "✓ Host application picks up new bundle on next page load",
    "✓ Theme selector dropdown populated correctly",
    "✓ Theme switching works without page reload",
    "✓ localStorage keys set correctly",
    "✓ Verify in production: no console errors",
    "✓ Rollback procedure documented and tested",
  ],
};

// ============================================================================
// PART 6: ROLLBACK PROCEDURE
// ============================================================================

export const ROLLBACK_PROCEDURE = `
# Emergency Rollback (if new version has issues)

# Step 1: Identify previous working version
npm view @ctms/theme versions

# Step 2: Revert stable tag to previous version
npm dist-tag add @ctms/theme@2.0.1 stable

# Or run the rollback workflow manually:
# GitHub Actions -> Theme Validation & Publishing -> Run workflow
# operation=rollback
# rollbackVersion=2.0.1

# Step 3: Verify tag change
npm view @ctms/theme@stable version

# Step 4: CI detects tag change automatically
# - Rebuilds bundle from v2.0.1
# - Re-uploads to CDN stable URL
# - Within 60 seconds, users receive old bundle

# Step 5: Users on next page load get rolled-back version
# - Those with old bundle cached: No change (already have it)
# - Those doing fresh load: Get v2.0.1 from CDN
# - Browser cache honored for 60s

# Step 6: Investigate issue with v2.2.0
# - Save logs from failed deployment
# - Identify breaking changes
# - Fix in v2.2.1
# - Re-publish when ready

# Notes:
# - Old versions NEVER deleted from Verdaccio
# - Rollback is instantaneous (just a tag update)
# - Users don't need to do anything
# - All changes transparent to MFEs
`;

// ============================================================================
// PART 7: MONITORING & HEALTH CHECKS
// ============================================================================

export const MONITORING_SETUP = `
# Monitoring Checklist

# 1. CDN Health Endpoint
GET https://cdn.company.com/themes/stable/all-themes.js
Expected: 200 OK, Content-Type: application/javascript

# 2. Verdaccio Registry Health
npm view @ctms/theme@stable version
Expected: [current-version-number]

# 3. Bundle Integrity (SHA256)
npm view @ctms/theme@stable dist.shasum
Compare with: sha256sum dist/theme/all-themes.js

# 4. Browser DevTools Check
# 1. Open host application
# 2. DevTools > Network tab
# 3. Check /themes/stable/all-themes.js loads
# 4. Verify size: ~5-8 KB gzipped
# 5. Verify cache headers honored

# 5. CSS Variables Injection
# 1. DevTools > Console
# 2. getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
# 3. Should return hex value, not empty

# 6. localStorage Verification
# 1. DevTools > Application > Storage > localStorage
# 2. Check ctms:theme-preference key exists
# 3. Check ctms:token-cache has theme bundle

# 7. Alerts & Notifications
# - CDN returns 404 or 50x: Alert ops team
# - Bundle size spike: Alert architecture team
# - Contrast validation fails: Block release automatically
# - Deploy takes > 5 minutes: Investigate CI
`;

// ============================================================================
// PART 8: TROUBLESHOOTING
// ============================================================================

export const TROUBLESHOOTING = {
  "Bundle not loading": [
    "1. Check CDN URL in index.html",
    "2. Verify CDN CORS headers allow origin",
    "3. Check browser console for CORS errors",
    "4. Fallback: Check localStorage ctms:token-cache",
  ],

  "Theme not applying": [
    "1. Verify bundle loaded (Network tab)",
    "2. Check CSS variables set on document.rootElement",
    "3. Check body has layout-* class",
    "4. Check density-* class applied",
  ],

  "Old bundle in browser": [
    "1. Check cache headers (should be 60s for stable URL)",
    "2. Hard refresh (Ctrl+Shift+R) browser cache",
    "3. Clear localStorage: localStorage.clear()",
    "4. Wait 60s for stable CDN cache to refresh",
  ],

  "Publishing fails": [
    "1. Check Verdaccio token not expired",
    "2. Verify .npmrc registry URL correct",
    "3. Run: npm login --registry=YOUR_REGISTRY",
    "4. Check: npm whoami --registry=YOUR_REGISTRY",
  ],
};

export const DEPLOYMENT_GUIDE = {
  VERDACCIO_SETUP,
  ENV_TEMPLATE,
  GITHUB_SECRETS_SETUP,
  CDN_DEPLOYMENT,
  DEPLOYMENT_CHECKLIST,
  ROLLBACK_PROCEDURE,
  MONITORING_SETUP,
  TROUBLESHOOTING,
};
