import { useState } from 'react';
import { X, Plus, Search, Loader2 } from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import type { ComparisonData, TimelineDataPoint } from '../types';

export function ComparisonTab() {
  const [keywords, setKeywords] = useState<string[]>(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

  const addKeyword = () => {
    if (keywords.length < 3) {
      setKeywords([...keywords, '']);
    }
  };

  const removeKeyword = (index: number) => {
    if (keywords.length > 2) {
      setKeywords(keywords.filter((_, i) => i !== index));
    }
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleCompare = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const validKeywords = keywords.filter(k => k.trim());
    if (validKeywords.length < 2) {
      setError('Please enter at least 2 keywords to compare');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryString = validKeywords
        .map(k => `keywords=${encodeURIComponent(k.trim())}`)
        .join('&');
      const response = await fetch(`https://pytrends-app.onrender.com/api/trends?${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      
      if (!Array.isArray(rawData) || !rawData.length) {
        throw new Error('Invalid data received from the API');
      }

      const timelineData = rawData.map(point => {
        const dataPoint: { [key: string]: any } = { date: point.date };
        validKeywords.forEach(keyword => {
          dataPoint[keyword] = point[keyword] || 0;
        });
        return dataPoint;
      });

      setComparisonData({
        timelineData,
        keywords: validKeywords
      });
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch comparison data. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getKeywordData = (keyword: string): TimelineDataPoint[] => {
    if (!comparisonData?.timelineData) return [];
    return comparisonData.timelineData.map(point => ({
      date: point.date,
      value: point[keyword] || 0
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6 text-white">Compare Search Trends</h2>
        <form onSubmit={handleCompare} className="max-w-3xl mx-auto">
          <div className="space-y-5">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    placeholder={`Enter keyword ${index + 1}`}
                    className="input-primary"
                    disabled={isLoading}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
                {keywords.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="p-3 text-gray-400 hover:text-magenta transition-colors rounded-lg hover:bg-dark-charcoal"
                    disabled={isLoading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            
            {keywords.length < 3 && (
              <button
                type="button"
                onClick={addKeyword}
                className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors px-4 py-2 rounded-lg hover:bg-dark-charcoal"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Add another keyword</span>
              </button>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading || keywords.filter(k => k.trim()).length < 2}
                className="btn-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  'Compare Trends'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {comparisonData && !isLoading && (
        <div className="space-y-12">
          <ComparisonChart data={comparisonData} />
          
          <div className="grid grid-cols-1 gap-8">
            {comparisonData.keywords.map((keyword) => (
              <div key={keyword} className="card">
                <h3 className="text-xl font-semibold mb-6 text-white px-2">Analytics for "{keyword}"</h3>
                <AnalyticsDashboard
                  timelineData={getKeywordData(keyword)}
                  keyword={keyword}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparisonTab;