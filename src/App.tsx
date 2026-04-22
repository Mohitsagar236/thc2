import { lazy, Suspense } from "react";

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

// Loading fallback component
function SectionPlaceholder() {
  return <div className="h-32 animate-pulse bg-gray-200" />;
}

/**
 * Main Application Component
 * Renders the theme system dashboard with modular section components
 * Uses lazy loading for code splitting and performance optimization
 */
function App() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
        <Suspense fallback={<SectionPlaceholder />}>
          <DashboardHeader />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <CapabilityMatrix />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <FlowSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <CachingAndStartupSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <MFEIntegrationSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <QAGateSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder />}>
          <DashboardFooter />
        </Suspense>
      </section>
    </main>
  );
}

export default App;
