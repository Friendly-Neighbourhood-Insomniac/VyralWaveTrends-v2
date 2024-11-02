import { useState } from 'react';
import { APIError, fetchAPI } from '../config/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>({ onSuccess, onError }: UseApiOptions<T> = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (
    endpoint: string,
    params?: Record<string, string | string[]>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAPI<T>(endpoint, params);
      onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    execute,
    setError
  };
}