import { useState, useCallback } from 'react';

const STORAGE_KEY = 'quietnews:read-items';

function loadReadItems(): Set<number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch {
    // Corrupted data — silently reset
  }
  return new Set();
}

function saveReadItems(items: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...items]));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function useReadTracker() {
  const [readItems, setReadItems] = useState<Set<number>>(loadReadItems);

  const markAsRead = useCallback((id: number) => {
    setReadItems(prev => {
      const next = new Set(prev);
      next.add(id);
      saveReadItems(next);
      return next;
    });
  }, []);

  return { readItems, markAsRead };
}
