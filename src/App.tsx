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

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const news = await fetchNews();
        // If we got enough news, randomize a bit or just take top 8
        // Ensure we have an array
        const safeNews = Array.isArray(news) ? news : [];
        setTodaysNews(safeNews.slice(0, 8)); 
      } catch (error) {
        console.error("Critical error loading news:", error);
        setTodaysNews([]); // Should ideally show an error message
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleSelectNews = (item: NewsItem) => {
    setSelectedNews(item);
  };

  const handleBack = () => {
    setSelectedNews(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-morandi-linen flex flex-col items-center justify-center text-primary">
        <Loader2 className="animate-spin mb-4 text-morandi-taupe" size={48} />
        <p className="font-serif tracking-widest text-sm text-gray-500">GATHERING STORIES...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-morandi-linen text-primary font-sans antialiased selection:bg-morandi-rose/30">
      {selectedNews ? (
        <ContentRoom item={selectedNews} onBack={handleBack} />
      ) : (
        <SpaceGrid items={todaysNews} onSelect={handleSelectNews} />
      )}
    </div>
  );
};

export default App;