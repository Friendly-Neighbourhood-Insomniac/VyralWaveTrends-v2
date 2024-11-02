import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

interface RegionalMapProps {
  data: {
    [key: string]: { [region: string]: number };
  };
}

export function RegionalMap({ data }: RegionalMapProps) {
  const processedData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return [];
    
    const keywords = Object.keys(data);
    const regions = Object.keys(data[keywords[0]] || {});
    
    // Create array of region data with scores for each keyword
    const regionScores = regions.map(region => {
      const scores: { [key: string]: number } = {};
      keywords.forEach(keyword => {
        scores[keyword] = data[keyword][region] || 0;
      });
      
      // Calculate max score for this region across all keywords
      const maxScore = Math.max(...Object.values(scores));
      
      return {
        region,
        ...scores,
        maxScore
      };
    });

    // Sort by highest score for any keyword
    return regionScores.sort((a, b) => b.maxScore - a.maxScore);
  }, [data]);

  const keywords = Object.keys(data || {});

  // Define color classes with both text and background variants
  const colorVariants = [
    { text: 'text-blue-500', bg: 'bg-blue-500' },
    { text: 'text-red-500', bg: 'bg-red-500' },
    { text: 'text-green-500', bg: 'bg-green-500' }
  ];

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="card p-6 text-center text-gray-400">
        No regional data available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Detailed Rankings Table */}
      <div className="card bg-dark-charcoal/50">
        <h3 className="text-lg font-medium mb-4 text-white">Regional Interest Rankings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Rank</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Region</th>
                {keywords.map((keyword, index) => (
                  <th 
                    key={keyword}
                    className={`px-4 py-3 text-right font-medium ${colorVariants[index]?.text || 'text-gray-400'}`}
                  >
                    {keyword}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {processedData.map((item, index) => (
                <tr 
                  key={item.region}
                  className="hover:bg-dark-charcoal/30 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500 font-medium">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {item.region}
                  </td>
                  {keywords.map((keyword, kidx) => (
                    <td 
                      key={`${item.region}-${keyword}`}
                      className={`px-4 py-3 text-right font-medium ${
                        item[keyword] > 0 ? colorVariants[kidx]?.text || 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {item[keyword] > 0 ? `${item[keyword]}` : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keywords.map((keyword, index) => (
          <div key={keyword} className="stat-card">
            <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${colorVariants[index]?.text || 'text-gray-400'}`}>
              <TrendingUp className="h-5 w-5" />
              Top Regions: "{keyword}"
            </h3>
            <div className="space-y-4">
              {processedData
                .filter(item => item[keyword] > 0)
                .sort((a, b) => b[keyword] - a[keyword])
                .slice(0, 5)
                .map((item) => (
                  <div key={`${keyword}-${item.region}`} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{item.region}</span>
                      <span className={`font-medium ${colorVariants[index]?.text || 'text-gray-400'}`}>
                        {item[keyword]}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-dark-charcoal rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${colorVariants[index]?.bg || 'bg-gray-400'}`}
                        style={{ 
                          width: `${item[keyword]}%`,
                          opacity: '0.3'
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="text-sm text-gray-400 bg-dark-charcoal/50 p-4 rounded-lg space-y-2">
        <p>• Values represent search interest on a scale of 0-100</p>
        <p>• 100 indicates peak search interest in that region</p>
        <p>• Regions are ranked by highest interest across all keywords</p>
        <p>• A dash (-) indicates insufficient search volume</p>
      </div>
    </div>
  );
}

export default RegionalMap;