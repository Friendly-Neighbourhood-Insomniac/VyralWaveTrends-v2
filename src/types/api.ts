export interface APIResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface InterestOverTimeResponse {
  interest_over_time: Array<{
    date: string;
    [key: string]: number | string;
  }>;
}

export interface TrendingSearchesResponse {
  trending_searches: string[];
}

export interface SuggestionsResponse {
  suggestions: Array<{
    title: string;
    type: string;
    mid?: string;
  }>;
}

export interface CategoriesResponse {
  categories: {
    [key: string]: string | { [key: string]: string | object };
  };
}

export interface RegionalInterestResponse {
  [keyword: string]: {
    [region: string]: number;
  };
}

export interface RelatedQueriesResponse {
  [keyword: string]: {
    rising: Array<{
      query: string;
      value: number;
    }>;
    top: Array<{
      query: string;
      value: number;
    }>;
  };
}

export interface RealtimeTrendsResponse {
  realtime_trending_searches: Array<{
    title: string;
    articles: Array<{
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
    }>;
    formattedTraffic: string;
  }>;
}