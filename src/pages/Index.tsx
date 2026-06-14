import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BannerSection from "@/components/BannerSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import RaiseCalculatorSection from "@/components/RaiseCalculatorSection";
import ComparisonSection from "@/components/ComparisonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";
import RoadmapSection from "@/components/RoadmapSection";
import TeamSection from "@/components/TeamSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BannerSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RaiseCalculatorSection />
      <ComparisonSection />
      <RoadmapSection />
      {/* <TestimonialsSection /> */}
      {/* <TeamSection /> */}
      <FAQSection />
      <FooterSection />
    </div>
  );
};

export default Index;
