import { useState } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { TrendChart } from './components/TrendChart';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GuideTab } from './components/GuideTab';
import { ComparisonTab } from './components/ComparisonTab';
import { TimeframeComparisonTab } from './components/TimeframeComparisonTab';
import { TrendingSearchesTab } from './components/TrendingSearchesTab';
import { InterestOverTimeTab } from './components/InterestOverTimeTab';
import { RealtimeTrendingTab } from './components/RealtimeTrendingTab';
import { SuggestionsTab } from './components/SuggestionsTab';
import { CategoriesTab } from './components/CategoriesTab';
import { RegionalInterestTab } from './components/RegionalInterestTab';
import { ENDPOINTS, fetchAPI, APIError } from './config/api';
import type { TimelineDataPoint } from './types';

type TabType = 'trends' | 'compare' | 'regional-interest' | 'timeframes' | 'trending' | 'interest' | 'realtime' | 'suggestions' | 'categories' | 'guide';

interface InterestOverTimeResponse {
  interest_over_time: Array<{
    date: string;
    [key: string]: number | string;
  }>;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('trends');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleSearch = async (keyword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAPI<InterestOverTimeResponse>(
        ENDPOINTS.INTEREST_OVER_TIME,
        { keywords: keyword }
      );

      const formattedData = data.interest_over_time.map(point => ({
        date: point.date,
        value: (point[keyword] as number) || 0
      }));

      setTimelineData(formattedData);
      setCurrentKeyword(keyword);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof APIError
          ? err.message
          : 'Failed to fetch trend data. Please try again later.'
      );
      setTimelineData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <nav className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'trends'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Single Trend
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'compare'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Compare Trends
            </button>
            <button
              onClick={() => setActiveTab('regional-interest')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'regional-interest'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Regional Interest
            </button>
            <button
              onClick={() => setActiveTab('timeframes')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'timeframes'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Timeframe Analysis
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'trending'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('realtime')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'realtime'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Realtime Trends
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'suggestions'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Search Suggestions
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'categories'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'guide'
                  ? 'bg-orange text-white shadow-lg shadow-orange/20'
                  : 'bg-dark-charcoal text-gray-400 hover:bg-dark-charcoal/70 hover:text-gray-300'
              }`}
            >
              Usage Guide
            </button>
          </nav>

          {activeTab === 'trends' && (
            <div className="space-y-8">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              
              {error && (
                <div className="bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg">
                  {error}
                </div>
              )}

              {timelineData.length > 0 && (
                <>
                  <AnalyticsDashboard 
                    timelineData={timelineData} 
                    keyword={currentKeyword} 
                  />
                  <TrendChart 
                    data={timelineData} 
                    keyword={currentKeyword} 
                  />
                </>
              )}
            </div>
          )}
          {activeTab === 'compare' && <ComparisonTab />}
          {activeTab === 'regional-interest' && <RegionalInterestTab />}
          {activeTab === 'timeframes' && <TimeframeComparisonTab />}
          {activeTab === 'trending' && <TrendingSearchesTab />}
          {activeTab === 'interest' && <InterestOverTimeTab />}
          {activeTab === 'realtime' && <RealtimeTrendingTab />}
          {activeTab === 'suggestions' && <SuggestionsTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'guide' && <GuideTab />}
        </div>
      </main>
    </div>
  );
}

export default App;