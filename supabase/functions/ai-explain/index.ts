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

    const systemPrompt = `You are an AI Explanation Assistant for a Unified AI Intelligence Platform. Your role is to:

1. Explain WHY a prediction was made in simple, clear language
2. Break down the confidence score meaning (what the percentage indicates)
3. Provide actionable suggestions based on the prediction
4. Be educational and help users understand AI decision-making

Keep explanations concise but informative. Use bullet points for clarity.
Always structure your response with these sections:
- **Why This Prediction**: Brief explanation of factors
- **Confidence Analysis**: What the confidence score means
- **Recommendations**: Actionable next steps
- **Learn More**: Brief educational note about the AI technique used`;

    const userPrompt = `Analyze and explain this AI prediction:

Module: ${moduleType}
Input Data: ${JSON.stringify(inputData, null, 2)}
Prediction Result: ${prediction}
Confidence Score: ${(confidence * 100).toFixed(1)}%
Risk Level: ${riskLevel}

Please provide a comprehensive but concise explanation of this prediction.`;

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
