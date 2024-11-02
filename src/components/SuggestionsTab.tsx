import { useState } from 'react';
import { Search, Loader2, Lightbulb } from 'lucide-react';

interface Suggestion {
  title: string;
  type: string;
  mid?: string;
}

export function SuggestionsTab() {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://pytrends-app.onrender.com/api/suggestions?keyword=${encodeURIComponent(keyword.trim())}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch suggestions. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6 text-white">Search Suggestions</h2>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter a keyword to get suggestions..."
                className="input-primary"
                disabled={isLoading}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
            <button
              type="submit"
              disabled={isLoading || !keyword.trim()}
              className="btn-primary min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Get Ideas'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg mt-6">
            {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="stat-card group">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-orange group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{suggestion.title}</p>
                    <p className="text-sm text-gray-400">{suggestion.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestionsTab;