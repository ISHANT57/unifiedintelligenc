import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageHeader } from '@/components/PageHeader';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, PieChart, Activity, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

interface Prediction {
  id: string;
  module_type: string;
  prediction_result: string;
  confidence_score: number | null;
  risk_level: string | null;
  created_at: string;
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  accent: 'hsl(var(--accent))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  muted: 'hsl(var(--muted))',
};

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

const MODULE_COLORS = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899',
];

export default function Analytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPredictions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (!error && data) {
      setPredictions(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  // Calculate statistics
  const totalPredictions = predictions.length;
  const avgConfidence = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + (p.confidence_score || 0), 0) / predictions.length
    : 0;

  // Module distribution data
  const moduleDistribution = predictions.reduce((acc, p) => {
    const module = p.module_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    acc[module] = (acc[module] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moduleChartData = Object.entries(moduleDistribution).map(([name, value], i) => ({
    name: name.split(' ').slice(0, 2).join(' '),
    fullName: name,
    value,
    fill: MODULE_COLORS[i % MODULE_COLORS.length],
  }));

  // Risk level distribution
  const riskDistribution = predictions.reduce((acc, p) => {
    const risk = p.risk_level || 'unknown';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskChartData = Object.entries(riskDistribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: RISK_COLORS[name] || '#6b7280',
  }));

  // Confidence distribution (buckets)
  const confidenceBuckets = { '0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 };
  predictions.forEach(p => {
    const conf = (p.confidence_score || 0) * 100;
    if (conf <= 25) confidenceBuckets['0-25%']++;
    else if (conf <= 50) confidenceBuckets['25-50%']++;
    else if (conf <= 75) confidenceBuckets['50-75%']++;
    else confidenceBuckets['75-100%']++;
  });

  const confidenceChartData = Object.entries(confidenceBuckets).map(([range, count]) => ({
    range,
    count,
  }));

  // Time trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last7Days.map(date => {
    const dayPredictions = predictions.filter(p => p.created_at.split('T')[0] === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      predictions: dayPredictions.length,
      avgConfidence: dayPredictions.length > 0
        ? Math.round(dayPredictions.reduce((sum, p) => sum + (p.confidence_score || 0) * 100, 0) / dayPredictions.length)
        : 0,
    };
  });

  // High risk predictions
  const highRiskCount = predictions.filter(p => p.risk_level === 'high' || p.risk_level === 'critical').length;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <PageHeader 
              title="Analytics Dashboard" 
              description="Insights and trends from AI predictions across all modules" 
              icon={BarChart3} 
              gradient="from-cyan-500 to-blue-500" 
            />
            <Button variant="outline" onClick={fetchPredictions} className="shrink-0">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass border-border">
              <CardHeader className="pb-2">
                <CardDescription>Total Predictions</CardDescription>
                <CardTitle className="text-3xl font-mono">{totalPredictions}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>All time</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardHeader className="pb-2">
                <CardDescription>Average Confidence</CardDescription>
                <CardTitle className="text-3xl font-mono">{(avgConfidence * 100).toFixed(1)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span>Model reliability</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardHeader className="pb-2">
                <CardDescription>Active Modules</CardDescription>
                <CardTitle className="text-3xl font-mono">{Object.keys(moduleDistribution).length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PieChart className="w-4 h-4" />
                  <span>Modules used</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardHeader className="pb-2">
                <CardDescription>High Risk Alerts</CardDescription>
                <CardTitle className="text-3xl font-mono text-destructive">{highRiskCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <Activity className="w-4 h-4" />
                  <span>Require attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Prediction Trend */}
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="text-lg">Prediction Trend (7 Days)</CardTitle>
                <CardDescription>Daily prediction volume and confidence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="predictions" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#colorPredictions)" 
                        name="Predictions"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgConfidence" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        dot={{ fill: '#22c55e' }}
                        name="Avg Confidence %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Module Distribution */}
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="text-lg">Module Distribution</CardTitle>
                <CardDescription>Predictions by AI module</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={moduleChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {moduleChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value, name, props) => [value, props.payload.fullName]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Level Distribution */}
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="text-lg">Risk Level Distribution</CardTitle>
                <CardDescription>Breakdown by risk severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }} 
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {riskChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Confidence Distribution */}
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="text-lg">Confidence Distribution</CardTitle>
                <CardDescription>Prediction confidence score ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={confidenceChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }} 
                      />
                      <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Predictions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty State */}
          {totalPredictions === 0 && (
            <Card className="glass border-border">
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No predictions yet</h3>
                <p className="text-muted-foreground">
                  Start using the AI modules to generate predictions and see analytics here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
