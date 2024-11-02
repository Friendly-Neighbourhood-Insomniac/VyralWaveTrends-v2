import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { RegionalMap } from './RegionalMap';

interface RegionalData {
  [key: string]: { [region: string]: number };
}

export function RegionalTab() {
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regionalData, setRegionalData] = useState<RegionalData | null>(null);

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
      const queryString = validKeywords
        .map(k => `keywords=${encodeURIComponent(k.trim())}`)
        .join('&');
      
      const response = await fetch(
        `https://pytrends-app.onrender.com/api/interest_by_region?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRegionalData(data);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch regional data. Please try again later.'
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
        <h2 className="text-2xl font-semibold mb-6 text-white">Regional Interest Analysis</h2>
        
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

      {regionalData && !isLoading && (
        <div className="card">
          <RegionalMap data={regionalData} />
        </div>
      )}
    </div>
  );
}

export default RegionalTab;