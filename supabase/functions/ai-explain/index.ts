import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_MODULE_TYPE_LENGTH = 50;
const MAX_PREDICTION_LENGTH = 500;
const MAX_RISK_LEVEL_LENGTH = 50;
const MAX_INPUT_DATA_SIZE = 10000;
const VALID_RISK_LEVELS = ['low', 'medium', 'high', 'critical'];

// Validate module type
function validateModuleType(moduleType: unknown): { valid: boolean; error?: string } {
  if (!moduleType || typeof moduleType !== 'string') {
    return { valid: false, error: 'moduleType is required and must be a string' };
  }
  if (moduleType.length > MAX_MODULE_TYPE_LENGTH) {
    return { valid: false, error: `moduleType exceeds maximum length of ${MAX_MODULE_TYPE_LENGTH} characters` };
  }
  return { valid: true };
}

// Validate input data
function validateInputData(inputData: unknown): { valid: boolean; error?: string } {
  if (inputData === undefined || inputData === null) {
    return { valid: false, error: 'inputData is required' };
  }
  if (typeof inputData !== 'object') {
    return { valid: false, error: 'inputData must be an object' };
  }
  
  const inputSize = JSON.stringify(inputData).length;
  if (inputSize > MAX_INPUT_DATA_SIZE) {
    return { valid: false, error: `inputData exceeds maximum size of ${MAX_INPUT_DATA_SIZE} characters` };
  }
  
  return { valid: true };
}

// Validate prediction
function validatePrediction(prediction: unknown): { valid: boolean; error?: string } {
  if (!prediction || typeof prediction !== 'string') {
    return { valid: false, error: 'prediction is required and must be a string' };
  }
  if (prediction.length > MAX_PREDICTION_LENGTH) {
    return { valid: false, error: `prediction exceeds maximum length of ${MAX_PREDICTION_LENGTH} characters` };
  }
  return { valid: true };
}

// Validate confidence
function validateConfidence(confidence: unknown): { valid: boolean; error?: string } {
  if (confidence === undefined || confidence === null) {
    return { valid: false, error: 'confidence is required' };
  }
  if (typeof confidence !== 'number') {
    return { valid: false, error: 'confidence must be a number' };
  }
  if (confidence < 0 || confidence > 1) {
    return { valid: false, error: 'confidence must be between 0 and 1' };
  }
  return { valid: true };
}

// Validate risk level
function validateRiskLevel(riskLevel: unknown): { valid: boolean; error?: string } {
  if (riskLevel === undefined || riskLevel === null) {
    return { valid: true }; // Risk level can be optional
  }
  if (typeof riskLevel !== 'string') {
    return { valid: false, error: 'riskLevel must be a string' };
  }
  if (riskLevel.length > MAX_RISK_LEVEL_LENGTH) {
    return { valid: false, error: `riskLevel exceeds maximum length of ${MAX_RISK_LEVEL_LENGTH} characters` };
  }
  const normalizedRiskLevel = riskLevel.toLowerCase();
  if (!VALID_RISK_LEVELS.includes(normalizedRiskLevel)) {
    return { valid: false, error: `riskLevel must be one of: ${VALID_RISK_LEVELS.join(', ')}` };
  }
  return { valid: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.log('Auth verification failed:', authError?.message);
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Request authenticated for user:', user.id);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Request body must be an object' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { moduleType, inputData, prediction, confidence, riskLevel } = body as {
      moduleType: unknown;
      inputData: unknown;
      prediction: unknown;
      confidence: unknown;
      riskLevel: unknown;
    };

    // Validate all inputs
    const validations = [
      { name: 'moduleType', result: validateModuleType(moduleType) },
      { name: 'inputData', result: validateInputData(inputData) },
      { name: 'prediction', result: validatePrediction(prediction) },
      { name: 'confidence', result: validateConfidence(confidence) },
      { name: 'riskLevel', result: validateRiskLevel(riskLevel) },
    ];

    for (const validation of validations) {
      if (!validation.result.valid) {
        console.log(`Validation failed for ${validation.name}:`, validation.result.error);
        return new Response(JSON.stringify({ error: validation.result.error }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    console.log('AI Explain request validated:', { moduleType, prediction, confidence });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const validatedConfidence = confidence as number;
    const validatedModuleType = moduleType as string;
    const validatedPrediction = prediction as string;
    const validatedRiskLevel = riskLevel as string | undefined;
    const validatedInputData = inputData as Record<string, unknown>;

    const systemPrompt = `You are an Explainable AI (XAI) Engine for a Unified AI Intelligence Platform. Your critical mission is to make AI decisions transparent and actionable.

## Your Role
You must provide DETAILED explanations that answer:
1. **WHY**: What specific factors caused this prediction?
2. **WHICH**: Which input features had the most influence?
3. **WHAT**: What should the user do next?

## Response Structure (ALWAYS follow this format)

### 🔍 Why This Result?
Explain the reasoning chain - what patterns or signals in the input data led to this specific prediction. Be specific about cause and effect.

### 📊 Key Influencing Factors
List the top 3-5 input features that most influenced this decision, with their impact:
- Factor 1: [value] → [how it influenced the result]
- Factor 2: [value] → [how it influenced the result]
(Continue for key factors)

### 📈 Confidence Breakdown
- Score: What the ${(validatedConfidence * 100).toFixed(1)}% confidence means
- Reliability: How trustworthy is this prediction?
- Uncertainty: What could affect accuracy?

### ⚡ Recommended Actions
Provide 2-4 specific, actionable steps the user should take based on this prediction.

### 🧠 How The AI Works
Brief educational note (2-3 sentences) explaining the ML technique used for this module type.

Be direct, avoid jargon, and make every word count. The user should walk away understanding exactly why this prediction happened and what to do about it.`;

    const userPrompt = `Generate a detailed XAI explanation for this prediction:

**Module Type:** ${validatedModuleType}
**Input Data:**
${JSON.stringify(validatedInputData, null, 2)}

**Prediction Output:**
- Result: ${validatedPrediction}
- Confidence: ${(validatedConfidence * 100).toFixed(1)}%
- Risk Level: ${validatedRiskLevel || 'N/A'}

Analyze the input data thoroughly and explain which specific values led to this prediction. Be precise about the causal relationship between inputs and the output.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || 'Unable to generate explanation.';

    console.log('AI Explanation generated successfully');

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-explain function:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred. Please try again later.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
