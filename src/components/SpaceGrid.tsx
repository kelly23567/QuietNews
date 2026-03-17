import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import type { NewsItem } from '../types';

interface SpaceGridProps {
  items: NewsItem[];
  onSelect: (item: NewsItem) => void;
  onRefresh: () => void;
  readItems: Set<number>;
}

const SpaceGrid: React.FC<SpaceGridProps> = ({ items, onSelect, onRefresh, readItems }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [peelingId, setPeelingId] = useState<number | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate slight delay and page flip
    setTimeout(() => {
      onRefresh();
      setIsRefreshing(false);
    }, 600);
  };

  const itemStyles = useMemo(() => {
    const colors = [
      'bg-quiet-sage',
      'bg-quiet-sand',
      'bg-quiet-rose',
      'bg-quiet-fog',
      'bg-paper', // some can just be white-ish
    ];

    return items.map((_, i) => {
      // 0.5 to 1 degree tilt, randomly left or right
      const sign = Math.random() > 0.5 ? 1 : -1;
      const rotation = sign * (0.5 + Math.random() * 0.5); 
      
      const tapeRotation = (Math.random() - 0.5) * 4; // tape slightly angled
      
      return {
        color: colors[i % colors.length],
        rotation,
        tapeRotation,
      };
    });
  }, [items]);

  const handleItemClick = (item: NewsItem) => {
    setPeelingId(item.id);
    setTimeout(() => {
      onSelect(item);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-paper-desk flex flex-col relative overflow-hidden font-sans selection:bg-quiet-taupe/30">
      
      {/* Top Bar */}
      <header className="w-full flex justify-between items-center p-8 z-10 relative">
        <div className="text-xs tracking-[0.3em] uppercase text-ink/40 font-sans">
          Quiet News
        </div>
        
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-ink/40 hover:text-ink/80 transition-colors"
          aria-label="Refresh Desk"
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <RefreshCw size={14} />
          </motion.div>
          <span className="text-[10px] tracking-widest uppercase">Refresh</span>
        </button>
      </header>

      {/* Main Grid */}
      <main className="flex-grow flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={items.length > 0 ? items[0].id : 'empty'}
            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16"
            initial={isRefreshing ? { opacity: 0, rotateX: 90, y: 50 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: -90, y: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {items.map((item, index) => {
              const style = itemStyles[index];
              const isRead = readItems.has(item.id);
              const isPeeling = peelingId === item.id;

              return (
                <motion.div
                  key={item.id}
                  className="relative group cursor-pointer flex flex-col"
                  style={{
                    transformOrigin: 'top center',
                  }}
                  onClick={() => handleItemClick(item)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isPeeling ? {
                    scale: 1.05,
                    rotate: -2, 
                    y: -30,
                    opacity: 0,
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                  } : { 
                    opacity: isRead ? 0.9 : 1, 
                    y: 0,
                    rotate: style.rotation,
                    filter: isRead ? 'grayscale(10%)' : 'none',
                  }}
                  transition={{ 
                    duration: isPeeling ? 0.4 : 0.8, 
                    delay: isPeeling ? 0 : index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={!isPeeling ? { 
                    scale: 1.02, 
                    rotate: 0,
                    zIndex: 20,
                    transition: { duration: 0.4, ease: "easeOut" }
                  } : {}}
                >
                  {/* Card Body - "Real Object" */}
                  <div className={`
                    relative flex-grow flex flex-col p-8 md:p-10 min-h-[32rem] max-w-[20rem] mx-auto w-full
                    ${style.color} rounded-[2px]
                    shadow-paper hover:shadow-paper-hover transition-shadow duration-500
                    border border-black/[0.04]
                  `}>
                     
                     {/* Washi Tape */}
                     <div 
                       className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/30 backdrop-blur-md shadow-sm border border-white/40 rounded-[1px]"
                       style={{ 
                         transform: `translateX(-50%) rotate(${style.tapeRotation}deg)`,
                         // Subtle texture for tape
                         backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
                       }}
                     />

                     {/* Content */}
                     <div className="mt-4 mb-8 flex-grow">
                       {/* Tag - Handwriting */}
                       <div className="mb-6 font-hand text-xl text-ink/40 -rotate-2 inline-block">
                         {item.relevance}
                       </div>
                       
                       {/* Title - Serif */}
                       <h2 className="font-serif text-2xl md:text-[1.75rem] text-ink leading-[1.5] tracking-wide line-clamp-none">
                         {item.statement}
                       </h2>
                     </div>

                     {/* Footer */}
                     <div className="mt-auto pt-6 border-t border-ink/5 flex justify-between items-center text-[10px] font-sans tracking-[0.2em] text-ink/30 uppercase">
                       <span>{item.sourceName}</span>
                       <span>{item.importance}</span>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
};

export default SpaceGrid;