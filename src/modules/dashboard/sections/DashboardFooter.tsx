import { DASHBOARD_CONFIG } from "@/config/dashboard.config";

export function DashboardFooter() {
  return (
    <footer className="mt-6 border-t border-[var(--color-border)] pt-4">
      <p className="m-0 text-center text-sm text-[var(--color-text-muted)]">
        {DASHBOARD_CONFIG.footer.text}
      </p>
    </footer>
  );
}
