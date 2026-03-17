import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Sparkles, Bot, Loader2 } from 'lucide-react';
import type { NewsItem } from '../types';
import { generateSummary } from '../services/aiService';

interface ContentRoomProps {
  item: NewsItem;
  onBack: () => void;
}

const ContentRoom: React.FC<ContentRoomProps> = ({ item, onBack }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Random rotation for that "hand-placed" feel
  const rotation = Math.random() * 2 - 1; 

  useEffect(() => {
    const fetchSummary = async () => {
      setIsSummarizing(true);
      const contentToSummarize = item.fullContent || item.background;
      const result = await generateSummary(contentToSummarize, item.statement);
      setSummary(result);
      setIsSummarizing(false);
    };

    fetchSummary();
  }, [item]);

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-paper-realistic relative text-primary overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Decor - Abstract Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-morandi-sage/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-morandi-rose/20 rounded-full blur-3xl" />

      {/* Navigation - Washi Tape Style */}
      <nav className="fixed top-8 left-8 z-20">
        <button 
          onClick={onBack}
          className="group relative"
          aria-label="Back to home"
        >
          <div className="absolute -inset-2 bg-morandi-taupe/30 rotate-[-2deg] mask-image-tape rounded-sm blur-[0.5px]"></div>
          <div className="relative flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm rotate-1 transition-transform group-hover:rotate-0 duration-300">
            <ArrowLeft size={18} className="text-morandi-taupe group-hover:text-primary transition-colors" />
            <span className="font-hand text-xl text-primary/80 group-hover:text-primary">Back</span>
          </div>
        </button>
      </nav>

      {/* Main Content Area - The Unfolded Paper */}
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative z-10 min-h-screen">
        
        <motion.div
          className="relative bg-white w-full max-w-4xl min-h-[85vh] p-8 md:p-16 shadow-2xl rotate-[0.5deg]"
          initial={{ y: 100, opacity: 0, rotate: 5, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, rotate: rotation, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          style={{
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
             backgroundImage: 'linear-gradient(to right, #fdfbf7 0%, #fff 10%, #fff 90%, #fdfbf7 100%)' // Subtle fold effect
          }}
        >
          {/* Fold Crease - Vertical */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-50"></div>
          
          {/* Washi Tape at Top */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-morandi-sage/60 rotate-[-1deg] shadow-sm backdrop-blur-[1px] mask-image-tape"></div>

          {/* Date Stamp (Simulated) */}
          <div className="absolute top-8 right-8 rotate-12 opacity-60 border-2 border-morandi-taupe/50 p-2 rounded-lg">
             <div className="text-xs font-sans text-morandi-taupe uppercase tracking-widest text-center">Date</div>
             <div className="font-hand text-lg text-morandi-taupe">Today</div>
          </div>

          <article className="prose prose-stone prose-lg max-w-none font-serif text-gray-700 leading-loose relative z-10">
            {/* Header Section */}
            <header className="text-center mb-12 relative">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight mb-8">
                {item.statement}
              </h1>
              
              <div className="flex justify-center items-center gap-4 text-sm text-gray-500 font-sans tracking-widest uppercase">
                <span>{item.importance}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{item.relevance}</span>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-4 mt-8 opacity-50">
                <div className="w-24 h-[1px] bg-morandi-taupe"></div>
                <Sparkles size={16} className="text-morandi-taupe" />
                <div className="w-24 h-[1px] bg-morandi-taupe"></div>
              </div>
            </header>

            {/* AI Summary Section */}
            <div className="mb-12 bg-morandi-fog/10 p-6 rounded-sm border border-morandi-fog/20 relative">
              <div className="absolute -top-3 left-6 bg-white px-2 text-xs font-sans text-morandi-fog uppercase tracking-widest flex items-center gap-2">
                <Bot size={14} />
                <span>AI Summary</span>
              </div>
              
              {isSummarizing ? (
                <div className="flex items-center gap-3 text-morandi-taupe text-sm font-sans py-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="animate-pulse">Analyzing article...</span>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-sans text-gray-600 leading-relaxed text-sm md:text-base"
                >
                  {summary}
                </motion.div>
              )}
            </div>

            {/* Main Body */}
            <div className="columns-1 md:columns-2 gap-12 text-justify">
               {/* Context / Background as intro */}
               <div className="mb-8 font-hand text-2xl text-morandi-taupe leading-relaxed break-inside-avoid">
                 "{item.background}"
               </div>

               {/* Full Content */}
               <div className="first-letter:text-6xl first-letter:font-serif first-letter:text-morandi-taupe first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                 {item.fullContent || "Content unavailable."}
               </div>
            </div>

            {/* Source Link */}
            {item.sourceUrl && (
              <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
                <a 
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-morandi-taupe hover:text-primary transition-colors px-6 py-3 border border-dashed border-gray-300 hover:border-morandi-taupe rounded-sm"
                >
                  <span className="font-sans text-xs tracking-widest uppercase">Read original at {item.sourceName || "Source"}</span>
                  <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            )}
          </article>
          
          {/* Footer Watermark */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-300 font-sans uppercase tracking-[0.5em] pointer-events-none">
            Quiet News Network
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContentRoom;