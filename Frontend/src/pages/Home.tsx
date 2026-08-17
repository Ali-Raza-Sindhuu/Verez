import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import LogoStrip from "../components/home/LogoStrip";
import Features from "../components/home/Features";
import GrowthShowcase from "../components/home/GrowthShowcase";
import OrderControl from "../components/home/OrderControl";
import Pricing from "../components/home/Pricing";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="bg-ink text-cream font-body min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <LogoStrip />
      <Features />
      <GrowthShowcase />
      <OrderControl />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
