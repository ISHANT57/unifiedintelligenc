import { Navbar } from '@/components/Navbar';
import { ModuleCard } from '@/components/ModuleCard';
import { 
  Shield, FileText, Heart, Leaf, Image, Brain,
  CreditCard, Link2, AlertTriangle, MessageSquare,
  Activity, Cpu
} from 'lucide-react';

const modules = [
  {
    title: 'Fraud Detection',
    description: 'Detect UPI fraud, credit card fraud, and phishing URLs using ML classification.',
    icon: Shield,
    href: '/fraud',
    gradient: 'bg-gradient-to-br from-red-500 to-orange-500',
    stats: { label: 'Detection Types', value: '3' }
  },
  {
    title: 'Content Intelligence',
    description: 'Identify fake news, fake reviews, and cyberbullying with NLP analysis.',
    icon: FileText,
    href: '/content',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    stats: { label: 'Analysis Types', value: '3' }
  },
  {
    title: 'Health Prediction',
    description: 'Predict stress levels and diabetes/heart disease risk factors.',
    icon: Heart,
    href: '/health',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
    stats: { label: 'Health Metrics', value: '2' }
  },
  {
    title: 'Environment & Crop',
    description: 'Crop recommendations and air quality predictions based on environmental data.',
    icon: Leaf,
    href: '/environment',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
    stats: { label: 'Predictions', value: '2' }
  },
  {
    title: 'Image AI',
    description: 'Plant disease detection using image analysis and symptom recognition.',
    icon: Image,
    href: '/image',
    gradient: 'bg-gradient-to-br from-purple-500 to-violet-500',
    stats: { label: 'Demo Level', value: 'CNN' }
  },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Intelligence Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Unified AI</span>
              <br />
              <span className="text-gradient">Intelligence Platform</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Multiple AI-powered modules for fraud detection, content analysis, health prediction, 
              and environmental insights — all with explainable AI.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span>ML + Rule-Based AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span>Real-time Predictions</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span>Gemini AI Explanations</span>
              </div>
            </div>
          </div>
          
          {/* Module Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <div 
                key={module.href} 
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ModuleCard {...module} />
              </div>
            ))}
          </div>
          
          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 text-center">
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Database Logging</h3>
              <p className="text-sm text-muted-foreground">All predictions logged to PostgreSQL for audit trails</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <Link2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">API Architecture</h3>
              <p className="text-sm text-muted-foreground">Modular edge functions for each AI capability</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Explainable AI</h3>
              <p className="text-sm text-muted-foreground">Gemini-powered explanations for every prediction</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
