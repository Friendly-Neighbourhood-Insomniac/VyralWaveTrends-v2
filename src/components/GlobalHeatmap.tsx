import { useMemo } from 'react';
import { TrendingUp, Globe2 } from 'lucide-react';
import { COUNTRY_CODES } from '../utils/countryData';

interface GlobalHeatmapProps {
  data: {
    [keyword: string]: { [country: string]: number };
  };
}

export function GlobalHeatmap({ data }: GlobalHeatmapProps) {
  const processedData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return [];
    
    const keywords = Object.keys(data);
    
    // Get all country codes from all keywords
    const allCountryCodes = new Set<string>();
    keywords.forEach(keyword => {
      Object.keys(data[keyword]).forEach(code => allCountryCodes.add(code));
    });
    
    // Convert country codes to names and process data
    return Array.from(allCountryCodes)
      .map(countryCode => {
        const scores: { [key: string]: number } = {};
        keywords.forEach(keyword => {
          scores[keyword] = data[keyword][countryCode] || 0;
        });
        
        const maxScore = Math.max(...Object.values(scores));
        // Get the country name from our mapping, fallback to code if not found
        const countryName = COUNTRY_CODES[countryCode.toUpperCase()] || countryCode;
        
        return {
          countryCode,
          countryName,
          ...scores,
          maxScore
        };
      })
      .filter(item => item.maxScore > 0) // Only keep countries with non-zero scores
      .sort((a, b) => b.maxScore - a.maxScore);
  }, [data]);

  const keywords = Object.keys(data || {});

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-4">
        <Globe2 className="h-12 w-12 opacity-50" />
        <p>No global interest data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {keywords.map((keyword) => {
        const countryData = processedData
          .filter(item => item[keyword] > 0)
          .sort((a, b) => b[keyword] - a[keyword]);

        return (
          <div key={keyword} className="stat-card">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
              <Globe2 className="h-6 w-6 text-orange" />
              Global Interest for "{keyword}"
            </h3>

            {countryData.length > 0 ? (
              <div className="space-y-4">
                {countryData.map((item, idx) => (
                  <div key={`${keyword}-${item.countryCode}`} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">#{idx + 1}</span>
                        <span className="text-white">{item.countryName}</span>
                      </div>
                      <span className="text-orange font-medium">{item[keyword]}</span>
                    </div>
                    <div className="w-full h-2 bg-dark-charcoal rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item[keyword]}%`,
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
      })}

      <div className="text-sm text-gray-400 bg-dark-charcoal/50 p-4 rounded-lg space-y-2">
        <p>• Values represent search interest on a scale of 0-100</p>
        <p>• 100 indicates peak search interest in that country</p>
        <p>• Only showing countries with significant search interest</p>
      </div>
    </div>
  );
}