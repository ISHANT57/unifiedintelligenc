import { cn } from '@/lib/utils';
import { RiskLevel } from '@/lib/aiModels';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';

interface PredictionResultProps {
  prediction: string;
  confidence: number;
  riskLevel: RiskLevel;
  explanation?: string;
  isLoadingExplanation?: boolean;
}

const riskConfig: Record<RiskLevel, { color: string; bgColor: string; icon: typeof AlertCircle; label: string }> = {
  low: { color: 'text-success', bgColor: 'bg-success/10 border-success/30', icon: CheckCircle, label: 'Low Risk' },
  medium: { color: 'text-warning', bgColor: 'bg-warning/10 border-warning/30', icon: AlertCircle, label: 'Medium Risk' },
  high: { color: 'text-destructive', bgColor: 'bg-destructive/10 border-destructive/30', icon: AlertTriangle, label: 'High Risk' },
  critical: { color: 'text-destructive', bgColor: 'bg-destructive/20 border-destructive/50', icon: XCircle, label: 'Critical' },
};

export function PredictionResult({ 
  prediction, 
  confidence, 
  riskLevel, 
  explanation,
  isLoadingExplanation 
}: PredictionResultProps) {
  const config = riskConfig[riskLevel];
  const Icon = config.icon;
  const confidencePercent = (confidence * 100).toFixed(1);
  
  return (
    <div className="space-y-4 animate-slide-in-up">
      {/* Main Result Card */}
      <div className={cn(
        "rounded-xl border-2 p-6 transition-all duration-300",
        config.bgColor
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            "bg-background/50"
          )}>
            <Icon className={cn("w-6 h-6", config.color)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                config.bgColor, config.color
              )}>
                {config.label}
              </span>
            </div>
            
            <h3 className="text-xl font-bold font-mono text-foreground mb-2">
              {prediction}
            </h3>
            
            {/* Confidence Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Confidence Score</span>
                <span className={cn("font-mono font-bold", config.color)}>{confidencePercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    riskLevel === 'low' ? 'bg-success' :
                    riskLevel === 'medium' ? 'bg-warning' : 'bg-destructive'
                  )}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Explanation Card */}
      {(explanation || isLoadingExplanation) && (
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-foreground">AI Explanation</h4>
          </div>
          
          {isLoadingExplanation ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Generating AI explanation...</span>
            </div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none">
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
