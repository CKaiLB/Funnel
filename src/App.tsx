import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Newsletter from "./pages/Newsletter";
import NotFound from "./pages/NotFound";
import AIRoadmap from "./pages/AIRoadmap";
import SalesFunnelPlaybook from "./pages/SalesFunnelPlaybook";
import Results from "./pages/Results";

// Validate environment variables in development
if (import.meta.env.DEV) {
  const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;
  const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
  if (!WEBHOOK_URL) {
    console.warn('⚠️ VITE_FUNNEL_EMAIL_WEBHOOK_URL not configured');
  }
  if (!BREVO_API_KEY) {
    console.warn('⚠️ VITE_BREVO_API_KEY not configured');
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/ai-roadmap" element={<AIRoadmap />} />
          <Route path="/sales-funnel-playbook" element={<SalesFunnelPlaybook />} />
          <Route path="/results" element={<Results />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
