import { ThemeSelector } from "@/components/ThemeSelector";
import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function DashboardHeader() {
  const { headerTitle, headerSubtitle, logoText } = {
    headerTitle: DASHBOARD_CONFIG.header.title,
    headerSubtitle: DASHBOARD_CONFIG.header.subtitle,
    logoText: DASHBOARD_CONFIG.header.logoText,
  };

  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-primary)] text-sm font-bold text-[var(--color-surface)]"
          aria-hidden="true"
        >
          {logoText}
        </span>
        <div>
          <p className="m-0 text-sm font-semibold tracking-wide">
            {headerTitle}
          </p>
          <p className="m-0 mt-0.5 text-xs text-[var(--color-text-muted)]">
            {headerSubtitle}
          </p>
        </div>
      </div>
      <ThemeSelector />
    </header>
  );
}
