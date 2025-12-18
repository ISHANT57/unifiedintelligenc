// Rule-based + ML simulation for demo purposes
// In production, these would call actual ML models

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface PredictionResult {
  prediction: string;
  confidence: number;
  riskLevel: RiskLevel;
}

// Fraud Detection Models
export function predictUPIFraud(data: {
  amount: number;
  senderUPI: string;
  receiverUPI: string;
  time: string;
  location: string;
}): PredictionResult {
  let riskScore = 0;
  
  // Rule-based logic
  if (data.amount > 50000) riskScore += 0.3;
  if (data.amount > 100000) riskScore += 0.2;
  if (data.time && (parseInt(data.time.split(':')[0]) < 6 || parseInt(data.time.split(':')[0]) > 22)) riskScore += 0.2;
  if (data.senderUPI?.includes('random') || data.receiverUPI?.includes('random')) riskScore += 0.15;
  if (data.location?.toLowerCase().includes('unknown')) riskScore += 0.15;
  
  const confidence = Math.min(0.95, 0.5 + riskScore);
  const isFraud = riskScore > 0.4;
  
  return {
    prediction: isFraud ? 'FRAUDULENT TRANSACTION' : 'LEGITIMATE TRANSACTION',
    confidence,
    riskLevel: riskScore > 0.6 ? 'critical' : riskScore > 0.4 ? 'high' : riskScore > 0.2 ? 'medium' : 'low'
  };
}

export function predictCreditCardFraud(data: {
  cardNumber: string;
  amount: number;
  merchantType: string;
  isInternational: boolean;
  previousTransactions: number;
}): PredictionResult {
  let riskScore = 0;
  
  if (data.amount > 10000) riskScore += 0.25;
  if (data.amount > 50000) riskScore += 0.25;
  if (data.isInternational) riskScore += 0.2;
  if (data.merchantType?.toLowerCase().includes('unknown') || data.merchantType?.toLowerCase().includes('online')) riskScore += 0.15;
  if (data.previousTransactions < 5) riskScore += 0.15;
  
  const confidence = Math.min(0.93, 0.55 + riskScore);
  const isFraud = riskScore > 0.45;
  
  return {
    prediction: isFraud ? 'HIGH FRAUD RISK' : 'NORMAL TRANSACTION',
    confidence,
    riskLevel: riskScore > 0.6 ? 'critical' : riskScore > 0.45 ? 'high' : riskScore > 0.25 ? 'medium' : 'low'
  };
}

export function predictPhishingURL(data: {
  url: string;
  hasSuspiciousTLD: boolean;
  urlLength: number;
  hasHTTPS: boolean;
}): PredictionResult {
  let riskScore = 0;
  
  const suspiciousKeywords = ['login', 'verify', 'secure', 'update', 'confirm', 'account', 'bank'];
  const urlLower = data.url.toLowerCase();
  
  suspiciousKeywords.forEach(keyword => {
    if (urlLower.includes(keyword)) riskScore += 0.1;
  });
  
  if (data.hasSuspiciousTLD) riskScore += 0.25;
  if (data.urlLength > 75) riskScore += 0.2;
  if (!data.hasHTTPS) riskScore += 0.2;
  if (urlLower.includes('@') || urlLower.includes('//') && urlLower.lastIndexOf('//') > 7) riskScore += 0.25;
  
  const confidence = Math.min(0.96, 0.5 + riskScore);
  const isPhishing = riskScore > 0.35;
  
  return {
    prediction: isPhishing ? 'PHISHING URL DETECTED' : 'SAFE URL',
    confidence,
    riskLevel: riskScore > 0.6 ? 'critical' : riskScore > 0.35 ? 'high' : riskScore > 0.2 ? 'medium' : 'low'
  };
}

// Content Intelligence Models
export function predictFakeNews(data: {
  headline: string;
  source: string;
  content: string;
}): PredictionResult {
  let riskScore = 0;
  
  const sensationalWords = ['shocking', 'unbelievable', 'breaking', 'exclusive', 'secret', 'exposed', 'scandal'];
  const textLower = (data.headline + ' ' + data.content).toLowerCase();
  
  sensationalWords.forEach(word => {
    if (textLower.includes(word)) riskScore += 0.12;
  });
  
  if (data.headline.toUpperCase() === data.headline) riskScore += 0.2;
  if (data.headline.includes('!!!') || data.headline.includes('???')) riskScore += 0.15;
  if (!data.source || data.source.toLowerCase().includes('unknown')) riskScore += 0.25;
  
  const confidence = Math.min(0.88, 0.45 + riskScore);
  const isFake = riskScore > 0.4;
  
  return {
    prediction: isFake ? 'LIKELY FAKE NEWS' : 'APPEARS CREDIBLE',
    confidence,
    riskLevel: riskScore > 0.6 ? 'critical' : riskScore > 0.4 ? 'high' : riskScore > 0.25 ? 'medium' : 'low'
  };
}

export function predictFakeReview(data: {
  reviewText: string;
  rating: number;
  reviewerHistory: number;
}): PredictionResult {
  let riskScore = 0;
  
  const spamPhrases = ['best ever', 'amazing product', 'highly recommend', 'must buy', 'perfect', 'love it'];
  const textLower = data.reviewText.toLowerCase();
  
  spamPhrases.forEach(phrase => {
    if (textLower.includes(phrase)) riskScore += 0.1;
  });
  
  if (data.rating === 5 && data.reviewText.length < 50) riskScore += 0.25;
  if (data.rating === 1 && data.reviewText.length < 50) riskScore += 0.25;
  if (data.reviewerHistory < 3) riskScore += 0.2;
  if (data.reviewText.length < 20) riskScore += 0.15;
  
  const confidence = Math.min(0.85, 0.5 + riskScore);
  const isFake = riskScore > 0.35;
  
  return {
    prediction: isFake ? 'SUSPICIOUS REVIEW' : 'GENUINE REVIEW',
    confidence,
    riskLevel: riskScore > 0.5 ? 'high' : riskScore > 0.35 ? 'medium' : 'low'
  };
}

export function predictCyberbullying(data: {
  message: string;
  senderReputation: number;
}): PredictionResult {
  let riskScore = 0;
  
  const harmfulPatterns = ['hate', 'ugly', 'stupid', 'loser', 'kill', 'die', 'worthless', 'pathetic', 'disgusting'];
  const textLower = data.message.toLowerCase();
  
  harmfulPatterns.forEach(word => {
    if (textLower.includes(word)) riskScore += 0.15;
  });
  
  if (data.message.toUpperCase() === data.message && data.message.length > 10) riskScore += 0.15;
  if (data.senderReputation < 3) riskScore += 0.2;
  
  const confidence = Math.min(0.9, 0.5 + riskScore);
  const isBullying = riskScore > 0.3;
  
  return {
    prediction: isBullying ? 'CYBERBULLYING DETECTED' : 'SAFE CONTENT',
    confidence,
    riskLevel: riskScore > 0.5 ? 'critical' : riskScore > 0.3 ? 'high' : riskScore > 0.15 ? 'medium' : 'low'
  };
}

// Health Prediction Models
export function predictStress(data: {
  sleepHours: number;
  workHours: number;
  exerciseMinutes: number;
  socialInteraction: number;
}): PredictionResult {
  let stressScore = 0;
  
  if (data.sleepHours < 6) stressScore += 0.3;
  else if (data.sleepHours < 7) stressScore += 0.15;
  
  if (data.workHours > 10) stressScore += 0.3;
  else if (data.workHours > 8) stressScore += 0.15;
  
  if (data.exerciseMinutes < 15) stressScore += 0.2;
  if (data.socialInteraction < 2) stressScore += 0.2;
  
  const confidence = Math.min(0.87, 0.55 + stressScore * 0.5);
  const isStressed = stressScore > 0.4;
  
  return {
    prediction: isStressed ? 'HIGH STRESS LEVEL' : 'MODERATE/LOW STRESS',
    confidence,
    riskLevel: stressScore > 0.6 ? 'high' : stressScore > 0.4 ? 'medium' : 'low'
  };
}

export function predictDiabetesRisk(data: {
  age: number;
  bmi: number;
  familyHistory: boolean;
  physicalActivity: number;
  bloodPressure: number;
}): PredictionResult {
  let riskScore = 0;
  
  if (data.age > 45) riskScore += 0.15;
  if (data.age > 60) riskScore += 0.1;
  if (data.bmi > 25) riskScore += 0.2;
  if (data.bmi > 30) riskScore += 0.15;
  if (data.familyHistory) riskScore += 0.25;
  if (data.physicalActivity < 3) riskScore += 0.15;
  if (data.bloodPressure > 130) riskScore += 0.15;
  
  const confidence = Math.min(0.82, 0.5 + riskScore * 0.5);
  const isAtRisk = riskScore > 0.4;
  
  return {
    prediction: isAtRisk ? 'ELEVATED DIABETES RISK' : 'LOW/NORMAL RISK',
    confidence,
    riskLevel: riskScore > 0.6 ? 'high' : riskScore > 0.4 ? 'medium' : 'low'
  };
}

// Environment & Crop Models
export function predictCropRecommendation(data: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}): PredictionResult {
  const crops = [
    { name: 'Rice', n: [80, 120], p: [40, 60], k: [40, 60], temp: [20, 30], hum: [60, 80], rain: [100, 200] },
    { name: 'Wheat', n: [60, 100], p: [35, 55], k: [35, 55], temp: [15, 25], hum: [50, 70], rain: [50, 100] },
    { name: 'Cotton', n: [100, 140], p: [45, 65], k: [45, 65], temp: [25, 35], hum: [50, 70], rain: [50, 100] },
    { name: 'Sugarcane', n: [100, 150], p: [50, 70], k: [50, 70], temp: [25, 35], hum: [60, 80], rain: [100, 200] },
    { name: 'Maize', n: [80, 120], p: [40, 60], k: [35, 55], temp: [20, 30], hum: [50, 70], rain: [60, 120] },
  ];
  
  let bestCrop = crops[0];
  let bestScore = 0;
  
  crops.forEach(crop => {
    let score = 0;
    if (data.nitrogen >= crop.n[0] && data.nitrogen <= crop.n[1]) score += 0.2;
    if (data.phosphorus >= crop.p[0] && data.phosphorus <= crop.p[1]) score += 0.2;
    if (data.potassium >= crop.k[0] && data.potassium <= crop.k[1]) score += 0.15;
    if (data.temperature >= crop.temp[0] && data.temperature <= crop.temp[1]) score += 0.2;
    if (data.humidity >= crop.hum[0] && data.humidity <= crop.hum[1]) score += 0.15;
    if (data.rainfall >= crop.rain[0] && data.rainfall <= crop.rain[1]) score += 0.1;
    
    if (score > bestScore) {
      bestScore = score;
      bestCrop = crop;
    }
  });
  
  return {
    prediction: `RECOMMENDED: ${bestCrop.name.toUpperCase()}`,
    confidence: Math.min(0.92, 0.5 + bestScore),
    riskLevel: bestScore > 0.7 ? 'low' : bestScore > 0.5 ? 'medium' : 'high'
  };
}

export function predictAirQuality(data: {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
}): PredictionResult {
  // Calculate AQI-like score
  let aqiScore = 0;
  
  aqiScore += Math.min(data.pm25 / 35, 1) * 0.35;
  aqiScore += Math.min(data.pm10 / 50, 1) * 0.25;
  aqiScore += Math.min(data.no2 / 100, 1) * 0.15;
  aqiScore += Math.min(data.so2 / 75, 1) * 0.15;
  aqiScore += Math.min(data.co / 10, 1) * 0.1;
  
  let category = 'GOOD';
  if (aqiScore > 0.8) category = 'HAZARDOUS';
  else if (aqiScore > 0.6) category = 'VERY UNHEALTHY';
  else if (aqiScore > 0.4) category = 'UNHEALTHY';
  else if (aqiScore > 0.2) category = 'MODERATE';
  
  return {
    prediction: `AIR QUALITY: ${category}`,
    confidence: 0.88,
    riskLevel: aqiScore > 0.6 ? 'critical' : aqiScore > 0.4 ? 'high' : aqiScore > 0.2 ? 'medium' : 'low'
  };
}

// Image AI (Demo placeholder)
export function predictPlantDisease(data: {
  imageName: string;
  symptoms: string;
}): PredictionResult {
  const diseases = ['Leaf Blight', 'Powdery Mildew', 'Root Rot', 'Mosaic Virus', 'Healthy'];
  const symptomsLower = data.symptoms.toLowerCase();
  
  let disease = 'Healthy';
  let confidence = 0.75;
  
  if (symptomsLower.includes('yellow') || symptomsLower.includes('spots')) {
    disease = 'Leaf Blight';
    confidence = 0.82;
  } else if (symptomsLower.includes('white') || symptomsLower.includes('powder')) {
    disease = 'Powdery Mildew';
    confidence = 0.85;
  } else if (symptomsLower.includes('wilt') || symptomsLower.includes('brown root')) {
    disease = 'Root Rot';
    confidence = 0.78;
  } else if (symptomsLower.includes('mosaic') || symptomsLower.includes('pattern')) {
    disease = 'Mosaic Virus';
    confidence = 0.8;
  }
  
  return {
    prediction: disease === 'Healthy' ? 'PLANT IS HEALTHY' : `DETECTED: ${disease.toUpperCase()}`,
    confidence,
    riskLevel: disease === 'Healthy' ? 'low' : 'high'
  };
}
