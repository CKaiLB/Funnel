import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Newsletter from "./pages/Newsletter";
import Training from "./pages/Training";
import Congratulations from "./pages/Congratulations";
import NotFound from "./pages/NotFound";
import Roadmap from "./pages/Roadmap";

// Debug: Show webhook URL at app level
const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;
console.log('🔗 APP LEVEL - Webhook URL:', WEBHOOK_URL);

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
          <Route path="/training" element={<Training />} />
          <Route path="/congratulations" element={<Congratulations />} />
          <Route path="/roadmap" element={<Roadmap />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
