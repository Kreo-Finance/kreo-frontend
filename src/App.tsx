import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/components/Web3Provider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CreatorDashboard from "./pages/CreatorDashboard.tsx";
import CreatorOfferings from "./pages/CreatorOfferings.tsx";
import CreatorAnalytics from "./pages/CreatorAnalytics.tsx";
import CreatorBond from "./pages/CreatorBond.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import InvestorPortfolio from "./pages/InvestorPortfolio.tsx";
import InvestorEarnings from "./pages/InvestorEarnings.tsx";
import CreatorOnboarding from "./pages/onboarding/CreatorOnboarding.tsx";
import InvestorOnboarding from "./pages/onboarding/InvestorOnboarding.tsx";
import CreatorProfile from "./pages/CreatorProfile.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Pricing from "./pages/Pricing.tsx";
import HelpCenter from "./pages/HelpCenter.tsx";
import Documentation from "./pages/Documentation.tsx";
import Team from "./pages/Team.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const App = () => (
  <ThemeProvider>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/team" element={<Team />} />

            {/* Public creator profile */}
            <Route path="/creator/:address" element={<CreatorProfile />} />

            {/* Creator */}
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/offerings" element={<CreatorOfferings />} />
            <Route path="/creator/analytics" element={<CreatorAnalytics />} />
            <Route path="/creator/bond" element={<CreatorBond />} />

            {/* Investor */}
            <Route path="/investor/portfolio" element={<InvestorPortfolio />} />
            <Route path="/investor/earnings" element={<InvestorEarnings />} />

            {/* Onboarding */}
            <Route path="/onboarding/creator" element={<CreatorOnboarding />} />
            <Route
              path="/onboarding/investor"
              element={<InvestorOnboarding />}
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </ThemeProvider>
);

export default App;
