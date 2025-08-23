import { useState, useEffect, useRef } from 'react';
import { alphaVantageAPI, StockQuote } from '../services/alphaVantageApi';

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

  const fetchQuotes = async () => {
    if (!enabled || symbols.length === 0) return;

    console.log('Fetching quotes for symbols:', symbols);
    setIsLoading(true);
    setError(null);

    try {
      const newQuotes = await alphaVantageAPI.getMultipleQuotes(symbols);
      console.log('Fetched quotes:', newQuotes);
      setQuotes(newQuotes);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotes';
      setError(errorMessage);
      console.error('Real-time quotes error:', err);
      console.error('Error details:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchQuotes();

    // Set up interval for periodic updates
    if (refreshInterval > 0) {
      intervalRef.current = window.setInterval(fetchQuotes, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbols.join(','), refreshInterval, enabled]);

  const refetch = () => {
    fetchQuotes();
  };

  return {
    quotes,
    isLoading,
    error,
    lastUpdated,
    refetch
  };
};
