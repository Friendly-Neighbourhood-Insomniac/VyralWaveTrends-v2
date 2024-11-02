export const API_BASE_URL = 'https://pytrends-app.onrender.com/api';

export const ENDPOINTS = {
  INTEREST_OVER_TIME: 'interest_over_time',
  INTEREST_BY_REGION: 'interest_by_region',
  RELATED_QUERIES: 'related_queries',
  RELATED_TOPICS: 'related_topics',
  TRENDING_SEARCHES: 'trending_searches',
  REALTIME_TRENDING: 'realtime_trending_searches',
  SUGGESTIONS: 'suggestions',
  CATEGORIES: 'categories'
} as const;

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string | string[]>
): Promise<T> {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else {
          url.searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (data.error) {
      throw new APIError(data.error);
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

export type EndpointKey = keyof typeof ENDPOINTS;
export type Endpoint = typeof ENDPOINTS[EndpointKey];