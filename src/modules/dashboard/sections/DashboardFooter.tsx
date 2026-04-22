import { useTheme } from "@/theme";
import { DASHBOARD_CONFIG } from "@/config/dashboard.config";
import { SectionFrame } from "@/components/SectionFrame";

export function DashboardFooter() {
  const { currentTheme, catalogueVersion, catalogueSource } = useTheme();

  return (
    <footer className="mt-6" aria-labelledby="dashboard-footer-title">
      <SectionFrame>
        <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              id="dashboard-footer-title"
              className="text-base font-semibold text-[var(--color-text)]"
            >
              Dashboard summary
            </p>
            <p className="mt-2 text-[var(--color-text-muted)]">
              {DASHBOARD_CONFIG.footer.text}
            </p>
          </div>
          <div className="grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
              <p className="text-[var(--color-text-muted)]">Active theme</p>
              <p className="mt-1 font-semibold text-[var(--color-text)]">
                {currentTheme}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
              <p className="text-[var(--color-text-muted)]">Catalogue</p>
              <p className="mt-1 font-semibold text-[var(--color-text)]">
                v{catalogueVersion}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
              <p className="text-[var(--color-text-muted)]">Source</p>
              <p className="mt-1 font-semibold text-[var(--color-text)]">
                {catalogueSource}
              </p>
            </div>
          </div>
        </div>
      </SectionFrame>
    </footer>
  );
}
