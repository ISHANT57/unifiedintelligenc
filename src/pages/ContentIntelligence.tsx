import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageHeader } from '@/components/PageHeader';
import { PredictionResult } from '@/components/PredictionResult';
import { usePrediction } from '@/hooks/usePrediction';
import { predictFakeNews, predictFakeReview, predictCyberbullying } from '@/lib/aiModels';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContentIntelligence() {
  const { result, explanation, isLoading, isLoadingExplanation, runPrediction } = usePrediction();
  const [newsData, setNewsData] = useState({ headline: '', source: '', content: '' });
  const [reviewData, setReviewData] = useState({ reviewText: '', rating: '5', reviewerHistory: '10' });
  const [bullyData, setBullyData] = useState({ message: '', senderReputation: '5' });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <PageHeader title="Content Intelligence" description="Detect fake news, fake reviews, and cyberbullying" icon={FileText} gradient="from-blue-500 to-cyan-500" />
          <Tabs defaultValue="news" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="news">Fake News</TabsTrigger>
              <TabsTrigger value="review">Fake Reviews</TabsTrigger>
              <TabsTrigger value="bully">Cyberbullying</TabsTrigger>
            </TabsList>
            <TabsContent value="news" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div><Label>Headline</Label><Input value={newsData.headline} onChange={e => setNewsData({...newsData, headline: e.target.value})} placeholder="SHOCKING: You won't believe..." /></div>
                <div><Label>Source</Label><Input value={newsData.source} onChange={e => setNewsData({...newsData, source: e.target.value})} placeholder="News Source" /></div>
                <div><Label>Content</Label><Textarea value={newsData.content} onChange={e => setNewsData({...newsData, content: e.target.value})} placeholder="Article content..." rows={4} /></div>
                <Button onClick={() => runPrediction('content_fake_news', newsData, () => predictFakeNews(newsData))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze News'}</Button>
              </div>
            </TabsContent>
            <TabsContent value="review" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div><Label>Review Text</Label><Textarea value={reviewData.reviewText} onChange={e => setReviewData({...reviewData, reviewText: e.target.value})} placeholder="Best product ever!" rows={3} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Rating (1-5)</Label><Input type="number" min="1" max="5" value={reviewData.rating} onChange={e => setReviewData({...reviewData, rating: e.target.value})} /></div>
                  <div><Label>Reviewer History</Label><Input type="number" value={reviewData.reviewerHistory} onChange={e => setReviewData({...reviewData, reviewerHistory: e.target.value})} /></div>
                </div>
                <Button onClick={() => runPrediction('content_fake_review', reviewData, () => predictFakeReview({ reviewText: reviewData.reviewText, rating: Number(reviewData.rating), reviewerHistory: Number(reviewData.reviewerHistory) }))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze Review'}</Button>
              </div>
            </TabsContent>
            <TabsContent value="bully" className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <div><Label>Message Content</Label><Textarea value={bullyData.message} onChange={e => setBullyData({...bullyData, message: e.target.value})} placeholder="Enter message to analyze..." rows={3} /></div>
                <div><Label>Sender Reputation (1-10)</Label><Input type="number" min="1" max="10" value={bullyData.senderReputation} onChange={e => setBullyData({...bullyData, senderReputation: e.target.value})} /></div>
                <Button onClick={() => runPrediction('content_cyberbullying', bullyData, () => predictCyberbullying({ message: bullyData.message, senderReputation: Number(bullyData.senderReputation) }))} disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing...</> : 'Analyze Message'}</Button>
              </div>
            </TabsContent>
          </Tabs>
          {result && <div className="mt-6"><PredictionResult {...result} explanation={explanation || undefined} isLoadingExplanation={isLoadingExplanation} /></div>}
        </div>
      </main>
    </div>
  );
}
