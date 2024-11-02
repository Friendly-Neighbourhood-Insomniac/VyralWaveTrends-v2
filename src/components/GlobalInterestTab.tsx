import { useState } from 'react';
import { Search, Globe2 } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { COUNTRY_CODES } from '../utils/countryData';

interface GlobalData {
  [keyword: string]: { [country: string]: number };
}

export function GlobalInterestTab() {
  const [keywords, setKeywords] = useState<string[]>(['']);
  const { data, error, isLoading, execute: fetchData } = useAPI<GlobalData>('INTEREST_BY_REGION');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const validKeywords = keywords.filter(k => k.trim());
    if (validKeywords.length > 0) {
      fetchData({ keywords: validKeywords });
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

  const renderResults = () => {
    if (!data) return null;

    return Object.entries(data).map(([keyword, countryData]) => {
      const sortedCountries = Object.entries(countryData)
        .map(([code, value]) => ({
          code,
          name: COUNTRY_CODES[code.toUpperCase()] || code,
          value
        }))
        .filter(country => country.value > 0)
        .sort((a, b) => b.value - a.value);

      return (
        <div key={keyword} className="stat-card">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
            <Globe2 className="h-6 w-6 text-orange" />
            Global Interest for "{keyword}"
          </h3>

          {sortedCountries.length > 0 ? (
            <div className="space-y-4">
              {sortedCountries.map((country, idx) => (
                <div key={country.code} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">#{idx + 1}</span>
                      <span className="text-white">{country.name}</span>
                    </div>
                    <span className="text-orange font-medium">{country.value}</span>
                  </div>
                  <div className="w-full h-2 bg-dark-charcoal rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange rounded-full transition-all duration-500"
                      style={{ 
                        width: `${country.value}%`,
                        opacity: '0.3'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No countries showing significant interest</p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Globe2 className="h-6 w-6 text-orange" />
          <h2 className="text-2xl font-semibold text-white">Global Interest Analysis</h2>
        </div>
        
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
                  <LoadingSpinner size="sm" />
                  Loading...
                </>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </form>
      </div>

      {error && <ErrorDisplay error={error} />}

      {isLoading ? (
        <div className="card min-h-[400px] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {renderResults()}
        </div>
      )}
    </div>
  );
}