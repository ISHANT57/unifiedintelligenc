import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FraudDetection from "./pages/FraudDetection";
import ContentIntelligence from "./pages/ContentIntelligence";
import HealthPrediction from "./pages/HealthPrediction";
import EnvironmentAI from "./pages/EnvironmentAI";
import ImageAI from "./pages/ImageAI";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { AIChatAssistant } from "./components/AIChatAssistant";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  
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
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/fraud" element={<ProtectedRoute><FraudDetection /></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute><ContentIntelligence /></ProtectedRoute>} />
        <Route path="/health" element={<ProtectedRoute><HealthPrediction /></ProtectedRoute>} />
        <Route path="/environment" element={<ProtectedRoute><EnvironmentAI /></ProtectedRoute>} />
        <Route path="/image" element={<ProtectedRoute><ImageAI /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {user && <AIChatAssistant context={{ currentModule }} />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
