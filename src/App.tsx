import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import FraudDetection from "./pages/FraudDetection";
import ContentIntelligence from "./pages/ContentIntelligence";
import HealthPrediction from "./pages/HealthPrediction";
import EnvironmentAI from "./pages/EnvironmentAI";
import ImageAI from "./pages/ImageAI";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { AIChatAssistant } from "./components/AIChatAssistant";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  
  // Map routes to module names for context
  const moduleMap: Record<string, string> = {
    '/fraud': 'Fraud Detection',
    '/content': 'Content Intelligence',
    '/health': 'Health Prediction',
    '/environment': 'Environment & Crop AI',
    '/image': 'Image AI',
    '/analytics': 'Analytics Dashboard',
  };
  
  const currentModule = moduleMap[location.pathname];
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/fraud" element={<FraudDetection />} />
        <Route path="/content" element={<ContentIntelligence />} />
        <Route path="/health" element={<HealthPrediction />} />
        <Route path="/environment" element={<EnvironmentAI />} />
        <Route path="/image" element={<ImageAI />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatAssistant context={{ currentModule }} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
