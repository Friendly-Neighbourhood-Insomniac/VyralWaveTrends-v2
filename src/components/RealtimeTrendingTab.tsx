import { useState, useEffect } from 'react';
import { TrendingUp, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

interface TrendingArticle {
  title: string;
  articleTitle: string;
  articleUrl: string;
  source: string;
  timeAgo: string;
  snippet: string;
  image?: {
    newsUrl: string;
    source: string;
    imageUrl: string;
  };
}

interface TrendingItem {
  title: string;
  articles: TrendingArticle[];
  formattedTraffic: string;
}

interface RealtimeTrendingResponse {
  realtime_trending_searches: TrendingItem[];
}

export function RealtimeTrendingTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingData, setTrendingData] = useState<TrendingItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRealtimeTrends = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://pytrends-app.onrender.com/api/realtime_trending_searches');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RealtimeTrendingResponse = await response.json();
      setTrendingData(data.realtime_trending_searches || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch realtime trending searches. Please try again later.'
      );
      setTrendingData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtimeTrends();
    const interval = setInterval(fetchRealtimeTrends, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">Realtime Trending Searches</h2>
            {lastUpdated && (
              <p className="text-gray-400 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchRealtimeTrends}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Refresh
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
          </div>
        ) : trendingData.length > 0 ? (
          <div className="space-y-6">
            {trendingData.map((trend, index) => (
              <div key={index} className="stat-card group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{trend.title}</h3>
                      <span className="text-orange text-sm font-medium">
                        {trend.formattedTraffic}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {trend.articles?.map((article, articleIndex) => (
                        <div key={articleIndex} className="bg-dark-charcoal/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowRight className="h-4 w-4 text-orange group-hover:translate-x-1 transition-transform" />
                            <a 
                              href={article.articleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-orange transition-colors"
                            >
                              {article.articleTitle}
                            </a>
                          </div>
                          <p className="text-gray-400 text-sm">{article.snippet}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{article.source}</span>
                            <span>{article.timeAgo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-12 text-gray-400">
              No realtime trending searches available at the moment.
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default RealtimeTrendingTab;