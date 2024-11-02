import { useState } from 'react';
import { Search, Loader2, MapPin, Youtube, Image, Newspaper, Globe2 } from 'lucide-react';
import { InterestChart } from './InterestChart';

interface InterestOverTimeData {
  interest_over_time: {
    date: string;
    [key: string]: number | string;
  }[];
}

const TIMEFRAME_OPTIONS = [
  { value: 'now 7-d', label: 'Past 7 days' },
  { value: 'today 1-m', label: 'Past month' },
  { value: 'today 3-m', label: 'Past 3 months' },
  { value: 'today 12-m', label: 'Past year' },
  { value: 'today 5-y', label: 'Past 5 years' },
];

const GEO_OPTIONS = [
  { code: '', name: 'Worldwide' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
];

const GPROP_OPTIONS = [
  { value: '', label: 'Web Search', icon: Globe2 },
  { value: 'images', label: 'Images', icon: Image },
  { value: 'news', label: 'News', icon: Newspaper },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
];

export function InterestOverTimeTab() {
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [timeframe, setTimeframe] = useState('today 12-m');
  const [geo, setGeo] = useState('');
  const [gprop, setGprop] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interestData, setInterestData] = useState<InterestOverTimeData | null>(null);

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
      params.append('timeframe', timeframe);
      if (geo) params.append('geo', geo);
      if (gprop) params.append('gprop', gprop);

      const response = await fetch(
        `https://pytrends-app.onrender.com/api/interest_over_time?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInterestData(data);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch interest over time data. Please try again later.'
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
        <h2 className="text-2xl font-semibold mb-6 text-white">Interest Over Time Analysis</h2>
        
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="input-primary"
                disabled={isLoading}
              >
                {TIMEFRAME_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Region</label>
              <div className="relative">
                <select
                  value={geo}
                  onChange={(e) => setGeo(e.target.value)}
                  className="input-primary pl-11"
                  disabled={isLoading}
                >
                  {GEO_OPTIONS.map(option => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Search Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GPROP_OPTIONS.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGprop(option.value)}
                      className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${
                        gprop === option.value
                          ? 'bg-orange text-white'
                          : 'bg-dark-charcoal text-gray-400 hover:text-gray-300'
                      }`}
                      disabled={isLoading}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
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

      {interestData && !isLoading && (
        <div className="card">
          <InterestChart 
            data={interestData.interest_over_time}
            keywords={keywords.filter(k => k.trim())}
          />
        </div>
      )}
    </div>
  );
}

export default InterestOverTimeTab;