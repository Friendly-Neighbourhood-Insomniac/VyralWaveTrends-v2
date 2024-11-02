import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { TimelineDataPoint } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface AnalyticsDashboardProps {
  timelineData: TimelineDataPoint[];
  keyword: string;
  isLoading?: boolean;
}

export function AnalyticsDashboard({ 
  timelineData, 
  keyword,
  isLoading = false 
}: AnalyticsDashboardProps) {
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!timelineData || timelineData.length === 0) {
    return null;
  }

  const currentValue = timelineData[timelineData.length - 1]?.value ?? 0;
  const previousValue = timelineData[timelineData.length - 2]?.value ?? 0;
  const trend = currentValue - previousValue;
  const maxValue = Math.max(...timelineData.map(d => d.value));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat-card group">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <Activity className="h-5 w-5 text-magenta group-hover:animate-pulse" />
          <h3 className="font-medium">Current Interest</h3>
        </div>
        <p className="text-3xl font-bold text-orange">{currentValue}</p>
        <p className="text-sm text-gray-400 mt-2">Search interest for "{keyword}"</p>
      </div>

      <div className="stat-card group">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          {trend >= 0 ? (
            <TrendingUp className="h-5 w-5 text-orange group-hover:animate-pulse" />
          ) : (
            <TrendingDown className="h-5 w-5 text-magenta group-hover:animate-pulse" />
          )}
          <h3 className="font-medium">Trend</h3>
        </div>
        <p className={`text-3xl font-bold ${trend >= 0 ? 'text-orange' : 'text-magenta'}`}>
          {trend >= 0 ? '+' : ''}{trend}
        </p>
        <p className="text-sm text-gray-400 mt-2">Change from previous period</p>
      </div>

      <div className="stat-card group">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <Activity className="h-5 w-5 text-orange group-hover:animate-pulse" />
          <h3 className="font-medium">Peak Interest</h3>
        </div>
        <p className="text-3xl font-bold text-orange">{maxValue}</p>
        <p className="text-sm text-gray-400 mt-2">Highest point in the period</p>
      </div>
    </div>
  );
}