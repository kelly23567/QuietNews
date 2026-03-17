import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SpaceGrid from './components/SpaceGrid';
import ContentRoom from './components/ContentRoom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NewsCardSkeleton } from './components/NewsCardSkeleton';
import { useNews } from './hooks/useNews';
import { useReadTracker } from './hooks/useReadTracker';
import type { NewsItem } from './types';

const App = () => {
  const { news, loading, error, refresh } = useNews();
  const { readItems, markAsRead } = useReadTracker();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const handleSelectNews = (item: NewsItem) => {
    setSelectedNews(item);
    markAsRead(item.id);
  };

  const handleBack = () => {
    setSelectedNews(null);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-quiet-taupe/30">
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {selectedNews ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ContentRoom item={selectedNews} onBack={handleBack} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="min-h-screen bg-paper-desk flex flex-col">
                  <header className="w-full flex justify-between items-center p-8">
                    <div className="text-xs tracking-[0.3em] uppercase text-ink/40 font-sans">
                      Quiet News
                    </div>
                  </header>
                  <main className="flex-grow flex items-center justify-center p-8">
                    <NewsCardSkeleton />
                  </main>
                </div>
              ) : error ? (
                <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-ink p-8">
                  <p className="font-sans text-sm text-ink/50 mb-6">{error}</p>
                  <button
                    onClick={refresh}
                    className="px-6 py-3 text-xs font-sans tracking-[0.2em] uppercase text-ink/60 hover:text-ink border border-ink/10 hover:border-ink/30 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <SpaceGrid
                  items={news}
                  onSelect={handleSelectNews}
                  onRefresh={refresh}
                  readItems={readItems}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  );
};

export default App;
