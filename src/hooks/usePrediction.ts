import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PredictionResult } from '@/lib/aiModels';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ModuleType = Database['public']['Enums']['ai_module_type'];

interface UsePredictionReturn {
  result: PredictionResult | null;
  explanation: string | null;
  isLoading: boolean;
  isLoadingExplanation: boolean;
  runPrediction: (
    moduleType: ModuleType,
    inputData: Record<string, unknown>,
    predictFn: () => PredictionResult
  ) => Promise<void>;
}

export function usePrediction(): UsePredictionReturn {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const { toast } = useToast();

  const runPrediction = async (
    moduleType: ModuleType,
    inputData: Record<string, unknown>,
    predictFn: () => PredictionResult
  ) => {
    setIsLoading(true);
    setResult(null);
    setExplanation(null);

    try {
      // Run the prediction
      const prediction = predictFn();
      setResult(prediction);
      setIsLoading(false);
      
      // Log to database and capture the inserted record ID
      const { data: insertedRecord, error: dbError } = await supabase
        .from('predictions')
        .insert([{
          module_type: moduleType,
          input_data: inputData as any,
          prediction_result: prediction.prediction,
          confidence_score: prediction.confidence,
          risk_level: prediction.riskLevel,
        }])
        .select('id')
        .single();

      if (dbError) {
        console.error('Failed to log prediction:', dbError);
      }

      // Get AI explanation
      setIsLoadingExplanation(true);
      
      const { data, error } = await supabase.functions.invoke('ai-explain', {
        body: {
          moduleType,
          inputData,
          prediction: prediction.prediction,
          confidence: prediction.confidence,
          riskLevel: prediction.riskLevel,
        },
      });

      if (error) {
        console.error('AI explanation error:', error);
        toast({
          title: "AI Explanation unavailable",
          description: "Could not generate AI explanation. Prediction still valid.",
          variant: "destructive",
        });
      } else if (data?.explanation) {
        setExplanation(data.explanation);
        
        // Update the prediction record with explanation using the captured ID
        if (insertedRecord?.id) {
          await supabase
            .from('predictions')
            .update({ ai_explanation: data.explanation })
            .eq('id', insertedRecord.id);
        }
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingExplanation(false);
    }
  };

  return {
    result,
    explanation,
    isLoading,
    isLoadingExplanation,
    runPrediction,
  };
}
