/**
 * Theme Versioning & Distribution Tag Management
 *
 * Handles:
 * - Version extraction from package.json
 * - dist-tag operations (npm dist-tag add)
 * - Version compatibility checks
 * - Rollback strategy
 */

export interface ThemeVersion {
  version: string;
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  timestamp: string;
}

/**
 * Parse semantic version string
 */
export function parseVersion(versionString: string): ThemeVersion {
  const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)(?:-([\w.]+))?$/);

  if (!match) {
    throw new Error(`Invalid version format: ${versionString}`);
  }

  return {
    version: versionString,
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Compare two versions
 * Returns: -1 (first is older), 0 (equal), 1 (first is newer)
 */
export function compareVersions(v1: string, v2: string): number {
  const pv1 = parseVersion(v1);
  const pv2 = parseVersion(v2);

  if (pv1.major !== pv2.major) return pv1.major > pv2.major ? 1 : -1;
  if (pv1.minor !== pv2.minor) return pv1.minor > pv2.minor ? 1 : -1;
  if (pv1.patch !== pv2.patch) return pv1.patch > pv2.patch ? 1 : -1;

  // Prerelease versions are older than release versions
  if (pv1.prerelease && !pv2.prerelease) return -1;
  if (!pv1.prerelease && pv2.prerelease) return 1;

  return 0;
}

/**
 * Check if a version is compatible with a specific major version
 */
export function isCompatible(
  themeVersion: string,
  requiredMajor: number,
): boolean {
  const parsed = parseVersion(themeVersion);
  return parsed.major === requiredMajor;
}

/**
 * Version constraint checking (semver-like)
 */
export function satisfiesConstraint(
  version: string,
  constraint: string,
): boolean {
  // Simple constraint syntax:
  // "^1.0.0" - compatible with 1.x.x (>= 1.0.0, < 2.0.0)
  // "~1.2.0" - compatible with 1.2.x (>= 1.2.0, < 1.3.0)
  // "1.0.0" - exact match
  // ">1.0.0" - greater than
  // "<2.0.0" - less than

  const caret = constraint.startsWith("^");
  const tilde = constraint.startsWith("~");
  const gte = constraint.startsWith(">");
  const lte = constraint.startsWith("<");

  const compareVersion = constraint.replace(/^[\^~<>]+/, "");
  const result = compareVersions(version, compareVersion);

  if (caret) {
    // ^1.2.3 := >=1.2.3 <2.0.0
    const parsed = parseVersion(compareVersion);
    const versionMajor = parseVersion(version).major;
    return versionMajor === parsed.major && result >= 0;
  }

  if (tilde) {
    // ~1.2.3 := >=1.2.3 <1.3.0
    const parsed = parseVersion(compareVersion);
    const versionParsed = parseVersion(version);
    return (
      versionParsed.major === parsed.major &&
      versionParsed.minor === parsed.minor &&
      result >= 0
    );
  }

  if (gte) return result > 0;
  if (lte) return result < 0;

  return result === 0;
}

/**
 * Distribution tag management commands
 * (To be run in CI/CD pipeline)
 */
export const DIST_TAG_COMMANDS = {
  publishNew: (version: string, registry: string) => `
npm set registry ${registry}
npm publish
npm dist-tag add @ctms/theme@${version} stable
  `,

  rollback: (previousVersion: string, registry: string) => `
npm set registry ${registry}
npm dist-tag add @ctms/theme@${previousVersion} stable
  `,

  listTags: (registry: string) => `
npm set registry ${registry}
npm dist-tag ls @ctms/theme
  `,
};

/**
 * Bundle size thresholds
 */
export const BUNDLE_THRESHOLDS = {
  // Uncompressed sizes
  maxSize: 50000, // bytes
  maxSizeGz: 15000, // gzipped

  warnings: {
    approaching: 45000, // Warn if approaching limit
    approachingGz: 14000,
  },
};

/**
 * Check bundle size against thresholds
 */
export function validateBundleSize(
  uncompressedBytes: number,
  gzipBytes: number,
): {
  passed: boolean;
  uncompressed: { value: number; limit: number; ok: boolean };
  gzip: { value: number; limit: number; ok: boolean };
  message: string;
} {
  const uncompressedOk = uncompressedBytes <= BUNDLE_THRESHOLDS.maxSize;
  const gzipOk = gzipBytes <= BUNDLE_THRESHOLDS.maxSizeGz;

  return {
    passed: uncompressedOk && gzipOk,
    uncompressed: {
      value: uncompressedBytes,
      limit: BUNDLE_THRESHOLDS.maxSize,
      ok: uncompressedOk,
    },
    gzip: { value: gzipBytes, limit: BUNDLE_THRESHOLDS.maxSizeGz, ok: gzipOk },
    message: [
      uncompressedOk
        ? `✓ Uncompressed: ${(uncompressedBytes / 1024).toFixed(2)}KB (limit: ${(BUNDLE_THRESHOLDS.maxSize / 1024).toFixed(0)}KB)`
        : `✗ Uncompressed: ${(uncompressedBytes / 1024).toFixed(2)}KB exceeds limit ${(BUNDLE_THRESHOLDS.maxSize / 1024).toFixed(0)}KB`,
      gzipOk
        ? `✓ Gzipped: ${(gzipBytes / 1024).toFixed(2)}KB (limit: ${(BUNDLE_THRESHOLDS.maxSizeGz / 1024).toFixed(0)}KB)`
        : `✗ Gzipped: ${(gzipBytes / 1024).toFixed(2)}KB exceeds limit ${(BUNDLE_THRESHOLDS.maxSizeGz / 1024).toFixed(0)}KB`,
    ].join("\n"),
  };
}

/**
 * Version release process
 */
export interface ReleaseProcess {
  currentVersion: string;
  newVersion: string;
  breakingChanges: boolean;
  newThemesAdded: boolean;
  tokenUpdates: boolean;
  wcagValidationPassed: boolean;
  qaApproved: boolean;
  readyForStable: boolean;
}

/**
 * Determine if publish should be tagged as stable
 */
export function isReadyForStableTag(release: ReleaseProcess): {
  ready: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (!release.wcagValidationPassed) {
    reasons.push("WCAG validation failed");
  }

  if (!release.qaApproved) {
    reasons.push("QA approval not recorded");
  }

  // Check if version is pre-1.0 (breaking changes in early versions)
  const newVersionParsed = parseVersion(release.newVersion);
  if (release.breakingChanges && newVersionParsed.major === 0) {
    reasons.push("Pre-1.0 major changes should stay in beta (tag as next)");
  }

  // Only tag as stable if all checks pass
  const ready =
    reasons.length === 0 && release.wcagValidationPassed && release.qaApproved;

  return { ready, reasons };
}

/**
 * Get the appropriate dist-tag for a version
 */
export function getDistTag(
  version: string,
  isStable: boolean,
  isLatest: boolean,
): string {
  const parsed = parseVersion(version);

  if (parsed.prerelease) {
    return "beta"; // Pre-release goes to beta
  }

  if (!isStable) {
    return "next"; // Non-stable goes to next
  }

  if (isLatest) {
    return "latest"; // Most recent stable is latest
  }

  return "stable"; // Falls back to stable
}

// Example CLI commands for version management:
export const VERSION_MANAGEMENT_EXAMPLES = `
# Check current stable version
npm view @ctms/theme@stable version

# View all published versions
npm dist-tag ls @ctms/theme

# Tag new version as stable
npm dist-tag add @ctms/theme@2.1.0 stable

# Rollback to previous version
npm dist-tag add @ctms/theme@2.0.1 stable

# Remove a dist-tag (destructive)
npm dist-tag rm @ctms/theme beta

# Show all major versions
npm view @ctms/theme versions
`;
