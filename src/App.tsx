import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/components/Web3Provider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CreatorDashboard from "./pages/CreatorDashboard.tsx";
import CreatorOfferings from "./pages/CreatorOfferings.tsx";
import CreatorAnalytics from "./pages/CreatorAnalytics.tsx";
import CreatorBond from "./pages/CreatorBond.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import InvestorPortfolio from "./pages/InvestorPortfolio.tsx";
import InvestorEarnings from "./pages/InvestorEarnings.tsx";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/offerings" element={<CreatorOfferings />} />
          <Route path="/creator/analytics" element={<CreatorAnalytics />} />
          <Route path="/creator/bond" element={<CreatorBond />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/investor/portfolio" element={<InvestorPortfolio />} />
          <Route path="/investor/earnings" element={<InvestorEarnings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;

