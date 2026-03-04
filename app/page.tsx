import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { MarqueeDivider } from "@/components/marquee-divider"
import { WorkSection } from "@/components/work-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { GrainOverlay } from "@/components/grain-overlay"
import { AnalyticsProvider } from "@/components/analytics-provider";

export default function Page() {
  return (
    <main className="relative">
      <AnalyticsProvider />
      <CursorGlow />
      <GrainOverlay />
      <Navigation />
      <HeroSection />
      <MarqueeDivider />
      <WorkSection />
      <AboutSection />
      <MarqueeDivider />
      <ContactSection />
      <Footer />
    </main>
  )
}
