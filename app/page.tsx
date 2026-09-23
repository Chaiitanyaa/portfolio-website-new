import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { MarqueeDivider } from "@/components/marquee-divider"
import { WorkSection } from "@/components/work-section"
import { ActivitySection } from "@/components/activity-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { GrainOverlay } from "@/components/grain-overlay"
import { CropMarks } from "@/components/crop-marks"
import { SceneLayer } from "@/components/scene-layer"
import { AnalyticsProvider } from "@/components/analytics-provider"

export default function Page() {
  return (
    <>
      <AnalyticsProvider />
      <SceneLayer />
      <CursorGlow />
      <GrainOverlay />
      <CropMarks />
      <Navigation />
      <main id="main" className="relative z-10">
        <HeroSection />
        <MarqueeDivider />
        <WorkSection />
        <ActivitySection />
        <AboutSection />
        <MarqueeDivider />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
