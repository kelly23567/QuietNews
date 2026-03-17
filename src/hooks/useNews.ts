import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/newsService';
import type { NewsItem } from '../types';

const MAX_ITEMS = 9;

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNews();
      const safeResult = Array.isArray(result) ? result : [];
      setNews(safeResult.slice(0, MAX_ITEMS));
    } catch (err) {
      console.error('Failed to load news:', err);
      setError('Failed to load news. Please try again.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return { news, loading, error, refresh: loadNews };
}
