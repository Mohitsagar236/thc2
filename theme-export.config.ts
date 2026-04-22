/**
 * Theme Package Export Configuration
 * Exports the theme system as @ctms/theme for use in micro frontends
 */

export const themeExportConfig = {
  // Package exports
  exports: {
    ".": {
      import: "./dist/theme.js",
      require: "./dist/theme.cjs",
      types: "./dist/theme.d.ts",
    },
    "./themes": {
      import: "./dist/themes.js",
      require: "./dist/themes.cjs",
      types: "./dist/themes.d.ts",
    },
    "./styles": {
      import: "./dist/styles.css",
    },
    "./provider": {
      import: "./dist/provider.jsx",
      types: "./dist/provider.d.ts",
    },
    "./hooks": {
      import: "./dist/hooks.js",
      types: "./dist/hooks.d.ts",
    },
  },

  // Files to include in package
  files: [
    "dist",
    "src/theme",
    "tailwind.config.js",
    "CHANGELOG.md",
    "README.md",
  ],

  // Theme files to export
  themeExports: [
    "src/theme/themes/light.ts",
    "src/theme/themes/dark.ts",
    "src/theme/themes/ocean.ts",
    "src/theme/themes/compact.ts",
  ],

  // Shared paths for MFEs
  sharedPaths: {
    theme: "src/theme",
    tailwindConfig: "tailwind.config.js",
    typesFile: "src/theme/types.ts",
  },
};
