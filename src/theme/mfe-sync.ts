import type { ThemeDefinition } from "./types";

export const THEME_SYNC_EVENT_NAME = "theme-changed";

export type LayoutVariant = ThemeDefinition["layout"];
export type DensityVariant = ThemeDefinition["density"];

export type AppearanceSyncSource =
  | "host-theme-switch"
  | "host-layout-switch"
  | "host-initial-load";

export interface AppearanceSyncDetail {
  themeName: string;
  layout: LayoutVariant;
  density: DensityVariant;
  source: AppearanceSyncSource;
  emittedAt: string;
}

const LAYOUT_VARIANTS: LayoutVariant[] = ["layout-sidebar", "layout-top-nav"];
const DENSITY_VARIANTS: DensityVariant[] = [
  "density-compact",
  "density-comfortable",
];

function findVariantByPrefix<T extends string>(
  classList: DOMTokenList,
  prefix: string,
  allowedVariants: readonly T[],
): T | null {
  for (const className of Array.from(classList)) {
    if (!className.startsWith(prefix)) {
      continue;
    }

    if (allowedVariants.includes(className as T)) {
      return className as T;
    }
  }

  return null;
}

function isAppearanceSyncDetail(value: unknown): value is AppearanceSyncDetail {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<AppearanceSyncDetail>;

  return (
    typeof payload.themeName === "string" &&
    typeof payload.layout === "string" &&
    LAYOUT_VARIANTS.includes(payload.layout as LayoutVariant) &&
    typeof payload.density === "string" &&
    DENSITY_VARIANTS.includes(payload.density as DensityVariant) &&
    typeof payload.source === "string" &&
    typeof payload.emittedAt === "string"
  );
}

export function getCurrentLayoutVariant(
  fallback: LayoutVariant = "layout-sidebar",
): LayoutVariant {
  return (
    findVariantByPrefix(document.body.classList, "layout-", LAYOUT_VARIANTS) ||
    fallback
  );
}

export function getCurrentDensityVariant(
  fallback: DensityVariant = "density-comfortable",
): DensityVariant {
  return (
    findVariantByPrefix(
      document.body.classList,
      "density-",
      DENSITY_VARIANTS,
    ) || fallback
  );
}

export function dispatchAppearanceSync(
  detail: Omit<AppearanceSyncDetail, "emittedAt"> & { emittedAt?: string },
): void {
  const event = new CustomEvent<AppearanceSyncDetail>(THEME_SYNC_EVENT_NAME, {
    detail: {
      ...detail,
      emittedAt: detail.emittedAt || new Date().toISOString(),
    },
    bubbles: true,
    composed: true,
    cancelable: false,
  });

  window.dispatchEvent(event);
}

export function subscribeToAppearanceSync(
  listener: (detail: AppearanceSyncDetail) => void,
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<unknown>;
    if (!isAppearanceSyncDetail(customEvent.detail)) {
      return;
    }

    listener(customEvent.detail);
  };

  window.addEventListener(THEME_SYNC_EVENT_NAME, handler);

  return () => {
    window.removeEventListener(THEME_SYNC_EVENT_NAME, handler);
  };
}
