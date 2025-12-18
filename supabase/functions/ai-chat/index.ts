import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_CONTEXT_LENGTH = 2000;

// System context about all AI modules
const SYSTEM_CONTEXT = `You are the AI Assistant for the Unified AI Intelligence Platform. You have complete knowledge of all modules and can help users understand how AI works.

## Platform Overview
This platform provides 6 AI-powered modules for various prediction tasks:

### 1. Fraud Detection AI
- **UPI Fraud Detection**: Analyzes transaction amount, sender/receiver patterns, and timing to detect suspicious UPI payments
- **Credit Card Fraud**: Examines transaction amount, merchant category, location, and historical patterns
- **Phishing URL Detection**: Analyzes URL structure, domain age, SSL certificates, and suspicious patterns

### 2. Content Intelligence AI
- **Fake News Detection**: Uses NLP to analyze writing style, source credibility, emotional language, and fact patterns
- **Fake Review Detection**: Identifies suspicious patterns like repeated phrases, extreme sentiment, timing anomalies
- **Cyberbullying Detection**: Detects toxic language, personal attacks, and harassment patterns

### 3. Health Prediction AI
- **Stress Level Analysis**: Evaluates sleep, work hours, physical activity, and lifestyle factors
- **Diabetes/Heart Risk**: Analyzes health metrics like BMI, blood pressure, glucose, age, and lifestyle

### 4. Environment & Crop AI
- **Crop Recommendation**: Uses soil NPK values, pH, temperature, humidity, and rainfall to suggest optimal crops
- **Air Quality Prediction**: Analyzes pollutant levels (PM2.5, PM10, NO2, SO2, CO, O3) to predict AQI

### 5. Image AI (Demo)
- **Plant Disease Detection**: Analyzes plant symptoms (leaf color, spots, wilting) to identify diseases

### 6. AI Explanation Engine (This assistant!)
- Powered by Gemini API
- Explains predictions with WHY, WHICH factors, and WHAT actions
- Provides educational insights about AI/ML techniques

## How the AI Works
- Each module uses rule-based AI + ML simulation for predictions
- Confidence scores indicate prediction reliability (0-100%)
- Risk levels: Low (safe), Medium (caution), High (concern), Critical (urgent)
- All predictions are logged to the database for audit trails
- Gemini API generates human-readable explanations

## Key AI Concepts
- **Classification**: Categorizing data into predefined classes
- **Probability Scoring**: Expressing prediction confidence as percentages
- **Feature Engineering**: Extracting meaningful signals from raw data
- **Explainable AI (XAI)**: Making AI decisions interpretable

Be helpful, educational, and guide users through the platform. Answer questions about any module, explain AI concepts, and provide actionable guidance.`;

// Validate messages array
function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }
  if (messages.length === 0) {
    return { valid: false, error: 'Messages array cannot be empty' };
  }
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages. Maximum allowed: ${MAX_MESSAGES}` };
  }
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: `Invalid message at index ${i}` };
    }
    if (!msg.role || typeof msg.role !== 'string') {
      return { valid: false, error: `Invalid role at message ${i}` };
    }
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      return { valid: false, error: `Invalid role value at message ${i}` };
    }
    if (!msg.content || typeof msg.content !== 'string') {
      return { valid: false, error: `Invalid content at message ${i}` };
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message ${i} exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` };
    }
  }
  
  return { valid: true };
}

// Validate context object
function validateContext(context: unknown): { valid: boolean; error?: string } {
  if (context === undefined || context === null) {
    return { valid: true }; // Context is optional
  }
  if (typeof context !== 'object') {
    return { valid: false, error: 'Context must be an object' };
  }
  
  const ctx = context as Record<string, unknown>;
  
  if (ctx.currentModule !== undefined) {
    if (typeof ctx.currentModule !== 'string' || ctx.currentModule.length > 100) {
      return { valid: false, error: 'Invalid currentModule in context' };
    }
  }
  
  if (ctx.lastPrediction !== undefined) {
    if (typeof ctx.lastPrediction !== 'object' || ctx.lastPrediction === null) {
      return { valid: false, error: 'Invalid lastPrediction in context' };
    }
    const pred = ctx.lastPrediction as Record<string, unknown>;
    if (pred.moduleType !== undefined && (typeof pred.moduleType !== 'string' || pred.moduleType.length > 100)) {
      return { valid: false, error: 'Invalid moduleType in lastPrediction' };
    }
    if (pred.prediction !== undefined && (typeof pred.prediction !== 'string' || pred.prediction.length > 500)) {
      return { valid: false, error: 'Invalid prediction in lastPrediction' };
    }
    if (pred.confidence !== undefined && (typeof pred.confidence !== 'number' || pred.confidence < 0 || pred.confidence > 100)) {
      return { valid: false, error: 'Invalid confidence in lastPrediction' };
    }
  }
  
  // Check total context size
  const contextSize = JSON.stringify(context).length;
  if (contextSize > MAX_CONTEXT_LENGTH) {
    return { valid: false, error: `Context exceeds maximum size of ${MAX_CONTEXT_LENGTH} characters` };
  }
  
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { messages, context } = body as { messages: unknown; context: unknown };
    
    // Validate messages
    const messagesValidation = validateMessages(messages);
    if (!messagesValidation.valid) {
      console.log('Messages validation failed:', messagesValidation.error);
      return new Response(JSON.stringify({ error: messagesValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate context
    const contextValidation = validateContext(context);
    if (!contextValidation.valid) {
      console.log('Context validation failed:', contextValidation.error);
      return new Response(JSON.stringify({ error: contextValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('AI Chat request validated:', { messagesCount: (messages as Array<unknown>).length, hasContext: !!context });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_CONTEXT;
    const validatedContext = context as { currentModule?: string; lastPrediction?: { moduleType?: string; prediction?: string; confidence?: number } } | undefined;
    
    if (validatedContext?.currentModule) {
      systemPrompt += `\n\n## Current Context\nUser is currently on: ${validatedContext.currentModule}`;
    }
    if (validatedContext?.lastPrediction) {
      systemPrompt += `\n\nLast prediction made:\n- Module: ${validatedContext.lastPrediction.moduleType}\n- Result: ${validatedContext.lastPrediction.prediction}\n- Confidence: ${validatedContext.lastPrediction.confidence}%`;
    }

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
          ...(messages as Array<{ role: string; content: string }>)
        ],
        stream: true,
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
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
