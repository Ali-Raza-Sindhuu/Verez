import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChallengeStrip } from "@/components/home/ChallengeStrip";
import { DashboardMock } from "@/components/home/DashboardMock";
import { FeaturesSection } from "@/components/home/FeatureSection";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { IntegrationsSection } from "@/components/home/IntegratedSection";
import { Navbar } from "@/components/home/Navbar";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialSection";
import { HomeLoader } from "@/components/home/HomeLoader";

/**
 * VEXEZ — Product marketing home page
 * Palette: ink (#14151A), porcelain (#F6F4EF), signal amber (#E8A33D),
 * ledger green (#3E7C59), wire blue (#3D6DF2)
 *
 * Each section lives in its own file under ./components/home, with shared
 * animation helpers in ./lib/shared. Rearrange, remove, or lazy-load
 * sections independently as needed.
 *
 * HomeLoader below is scoped to this page only — it does not replace or
 * interact with the app-wide LoadingScreen used by ProtectedRoute during
 * auth bootstrap. Page content only mounts once the loader has finished,
 * so each section's own entrance animation (fadeUp, whileInView, etc.)
 * plays naturally right after the intro clears, instead of firing early
 * underneath it.
 */
export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!loaded && <HomeLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <div className="min-h-screen bg-[#F6F4EF] font-sans antialiased">
          <Navbar />
          <Hero />
          <ChallengeStrip />
          <DashboardMock />
          <FeaturesSection />
          <IntegrationsSection />
          <TestimonialsSection />
          <PricingSection />
          <Footer />
        </div>
      )}
    </>
  );
}
