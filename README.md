
# Unified AI Intelligence Platform

A comprehensive AI-powered prediction and analysis platform built with React, TypeScript, and Supabase.

## Overview

This platform provides 6 AI-powered modules for various prediction and analysis tasks, with built-in explainability powered by Google Gemini. Every prediction includes a detailed AI-generated explanation of why the result occurred and what actions users should take.

## Features

### 🔐 Authentication
- Secure email/password authentication
- Protected routes requiring login
- Session management with automatic token refresh

### 🤖 AI Modules

#### 1. Fraud Detection AI (`/fraud`)
- **UPI Fraud Detection**: Analyzes transaction amount, sender/receiver patterns, and timing to detect suspicious UPI payments
- **Credit Card Fraud**: Examines transaction amount, merchant category, location, and historical patterns
- **Phishing URL Detection**: Analyzes URL structure, domain age, SSL certificates, and suspicious patterns

#### 2. Content Intelligence AI (`/content`)
- **Fake News Detection**: Uses NLP to analyze writing style, source credibility, emotional language, and fact patterns
- **Fake Review Detection**: Identifies suspicious patterns like repeated phrases, extreme sentiment, timing anomalies
- **Cyberbullying Detection**: Detects toxic language, personal attacks, and harassment patterns

#### 3. Health Prediction AI (`/health`)
- **Stress Level Analysis**: Evaluates sleep, work hours, physical activity, and lifestyle factors
- **Diabetes/Heart Risk**: Analyzes health metrics like BMI, blood pressure, glucose, age, and lifestyle

#### 4. Environment & Crop AI (`/environment`)
- **Crop Recommendation**: Uses soil NPK values, pH, temperature, humidity, and rainfall to suggest optimal crops
- **Air Quality Prediction**: Analyzes pollutant levels (PM2.5, PM10, NO2, SO2, CO, O3) to predict AQI

#### 5. Image AI (`/image`)
- **Plant Disease Detection**: Analyzes plant symptoms (leaf color, spots, wilting) to identify diseases
- File upload with drag-and-drop support

#### 6. Analytics Dashboard (`/analytics`)
- Prediction trends over time
- Confidence score distributions
- Risk level breakdowns across all modules

### 💬 AI Chat Assistant
- System-wide floating chat interface
- Context-aware assistance based on current module
- Explains AI concepts, module functionality, and predictions
- Powered by Google Gemini via Lovable AI Gateway

### 🧠 AI Explainability Engine
Every prediction includes:
- **WHY**: What specific factors caused this prediction
- **WHICH**: Which input features had the most influence
- **WHAT**: Recommended actions to take
- **HOW**: Educational explanation of the AI technique used

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Recharts** for data visualization

### Backend (Lovable Cloud / Supabase)
- **PostgreSQL** database for prediction logging
- **Row Level Security (RLS)** for data protection
- **Edge Functions** for AI processing
- **Authentication** with Supabase Auth

### AI Integration
- **Lovable AI Gateway** connecting to Google Gemini
- Streaming responses for real-time chat
- Structured prompt engineering for consistent explanations

## Database Schema

### `predictions` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| module_type | ENUM | AI module identifier |
| input_data | JSONB | User input parameters |
| prediction_result | TEXT | AI prediction output |
| confidence_score | NUMERIC | 0-1 confidence value |
| risk_level | TEXT | low/medium/high/critical |
| ai_explanation | TEXT | Gemini-generated explanation |
| created_at | TIMESTAMP | When prediction was made |

## Security Features

- ✅ User authentication required for all features
- ✅ JWT verification on edge functions
- ✅ Row Level Security on database tables
- ✅ Input validation on all API endpoints
- ✅ Generic error messages (no internal details leaked)
- ✅ CORS protection with authentication

## Edge Functions

### `ai-chat`
Handles the AI chat assistant conversations with:
- Authentication verification
- Message history context
- Streaming SSE responses
- Rate limit handling

### `ai-explain`
Generates detailed XAI explanations for predictions with:
- Structured prompt engineering
- Module-specific context
- Actionable recommendations

## Getting Started

1. Sign up or log in at `/auth`
2. Navigate to any AI module from the home page
3. Enter the required parameters
4. Click "Analyze" to get predictions
5. View AI-generated explanations
6. Use the chat assistant (bottom-right) for help

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AIChatAssistant.tsx
│   ├── PredictionResult.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication context
│   ├── usePrediction.ts # Prediction logic
│   └── ...
├── pages/              # Route pages
│   ├── Auth.tsx        # Login/signup
│   ├── Index.tsx       # Home
│   ├── FraudDetection.tsx
│   └── ...
├── lib/                # Utilities
│   ├── aiModels.ts     # Prediction algorithms
│   └── utils.ts
└── integrations/       # External integrations
    └── supabase/       # Supabase client

supabase/
├── config.toml         # Edge function configuration
└── functions/
    ├── ai-chat/        # Chat assistant function
    └── ai-explain/     # Explanation generator
```

## License

Private project - All rights reserved.
