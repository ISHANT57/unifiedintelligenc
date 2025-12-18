import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageHeader } from '@/components/PageHeader';
import { PredictionResult } from '@/components/PredictionResult';
import { usePrediction } from '@/hooks/usePrediction';
import { predictStress, predictDiabetesRisk } from '@/lib/aiModels';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export default function HealthPrediction() {
  const { result, explanation, isLoading, isLoadingExplanation, runPrediction } = usePrediction();
  const [stressData, setStressData] = useState({ sleepHours: '7', workHours: '8', exerciseMinutes: '30', socialInteraction: '3' });
  const [diabetesData, setDiabetesData] = useState({ age: '45', bmi: '25', familyHistory: false, physicalActivity: '3', bloodPressure: '120' });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <PageHeader title="Health Prediction" description="Predict stress levels and diabetes/heart disease risk" icon={Heart} gradient="from-pink-500 to-rose-500" />
          <Tabs defaultValue="stress" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="stress">Stress Level</TabsTrigger>
              <TabsTrigger value="diabetes">Diabetes Risk</TabsTrigger>
            </TabsList>
            <TabsContent value="stress" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Sleep Hours/Day</Label><Input type="number" value={stressData.sleepHours} onChange={e => setStressData({...stressData, sleepHours: e.target.value})} /></div>
                  <div><Label>Work Hours/Day</Label><Input type="number" value={stressData.workHours} onChange={e => setStressData({...stressData, workHours: e.target.value})} /></div>
                  <div><Label>Exercise (min/day)</Label><Input type="number" value={stressData.exerciseMinutes} onChange={e => setStressData({...stressData, exerciseMinutes: e.target.value})} /></div>
                  <div><Label>Social Interactions/Day</Label><Input type="number" value={stressData.socialInteraction} onChange={e => setStressData({...stressData, socialInteraction: e.target.value})} /></div>
                </div>
                <Button onClick={() => runPrediction('health_stress', stressData, () => predictStress({ sleepHours: Number(stressData.sleepHours), workHours: Number(stressData.workHours), exerciseMinutes: Number(stressData.exerciseMinutes), socialInteraction: Number(stressData.socialInteraction) }))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze Stress Level'}</Button>
              </div>
            </TabsContent>
            <TabsContent value="diabetes" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Age</Label><Input type="number" value={diabetesData.age} onChange={e => setDiabetesData({...diabetesData, age: e.target.value})} /></div>
                  <div><Label>BMI</Label><Input type="number" step="0.1" value={diabetesData.bmi} onChange={e => setDiabetesData({...diabetesData, bmi: e.target.value})} /></div>
                  <div><Label>Physical Activity (days/week)</Label><Input type="number" max="7" value={diabetesData.physicalActivity} onChange={e => setDiabetesData({...diabetesData, physicalActivity: e.target.value})} /></div>
                  <div><Label>Blood Pressure (systolic)</Label><Input type="number" value={diabetesData.bloodPressure} onChange={e => setDiabetesData({...diabetesData, bloodPressure: e.target.value})} /></div>
                  <div className="col-span-2 flex items-center gap-2"><Switch checked={diabetesData.familyHistory} onCheckedChange={v => setDiabetesData({...diabetesData, familyHistory: v})} /><Label>Family History of Diabetes</Label></div>
                </div>
                <Button onClick={() => runPrediction('health_diabetes', diabetesData, () => predictDiabetesRisk({ age: Number(diabetesData.age), bmi: Number(diabetesData.bmi), familyHistory: diabetesData.familyHistory, physicalActivity: Number(diabetesData.physicalActivity), bloodPressure: Number(diabetesData.bloodPressure) }))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze Diabetes Risk'}</Button>
              </div>
            </TabsContent>
          </Tabs>
          {result && <div className="mt-6"><PredictionResult {...result} explanation={explanation || undefined} isLoadingExplanation={isLoadingExplanation} /></div>}
        </div>
      </main>
    </div>
  );
}
