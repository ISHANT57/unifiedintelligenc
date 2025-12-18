import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageHeader } from '@/components/PageHeader';
import { PredictionResult } from '@/components/PredictionResult';
import { usePrediction } from '@/hooks/usePrediction';
import { predictUPIFraud, predictCreditCardFraud, predictPhishingURL } from '@/lib/aiModels';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export default function FraudDetection() {
  const { result, explanation, isLoading, isLoadingExplanation, runPrediction } = usePrediction();
  
  // UPI Form
  const [upiData, setUpiData] = useState({ amount: '', senderUPI: '', receiverUPI: '', time: '', location: '' });
  
  // Credit Card Form
  const [ccData, setCcData] = useState({ cardNumber: '', amount: '', merchantType: '', isInternational: false, previousTransactions: '' });
  
  // Phishing Form
  const [urlData, setUrlData] = useState({ url: '', hasSuspiciousTLD: false, urlLength: '', hasHTTPS: true });

  const handleUPISubmit = () => {
    runPrediction('fraud_upi', upiData, () => predictUPIFraud({
      amount: Number(upiData.amount),
      senderUPI: upiData.senderUPI,
      receiverUPI: upiData.receiverUPI,
      time: upiData.time,
      location: upiData.location,
    }));
  };

  const handleCCSubmit = () => {
    runPrediction('fraud_credit_card', ccData, () => predictCreditCardFraud({
      cardNumber: ccData.cardNumber,
      amount: Number(ccData.amount),
      merchantType: ccData.merchantType,
      isInternational: ccData.isInternational,
      previousTransactions: Number(ccData.previousTransactions),
    }));
  };

  const handlePhishingSubmit = () => {
    runPrediction('fraud_phishing', urlData, () => predictPhishingURL({
      url: urlData.url,
      hasSuspiciousTLD: urlData.hasSuspiciousTLD,
      urlLength: Number(urlData.urlLength) || urlData.url.length,
      hasHTTPS: urlData.hasHTTPS,
    }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <PageHeader 
            title="Fraud Detection AI" 
            description="Detect UPI fraud, credit card fraud, and phishing URLs"
            icon={Shield}
            gradient="from-red-500 to-orange-500"
          />

          <Tabs defaultValue="upi" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="upi">UPI Fraud</TabsTrigger>
              <TabsTrigger value="credit">Credit Card</TabsTrigger>
              <TabsTrigger value="phishing">Phishing URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upi" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Amount (₹)</Label><Input type="number" value={upiData.amount} onChange={e => setUpiData({...upiData, amount: e.target.value})} placeholder="50000" /></div>
                  <div><Label>Sender UPI</Label><Input value={upiData.senderUPI} onChange={e => setUpiData({...upiData, senderUPI: e.target.value})} placeholder="sender@upi" /></div>
                  <div><Label>Receiver UPI</Label><Input value={upiData.receiverUPI} onChange={e => setUpiData({...upiData, receiverUPI: e.target.value})} placeholder="receiver@upi" /></div>
                  <div><Label>Time (HH:MM)</Label><Input value={upiData.time} onChange={e => setUpiData({...upiData, time: e.target.value})} placeholder="23:30" /></div>
                  <div className="md:col-span-2"><Label>Location</Label><Input value={upiData.location} onChange={e => setUpiData({...upiData, location: e.target.value})} placeholder="Mumbai" /></div>
                </div>
                <Button onClick={handleUPISubmit} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze UPI Transaction'}</Button>
              </div>
            </TabsContent>

            <TabsContent value="credit" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Card Number (last 4)</Label><Input value={ccData.cardNumber} onChange={e => setCcData({...ccData, cardNumber: e.target.value})} placeholder="1234" /></div>
                  <div><Label>Amount ($)</Label><Input type="number" value={ccData.amount} onChange={e => setCcData({...ccData, amount: e.target.value})} placeholder="5000" /></div>
                  <div><Label>Merchant Type</Label><Input value={ccData.merchantType} onChange={e => setCcData({...ccData, merchantType: e.target.value})} placeholder="Online Shopping" /></div>
                  <div><Label>Previous Transactions</Label><Input type="number" value={ccData.previousTransactions} onChange={e => setCcData({...ccData, previousTransactions: e.target.value})} placeholder="10" /></div>
                  <div className="flex items-center gap-2"><Switch checked={ccData.isInternational} onCheckedChange={v => setCcData({...ccData, isInternational: v})} /><Label>International Transaction</Label></div>
                </div>
                <Button onClick={handleCCSubmit} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze Credit Card'}</Button>
              </div>
            </TabsContent>

            <TabsContent value="phishing" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="space-y-4">
                  <div><Label>URL to Check</Label><Input value={urlData.url} onChange={e => setUrlData({...urlData, url: e.target.value})} placeholder="https://suspicious-site.com/login" /></div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2"><Switch checked={urlData.hasSuspiciousTLD} onCheckedChange={v => setUrlData({...urlData, hasSuspiciousTLD: v})} /><Label>Suspicious TLD</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={urlData.hasHTTPS} onCheckedChange={v => setUrlData({...urlData, hasHTTPS: v})} /><Label>Has HTTPS</Label></div>
                  </div>
                </div>
                <Button onClick={handlePhishingSubmit} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze URL'}</Button>
              </div>
            </TabsContent>
          </Tabs>

          {result && <div className="mt-6"><PredictionResult {...result} explanation={explanation || undefined} isLoadingExplanation={isLoadingExplanation} /></div>}
        </div>
      </main>
    </div>
  );
}
