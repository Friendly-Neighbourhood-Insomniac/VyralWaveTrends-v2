import { useState } from 'react';
import { Search, Loader2, TrendingUp, ArrowRight } from 'lucide-react';

interface RelatedQuery {
  query: string;
  value: number;
}

interface RelatedQueriesData {
  [keyword: string]: {
    rising: RelatedQuery[];
    top: RelatedQuery[];
  };
}

export function RelatedQueriesTab() {
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedData, setRelatedData] = useState<RelatedQueriesData | null>(null);

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
      // Build URL with multiple keyword parameters
      const url = new URL('https://pytrends-app.onrender.com/api/related_queries');
      validKeywords.forEach(keyword => {
        url.searchParams.append('keywords', keyword.trim());
      });
      
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRelatedData(data);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch related queries. Please try again later.'
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

  const removeKeyword = (index: number) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter((_, i) => i !== index));
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
        <h2 className="text-2xl font-semibold mb-6 text-white">Related Queries Analysis</h2>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-4">
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
                {keywords.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {keywords.length < 3 && (
            <button
              type="button"
              onClick={addKeyword}
              className="text-orange hover:text-orange/80 transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              + Add another keyword
            </button>
          )}

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

      {relatedData && !isLoading && (
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(relatedData).map(([keyword, data]) => (
            <div key={keyword} className="card">
              <h3 className="text-xl font-semibold mb-6 text-white">Related Queries for "{keyword}"</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-orange flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Rising Queries
                  </h4>
                  <div className="space-y-3">
                    {data.rising.map((query, index) => (
                      <div key={index} className="stat-card group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-orange group-hover:translate-x-1 transition-transform" />
                            <span className="text-white">{query.query}</span>
                          </div>
                          <span className="text-orange font-medium">
                            {query.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-magenta flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Queries
                  </h4>
                  <div className="space-y-3">
                    {data.top.map((query, index) => (
                      <div key={index} className="stat-card group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-magenta group-hover:translate-x-1 transition-transform" />
                            <span className="text-white">{query.query}</span>
                          </div>
                          <span className="text-magenta font-medium">
                            {query.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RelatedQueriesTab;