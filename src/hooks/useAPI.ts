import { useState, useCallback } from 'react';
import { fetchAPI, APIError, EndpointKey, ENDPOINTS } from '../config/api';

interface UseAPIOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: APIError) => void;
}

export function useAPI<T>(
  endpoint: EndpointKey,
  options: UseAPIOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (params?: Record<string, string | string[]>) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchAPI<T>(ENDPOINTS[endpoint], params);
      
      setData(result);
      options.onSuccess?.(result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      options.onError?.(err as APIError);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, options]);

  return {
    data,
    error,
    isLoading,
    execute,
    reset: useCallback(() => {
      setData(null);
      setError(null);
      setIsLoading(false);
    }, [])
  };
}