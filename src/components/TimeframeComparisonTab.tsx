import { useState } from 'react';
import { Search, Loader2, Clock } from 'lucide-react';
import { TimeframeChart } from './TimeframeChart';

interface TimeframeData {
  [keyword: string]: {
    date: string;
    value: number;
  }[];
}

const TIMEFRAME_OPTIONS = [
  { value: 'now 1-H', label: 'Past hour' },
  { value: 'now 4-H', label: 'Past 4 hours' },
  { value: 'now 1-d', label: 'Past day' },
  { value: 'now 7-d', label: 'Past 7 days' },
  { value: 'today 1-m', label: 'Past month' },
  { value: 'today 3-m', label: 'Past 3 months' },
  { value: 'today 12-m', label: 'Past year' },
  { value: 'today 5-y', label: 'Past 5 years' },
  { value: 'all', label: 'All time (2004-present)' }
];

export function TimeframeComparisonTab() {
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [selectedTimeframe, setSelectedTimeframe] = useState('today 12-m');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframeData, setTimeframeData] = useState<TimeframeData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const validKeywords = keywords.filter(k => k.trim());
    
    if (!validKeywords.length) {
      setError('Please enter at least one keyword');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      validKeywords.forEach(k => params.append('keywords', k.trim()));
      params.append('timeframe', selectedTimeframe);
      
      const response = await fetch(
        `https://pytrends-app.onrender.com/api/interest_over_time?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.interest_over_time || !Array.isArray(data.interest_over_time)) {
        throw new Error('Invalid data format received from the API');
      }

      // Transform data into the required format
      const transformedData: TimeframeData = {};
      validKeywords.forEach(keyword => {
        transformedData[keyword] = data.interest_over_time.map((point: any) => ({
          date: point.date,
          value: point[keyword] || 0
        }));
      });

      setTimeframeData(transformedData);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch timeframe data. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addKeyword = () => {
    if (keywords.length < 3) {
      setKeywords([...keywords, '']);
    }
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6 text-white">Timeframe Analysis</h2>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-4">
            {keywords.map((keyword, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => updateKeyword(index, e.target.value)}
                  placeholder={`Enter keyword ${index + 1}`}
                  className="input-primary"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            ))}
          </div>

          {keywords.length < 3 && (
            <button
              type="button"
              onClick={addKeyword}
              className="text-orange hover:text-orange/80 transition-colors flex items-center gap-2"
            >
              + Add another keyword
            </button>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange" />
              Select Timeframe
            </h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="input-primary"
              disabled={isLoading}
            >
              {TIMEFRAME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !keywords.some(k => k.trim())}
              className="btn-primary min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {timeframeData && !isLoading && (
        <div className="card">
          <TimeframeChart data={timeframeData} />
        </div>
      )}
    </div>
  );
}

export default TimeframeComparisonTab;