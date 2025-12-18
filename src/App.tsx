import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FraudDetection from "./pages/FraudDetection";
import ContentIntelligence from "./pages/ContentIntelligence";
import HealthPrediction from "./pages/HealthPrediction";
import EnvironmentAI from "./pages/EnvironmentAI";
import ImageAI from "./pages/ImageAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fraud" element={<FraudDetection />} />
          <Route path="/content" element={<ContentIntelligence />} />
          <Route path="/health" element={<HealthPrediction />} />
          <Route path="/environment" element={<EnvironmentAI />} />
          <Route path="/image" element={<ImageAI />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
