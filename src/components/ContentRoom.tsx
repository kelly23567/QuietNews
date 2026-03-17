import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { NewsItem } from '../types';
import { generateSummary, type AIAnalysis } from '../services/aiService';

interface ContentRoomProps {
  item: NewsItem;
  onBack: () => void;
}

const ContentRoom: React.FC<ContentRoomProps> = ({ item, onBack }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // 顶部进度条
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchSummary = async () => {
      setIsSummarizing(true);
      const contentToSummarize = item.fullContent || item.background;
      const result = await generateSummary(contentToSummarize, item.statement);
      setAnalysis(result);
      setIsSummarizing(false);
    };

    fetchSummary();
  }, [item]);

  return (
    <motion.div 
      className="min-h-screen bg-paper-desk text-ink relative py-12 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 1px 细线进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-ink/20 origin-left z-50"
        style={{ scaleX }}
      />

      {/* 极简 Back 按钮 */}
      <nav className="fixed top-4 left-4 z-40 md:top-8 md:left-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors p-2 bg-paper/80 backdrop-blur-sm rounded-md"
          aria-label="Back"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
      </nav>

      {/* 主体内容：具有实体纸张感的卡片 */}
      <main 
        className="max-w-3xl mx-auto bg-paper border border-ink/5 shadow-paper mt-12 mb-16 relative"
        style={{
          // 微妙的纸张纤维/噪点纹理，增加真实感
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E")`
        }}
      >
        
        {/* 顶部胶带装饰（与首页呼应） */}
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-md shadow-sm border border-white/50 rounded-[1px] rotate-1 z-10"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
          }}
        />

        <div className="p-8 md:p-14">
          
          {/* 标题区域 */}
          <header className="mb-16">
            <div className="flex justify-between items-start mb-8">
              <div className="font-hand text-2xl text-ink/40 -rotate-2">
                {item.relevance}
              </div>
              <div className="text-xs font-sans tracking-[0.2em] text-ink/30 uppercase text-right leading-loose">
                {item.sourceName}<br/>
                {new Date(item.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-[2.5rem] font-serif leading-[1.5] text-ink tracking-tight">
              {item.statement}
            </h1>
          </header>

          {/* 洞察区域 (Insight) */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6 opacity-60">
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-ink/20 to-transparent"></div>
              <span className="text-[10px] font-sans tracking-[0.3em] text-ink/50 uppercase">Insight</span>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-ink/20 to-transparent"></div>
            </div>
            
            {isSummarizing ? (
              <div className="flex justify-center items-center gap-3 text-ink/40 text-sm font-sans py-8">
                <Loader2 size={14} className="animate-spin" />
                <span className="animate-pulse">Distilling meaning...</span>
              </div>
            ) : (
              <div className="px-4 md:px-12">
                <p className="text-xl md:text-2xl font-serif leading-[1.8] text-ink/90 text-center relative tracking-normal">
                  <span className="absolute -top-4 -left-6 text-4xl text-ink/10 font-serif">"</span>
                  {analysis?.insight || "暂无洞察"}
                  <span className="absolute -bottom-4 -right-6 text-4xl text-ink/10 font-serif">"</span>
                </p>
              </div>
            )}
          </section>

          {/* 摘要区域 (Summary) */}
          <section className="mb-16">
            <h2 className="text-xs font-sans tracking-[0.2em] text-ink/30 uppercase mb-8 text-center">
              Summary
            </h2>
            
            {isSummarizing ? (
              <div className="flex justify-center items-center gap-3 text-ink/40 text-sm font-sans py-4">
                <Loader2 size={14} className="animate-spin" />
                <span className="animate-pulse">Synthesizing facts...</span>
              </div>
            ) : (
              <div className="text-base md:text-lg font-sans leading-[2] text-ink/80 space-y-6 text-justify px-2 md:px-8 tracking-[-0.01em]">
                {analysis?.summary.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="indent-8">{paragraph}</p>
                ))}
              </div>
            )}
          </section>

          {/* 正文区域 (Full Text) - 弱化存在感 */}
          <section className="pt-16 mt-16 border-t border-ink/5">
            <h2 className="text-[10px] font-sans tracking-[0.2em] text-ink/30 uppercase mb-8 text-center">
              Original Text
            </h2>
            <div className="text-sm font-sans leading-[2] text-ink/40 space-y-4 text-justify px-2 md:px-8 tracking-[-0.01em]">
              <p className="indent-8">{item.background}</p>
              <p className="indent-8">{item.fullContent}</p>
            </div>
            
            {/* 原文链接 */}
            {item.sourceUrl && (
              <div className="mt-16 text-center">
                <a 
                  href={item.sourceUrl}
                  className="inline-flex items-center gap-3 text-[10px] font-sans tracking-[0.3em] text-ink/40 hover:text-ink/80 uppercase transition-colors"
                >
                  <span className="w-12 h-[1px] bg-ink/20"></span>
                  Read Original
                  <span className="w-12 h-[1px] bg-ink/20"></span>
                </a>
              </div>
            )}
          </section>

        </div>
      </main>
    </motion.div>
  );
};

export default ContentRoom;
