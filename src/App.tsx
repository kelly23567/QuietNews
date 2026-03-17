import React, { useState, useEffect } from 'react';
import SpaceGrid from './components/SpaceGrid';
import ContentRoom from './components/ContentRoom';
import { fetchNews } from './services/newsService';
import type { NewsItem } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [todaysNews, setTodaysNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [readItems, setReadItems] = useState<Set<number>>(new Set());

  const loadNews = async () => {
    setLoading(true);
    try {
      const news = await fetchNews();
      const safeNews = Array.isArray(news) ? news : [];
      setTodaysNews(safeNews.slice(0, 9)); 
    } catch (error) {
      console.error("Critical error loading news:", error);
      setTodaysNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleSelectNews = (item: NewsItem) => {
    setSelectedNews(item);
    setReadItems(prev => {
      const newSet = new Set(prev);
      newSet.add(item.id);
      return newSet;
    });
  };

  const handleBack = () => {
    setSelectedNews(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-ink">
        <Loader2 className="animate-spin mb-4 text-quiet-taupe" size={32} strokeWidth={1} />
        <p className="font-sans tracking-[0.2em] text-xs text-gray-400">PREPARING DESK...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-quiet-taupe/30">
      {selectedNews ? (
        <ContentRoom item={selectedNews} onBack={handleBack} />
      ) : (
        <SpaceGrid 
          items={todaysNews} 
          onSelect={handleSelectNews} 
          onRefresh={loadNews} 
          readItems={readItems}
        />
      )}
    </div>
  );
};

export default App;