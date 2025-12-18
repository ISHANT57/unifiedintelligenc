import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageHeader } from '@/components/PageHeader';
import { PredictionResult } from '@/components/PredictionResult';
import { usePrediction } from '@/hooks/usePrediction';
import { predictCropRecommendation, predictAirQuality } from '@/lib/aiModels';
import { Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EnvironmentAI() {
  const { result, explanation, isLoading, isLoadingExplanation, runPrediction } = usePrediction();
  const [cropData, setCropData] = useState({ nitrogen: '90', phosphorus: '42', potassium: '43', temperature: '25', humidity: '65', rainfall: '120' });
  const [airData, setAirData] = useState({ pm25: '35', pm10: '50', no2: '40', so2: '20', co: '2' });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <PageHeader title="Environment & Crop AI" description="Crop recommendations and air quality predictions" icon={Leaf} gradient="from-green-500 to-emerald-500" />
          <Tabs defaultValue="crop" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="crop">Crop Recommendation</TabsTrigger>
              <TabsTrigger value="air">Air Quality</TabsTrigger>
            </TabsList>
            <TabsContent value="crop" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><Label>Nitrogen (N)</Label><Input type="number" value={cropData.nitrogen} onChange={e => setCropData({...cropData, nitrogen: e.target.value})} /></div>
                  <div><Label>Phosphorus (P)</Label><Input type="number" value={cropData.phosphorus} onChange={e => setCropData({...cropData, phosphorus: e.target.value})} /></div>
                  <div><Label>Potassium (K)</Label><Input type="number" value={cropData.potassium} onChange={e => setCropData({...cropData, potassium: e.target.value})} /></div>
                  <div><Label>Temperature (°C)</Label><Input type="number" value={cropData.temperature} onChange={e => setCropData({...cropData, temperature: e.target.value})} /></div>
                  <div><Label>Humidity (%)</Label><Input type="number" value={cropData.humidity} onChange={e => setCropData({...cropData, humidity: e.target.value})} /></div>
                  <div><Label>Rainfall (mm)</Label><Input type="number" value={cropData.rainfall} onChange={e => setCropData({...cropData, rainfall: e.target.value})} /></div>
                </div>
                <Button onClick={() => runPrediction('environment_crop', cropData, () => predictCropRecommendation({ nitrogen: Number(cropData.nitrogen), phosphorus: Number(cropData.phosphorus), potassium: Number(cropData.potassium), temperature: Number(cropData.temperature), humidity: Number(cropData.humidity), rainfall: Number(cropData.rainfall) }))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Get Crop Recommendation'}</Button>
              </div>
            </TabsContent>
            <TabsContent value="air" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><Label>PM2.5 (μg/m³)</Label><Input type="number" value={airData.pm25} onChange={e => setAirData({...airData, pm25: e.target.value})} /></div>
                  <div><Label>PM10 (μg/m³)</Label><Input type="number" value={airData.pm10} onChange={e => setAirData({...airData, pm10: e.target.value})} /></div>
                  <div><Label>NO₂ (ppb)</Label><Input type="number" value={airData.no2} onChange={e => setAirData({...airData, no2: e.target.value})} /></div>
                  <div><Label>SO₂ (ppb)</Label><Input type="number" value={airData.so2} onChange={e => setAirData({...airData, so2: e.target.value})} /></div>
                  <div><Label>CO (ppm)</Label><Input type="number" step="0.1" value={airData.co} onChange={e => setAirData({...airData, co: e.target.value})} /></div>
                </div>
                <Button onClick={() => runPrediction('environment_air_quality', airData, () => predictAirQuality({ pm25: Number(airData.pm25), pm10: Number(airData.pm10), no2: Number(airData.no2), so2: Number(airData.so2), co: Number(airData.co) }))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze Air Quality'}</Button>
              </div>
            </TabsContent>
          </Tabs>
          {result && <div className="mt-6"><PredictionResult {...result} explanation={explanation || undefined} isLoadingExplanation={isLoadingExplanation} /></div>}
        </div>
      </main>
    </div>
  );
}
