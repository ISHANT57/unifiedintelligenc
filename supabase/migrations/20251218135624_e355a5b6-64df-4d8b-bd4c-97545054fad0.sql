-- Create enum for module types
CREATE TYPE public.ai_module_type AS ENUM (
  'fraud_upi',
  'fraud_credit_card', 
  'fraud_phishing',
  'content_fake_news',
  'content_fake_review',
  'content_cyberbullying',
  'health_stress',
  'health_diabetes',
  'environment_crop',
  'environment_air_quality',
  'image_plant_disease'
);

-- Create predictions log table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_type ai_module_type NOT NULL,
  input_data JSONB NOT NULL,
  prediction_result TEXT NOT NULL,
  confidence_score DECIMAL(5,4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  ai_explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert predictions (public platform demo)
CREATE POLICY "Anyone can insert predictions"
ON public.predictions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view predictions
CREATE POLICY "Anyone can view predictions"
ON public.predictions
FOR SELECT
USING (true);

-- Enable realtime for predictions
ALTER PUBLICATION supabase_realtime ADD TABLE public.predictions;