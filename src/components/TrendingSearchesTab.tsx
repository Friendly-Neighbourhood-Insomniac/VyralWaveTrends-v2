import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

interface TrendingSearchesResponse {
  trending_searches: string[];
}

const REGIONS = [
  { code: 'united_states', name: 'United States' },
  { code: 'india', name: 'India' },
  { code: 'japan', name: 'Japan' },
  { code: 'singapore', name: 'Singapore' },
  { code: 'canada', name: 'Canada' },
  { code: 'australia', name: 'Australia' },
  { code: 'united_kingdom', name: 'United Kingdom' },
  { code: 'germany', name: 'Germany' },
  { code: 'brazil', name: 'Brazil' },
  { code: 'france', name: 'France' },
];

export function TrendingSearchesTab() {
  const [selectedRegion, setSelectedRegion] = useState('united_states');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { 
    data: trendingData,
    error,
    isLoading,
    execute: fetchTrendingSearches
  } = useAPI<TrendingSearchesResponse>('TRENDING_SEARCHES');

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    fetchTrendingSearches({ geo: newRegion });
  };

  const handleRefresh = () => {
    fetchTrendingSearches({ geo: selectedRegion });
    setLastUpdated(new Date());
  };

  useEffect(() => {
    handleRefresh();
    const interval = setInterval(handleRefresh, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [selectedRegion]);

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Real-Time Trending Searches</h2>
            {lastUpdated && (
              <p className="text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="input-primary pl-11"
                disabled={isLoading}
              >
                {REGIONS.map(region => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Loading...
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
        </div>

        {error && <ErrorDisplay error={error} className="mb-6" />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingData?.trending_searches.map((search, index) => (
            <div key={index} className="stat-card group">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-orange group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-orange font-medium">#{index + 1}</span>
                    <ArrowRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                    <p className="text-white truncate">{search}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-400 bg-dark-charcoal p-4 rounded-lg">
          <p>* Trending searches are updated in real-time and show what people are searching for right now.</p>
          <p>* Rankings are based on sudden increases in search frequency.</p>
        </div>
      </div>
    </div>
  );
}

export default TrendingSearchesTab;