import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageHeader } from '@/components/PageHeader';
import { PredictionResult } from '@/components/PredictionResult';
import { usePrediction } from '@/hooks/usePrediction';
import { predictPlantDisease } from '@/lib/aiModels';
import { Image, Loader2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ImageUpload';

export default function ImageAI() {
  const { result, explanation, isLoading, isLoadingExplanation, runPrediction } = usePrediction();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleAnalyze = () => {
    const inputData = {
      imageName: imageFile?.name || 'uploaded_image.jpg',
      symptoms,
      hasImage: !!imageFile,
      imageSize: imageFile?.size,
    };
    runPrediction('image_plant_disease', inputData, () => predictPlantDisease(inputData));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <PageHeader 
            title="Image AI" 
            description="Plant disease detection using image analysis and symptom recognition" 
            icon={Image} 
            gradient="from-purple-500 to-violet-500" 
          />
          
          <div className="glass rounded-xl p-6 space-y-6">
            {/* Demo Notice */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-sm">
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">AI-Powered Plant Analysis</strong>
                  <p className="text-muted-foreground mt-1">
                    Upload an image of your plant and describe any visible symptoms. Our AI will analyze the combination of visual cues and symptom description to identify potential diseases.
                  </p>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-base font-medium mb-3 block">Plant Image</Label>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onClear={handleClear}
                preview={imagePreview}
              />
            </div>

            {/* Symptom Description */}
            <div>
              <Label className="text-base font-medium mb-2 block">Describe Symptoms</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Provide details about what you observe - leaf color, spots, wilting, texture changes, etc.
              </p>
              <Textarea 
                value={symptoms} 
                onChange={e => setSymptoms(e.target.value)} 
                placeholder="E.g., Yellow spots on leaves, brown edges, wilting stems, white powder coating..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Analyze Button */}
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || (!imageFile && !symptoms.trim())} 
              className="w-full h-12 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing Plant...
                </>
              ) : (
                <>
                  <Image className="w-5 h-5 mr-2" />
                  Analyze Plant Disease
                </>
              )}
            </Button>

            {/* Quick Examples */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Quick examples to try:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Yellow spots on leaves, curling edges',
                  'White powdery coating on stems',
                  'Brown dry patches, wilting',
                  'Black spots spreading across leaves',
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setSymptoms(example)}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {result && (
            <div className="mt-6">
              <PredictionResult 
                {...result} 
                explanation={explanation || undefined} 
                isLoadingExplanation={isLoadingExplanation} 
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
