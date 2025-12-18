import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { moduleType, inputData, prediction, confidence, riskLevel } = await req.json();
    
    console.log('AI Explain request:', { moduleType, prediction, confidence });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
- Score: What the ${(confidence * 100).toFixed(1)}% confidence means
- Reliability: How trustworthy is this prediction?
- Uncertainty: What could affect accuracy?

### ⚡ Recommended Actions
Provide 2-4 specific, actionable steps the user should take based on this prediction.

### 🧠 How The AI Works
Brief educational note (2-3 sentences) explaining the ML technique used for this module type.

Be direct, avoid jargon, and make every word count. The user should walk away understanding exactly why this prediction happened and what to do about it.`;

    const userPrompt = `Generate a detailed XAI explanation for this prediction:

**Module Type:** ${moduleType}
**Input Data:**
${JSON.stringify(inputData, null, 2)}

**Prediction Output:**
- Result: ${prediction}
- Confidence: ${(confidence * 100).toFixed(1)}%
- Risk Level: ${riskLevel}

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
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
