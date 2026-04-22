import { lazy, Suspense } from "react";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";

// Lazy load all dashboard sections for code splitting
const DashboardHeader = lazy(() =>
  import("@/modules/dashboard/sections/DashboardHeader").then((m) => ({
    default: m.DashboardHeader,
  })),
);
const HeroSection = lazy(() =>
  import("@/modules/dashboard/sections/HeroSection").then((m) => ({
    default: m.HeroSection,
  })),
);
const CapabilityMatrix = lazy(() =>
  import("@/modules/dashboard/sections/CapabilityMatrix").then((m) => ({
    default: m.CapabilityMatrix,
  })),
);
const FlowSection = lazy(() =>
  import("@/modules/dashboard/sections/FlowSection").then((m) => ({
    default: m.FlowSection,
  })),
);
const CachingAndStartupSection = lazy(() =>
  import("@/modules/dashboard/sections/CachingAndStartupSection").then((m) => ({
    default: m.CachingAndStartupSection,
  })),
);
const MFEIntegrationSection = lazy(() =>
  import("@/modules/dashboard/sections/MFEIntegrationSection").then((m) => ({
    default: m.MFEIntegrationSection,
  })),
);
const QAGateSection = lazy(() =>
  import("@/modules/dashboard/sections/QAGateSection").then((m) => ({
    default: m.QAGateSection,
  })),
);
const DashboardFooter = lazy(() =>
  import("@/modules/dashboard/sections/DashboardFooter").then((m) => ({
    default: m.DashboardFooter,
  })),
);

const sectionList = [
  { id: "dashboard-header", Component: DashboardHeader },
  { id: "hero", Component: HeroSection },
  { id: "capabilities", Component: CapabilityMatrix },
  { id: "flow", Component: FlowSection },
  { id: "caching-startup", Component: CachingAndStartupSection },
  { id: "mfe-integration", Component: MFEIntegrationSection },
  { id: "qa-gate", Component: QAGateSection },
  { id: "dashboard-footer", Component: DashboardFooter },
];

// Loading fallback component
function SectionPlaceholder() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="h-32 animate-pulse rounded-3xl bg-slate-200 shadow-sm"
    />
  );
}

/**
 * Main Application Component
 * Renders a professional dashboard shell with graceful loading and error handling.
 */
function App() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
        <AppErrorBoundary>
          <div className="space-y-8">
            {sectionList.map(({ id, Component }) => (
              <Suspense key={id} fallback={<SectionPlaceholder />}>
                <Component />
              </Suspense>
            ))}
          </div>
        </AppErrorBoundary>
      </section>
    </main>
  );
}

export default App;
