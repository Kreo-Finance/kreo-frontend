import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BannerSection from "@/components/BannerSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ComparisonSection from "@/components/ComparisonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";
import FAQSection from "@/components/FAQSection";
import RoadmapSection from "@/components/RoadmapSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BannerSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ComparisonSection />
      <RoadmapSection />
      {/* <TestimonialsSection /> */}
      <FAQSection />
      <FooterSection />
    </div>
  );
};

export default Index;
