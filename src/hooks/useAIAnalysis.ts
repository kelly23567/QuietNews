import { useState, useEffect, useRef } from 'react';
import { generateSummary, type AIAnalysis } from '../services/aiService';
import type { NewsItem } from '../types';

export function useAIAnalysis(item: NewsItem) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemRef = useRef(item);
  itemRef.current = item;

  useEffect(() => {
    let cancelled = false;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        const content = itemRef.current.fullContent || itemRef.current.background;
        const result = await generateSummary(content, itemRef.current.statement);
        if (!cancelled) {
          setAnalysis(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to generate analysis:', err);
          setError('Failed to generate AI analysis.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, [item.id]);

  return { analysis, loading, error };
}
