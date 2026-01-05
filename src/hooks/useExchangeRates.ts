'use client';

import { useState, useEffect } from 'react';
import { defaultRates } from '@/lib/data';

interface RatesResponse {
  success: boolean;
  rates: Record<string, number>;
  cached: boolean;
  lastUpdated: string;
  warning?: string;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<string, number>>(defaultRates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        const response = await fetch('/api/rates');
        const data: RatesResponse = await response.json();

        if (data.success) {
          setRates(data.rates);
          setLastUpdated(data.lastUpdated);
          setError(data.warning || null);
        } else {
          throw new Error('Failed to fetch rates');
        }
      } catch (err) {
        console.error('Error fetching rates:', err);
        setError('Using offline rates');
        // Keep default rates on error
      } finally {
        setLoading(false);
      }
    }

    fetchRates();

    // Refresh rates every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { rates, loading, error, lastUpdated };
}
