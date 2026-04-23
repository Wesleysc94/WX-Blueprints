import {
  FaqSection,
  FeaturedTemplateSection,
  FreeTemplatesGallery,
  HeroSection,
  HowItWorksSection,
  PricingPreview,
  ProofStrip,
  ValueProps,
} from "@/components/sections/HomepageSections";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div className="mx-auto w-full max-w-6xl px-6">
        <ProofStrip />
        <ValueProps />
        <FreeTemplatesGallery />
        <HowItWorksSection />
        <FeaturedTemplateSection />
        <PricingPreview />
        <FaqSection />
      </div>
    </main>
  );
}
