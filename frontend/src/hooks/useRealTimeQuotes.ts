import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { finnhubAPI, StockQuote } from '../services/finnhubApi';

export interface UseRealTimeQuotesOptions {
  symbols: string[];
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

export const useRealTimeQuotes = ({
  symbols,
  refreshInterval = 60000, // 1 minute default
  enabled = true
}: UseRealTimeQuotesOptions) => {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<number>();

  // Memoize symbols string to prevent unnecessary re-renders
  const symbolsKey = useMemo(() => [...symbols].sort().join(','), [symbols]);

  const fetchQuotes = useCallback(async () => {
    if (!enabled || symbols.length === 0) return;

    // Only log in development
    if (import.meta.env.DEV) {
      console.log('Fetching quotes for symbols:', symbols);
    }
    setIsLoading(true);
    setError(null);

    try {
      const newQuotes = await finnhubAPI.getMultipleQuotes(symbols);
      if (import.meta.env.DEV) {
        console.log('Fetched quotes:', newQuotes);
      }
      setQuotes(newQuotes);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotes';
      setError(errorMessage);
      console.error('Real-time quotes error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [symbols, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch with slight delay to avoid blocking render
    const timeoutId = setTimeout(() => {
      fetchQuotes();
    }, 100);

    // Set up interval for periodic updates
    if (refreshInterval > 0) {
      intervalRef.current = window.setInterval(fetchQuotes, refreshInterval);
    }

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbolsKey, refreshInterval, enabled, fetchQuotes]);

  const refetch = useCallback(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    isLoading,
    error,
    lastUpdated,
    refetch
  };
};
