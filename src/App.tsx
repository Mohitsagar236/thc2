import { DashboardHeader } from "@/modules/dashboard/sections/DashboardHeader";
import { HeroSection } from "@/modules/dashboard/sections/HeroSection";
import { CapabilityMatrix } from "@/modules/dashboard/sections/CapabilityMatrix";
import { FlowSection } from "@/modules/dashboard/sections/FlowSection";
import { CachingAndStartupSection } from "@/modules/dashboard/sections/CachingAndStartupSection";
import { MFEIntegrationSection } from "@/modules/dashboard/sections/MFEIntegrationSection";
import { QAGateSection } from "@/modules/dashboard/sections/QAGateSection";
import { DashboardFooter } from "@/modules/dashboard/sections/DashboardFooter";

/**
 * Main Application Component
 * Renders the theme system dashboard with modular section components
 */
function App() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
        <DashboardHeader />
        <HeroSection />
        <CapabilityMatrix />
        <FlowSection />
        <CachingAndStartupSection />
        <MFEIntegrationSection />
        <QAGateSection />
        <DashboardFooter />
      </section>
    </main>
  );
}

export default App;
