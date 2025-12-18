import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageHeader } from '@/components/PageHeader';
import { PredictionResult } from '@/components/PredictionResult';
import { usePrediction } from '@/hooks/usePrediction';
import { predictPlantDisease } from '@/lib/aiModels';
import { Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ImageAI() {
  const { result, explanation, isLoading, isLoadingExplanation, runPrediction } = usePrediction();
  const [data, setData] = useState({ imageName: '', symptoms: '' });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <PageHeader title="Image AI (Demo)" description="Plant disease detection using symptom-based analysis" icon={Image} gradient="from-purple-500 to-violet-500" />
          <div className="glass rounded-xl p-6 space-y-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning">
              <strong>Demo Mode:</strong> This module simulates image-based analysis using symptom descriptions. In production, integrate with a CNN model for actual image classification.
            </div>
            <div><Label>Image File Name</Label><Input value={data.imageName} onChange={e => setData({...data, imageName: e.target.value})} placeholder="plant_leaf.jpg" /></div>
            <div><Label>Describe Symptoms</Label><Textarea value={data.symptoms} onChange={e => setData({...data, symptoms: e.target.value})} placeholder="Yellow spots on leaves, wilting..." rows={4} /></div>
            <Button onClick={() => runPrediction('image_plant_disease', data, () => predictPlantDisease(data))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze Plant Disease'}</Button>
          </div>
          {result && <div className="mt-6"><PredictionResult {...result} explanation={explanation || undefined} isLoadingExplanation={isLoadingExplanation} /></div>}
        </div>
      </main>
    </div>
  );
}
