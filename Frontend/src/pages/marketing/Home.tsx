import { ChallengeStrip } from "@/components/home/ChallengeStrip";
import { DashboardMock } from "@/components/home/DashboardMock";
import { FeaturesSection } from "@/components/home/FeatureSection";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { IntegrationsSection } from "@/components/home/IntegratedSection";
import { Navbar } from "@/components/home/Navbar";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialSection";


/**
 * VEXEZ — Product marketing home page
 * Palette: ink (#14151A), porcelain (#F6F4EF), signal amber (#E8A33D),
 * ledger green (#3E7C59), wire blue (#4C6FFF)
 *
 * Each section now lives in its own file under ./components/, with
 * shared animation helpers in ./lib/shared. Rearrange, remove, or
 * lazy-load sections independently as needed.
 */
export default function Home() {
  return (
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
  );
}