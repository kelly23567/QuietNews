import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NewsItem } from '../types';

interface SpaceGridProps {
  items: NewsItem[];
  onSelect: (item: NewsItem) => void;
}

const SpaceGrid: React.FC<SpaceGridProps> = ({ items, onSelect }) => {
  // Track which item is being peeled off
  const [peelingId, setPeelingId] = useState<number | null>(null);

  // Pre-calculate random styles to ensure consistency during renders
  const itemStyles = useMemo(() => {
    const colors = [
      'bg-morandi-sage/80',
      'bg-morandi-rose/80',
      'bg-morandi-taupe/80',
      'bg-morandi-fog/80',
      'bg-morandi-clay/80',
      'bg-morandi-sand/80',
    ];

    return items.map((_, i) => {
      // Instead of blobs, we use sticky note / polaroid shapes
      const rotation = (Math.random() - 0.5) * 10; // -5 to 5 degrees
      
      // Random position offsets for "scattered on desk" look
      const translateX = (Math.random() - 0.5) * 40; 
      const translateY = (Math.random() - 0.5) * 40; 

      const size = 200 + Math.random() * 60; 

      return {
        color: colors[i % colors.length],
        rotation,
        width: `${size}px`,
        height: `${size}px`, // Make them square-ish for sticky notes
        translateX,
        translateY,
        tapeRotation: (Math.random() - 0.5) * 20, // Tape rotation
      };
    });
  }, [items]);

  const handleItemClick = (item: NewsItem) => {
    setPeelingId(item.id);
    // Delay the actual navigation slightly to allow the animation to play
    setTimeout(() => {
      onSelect(item);
    }, 400); // 0.4s delay matches the animation duration
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-paper-realistic overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-2 bg-morandi-sage/30"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-morandi-rose/30"></div>

      <div className="absolute top-12 left-0 right-0 text-center z-10">
        <div className="inline-block relative px-8 py-3 bg-white shadow-sm rotate-[-1deg]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-morandi-taupe/40 rotate-1 mask-image-tape backdrop-blur-sm"></div>
          <div className="text-sm text-gray-500 font-serif tracking-[0.3em] uppercase">
            Quiet News Collection
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-wrap justify-center items-center content-center gap-16 md:gap-24 py-20 min-h-[80vh]">
        {items.map((item, index) => {
          const style = itemStyles[index];
          const isPeeling = peelingId === item.id;

          return (
            <motion.div
              key={item.id}
              className="relative group cursor-pointer"
              style={{
                width: style.width,
                height: style.height,
                transformOrigin: 'top center', // Pivot point for the peel
              }}
              onClick={() => handleItemClick(item)}
              initial={{ opacity: 0, scale: 0.8, rotate: style.rotation + 10 }}
              animate={isPeeling ? {
                // "Peel off" animation:
                // 1. Scale up slightly
                // 2. Rotate to straighten or tilt
                // 3. Lift up (Y axis translation and shadow)
                // 4. Skew to simulate bending paper
                scale: 1.1,
                rotate: -5, 
                y: -50,
                x: -20,
                opacity: 0, // Fade out at the end
                filter: "drop-shadow(20px 20px 15px rgba(0,0,0,0.2))", // Deep shadow when lifted
              } : { 
                opacity: 1, 
                scale: 1,
                rotate: style.rotation,
                x: style.translateX,
                y: style.translateY,
                filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))",
              }}
              transition={{ 
                duration: isPeeling ? 0.4 : 1.2, 
                delay: isPeeling ? 0 : index * 0.1, 
                type: isPeeling ? "tween" : "spring",
                ease: isPeeling ? "backIn" : "spring",
                stiffness: 50
              }}
              whileHover={!isPeeling ? { 
                scale: 1.05, 
                rotate: 0,
                zIndex: 20,
                filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.15))",
                transition: { duration: 0.3 }
              } : {}}
            >
              {/* Sticky Note Body */}
              <div className={`absolute inset-0 ${style.color} transition-colors duration-300 flex items-center justify-center p-6 text-center backdrop-blur-sm`}>
                 {/* Tape on top - fades out when peeling */}
                 <motion.div 
                   className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 mask-image-tape"
                   style={{ transform: `translateX(-50%) rotate(${style.tapeRotation}deg)` }}
                   animate={isPeeling ? { opacity: 0 } : { opacity: 1 }}
                 ></motion.div>

                 <p className="font-hand text-2xl text-white drop-shadow-sm leading-tight select-none">
                   {item.statement}
                 </p>
                 
                 {/* Fold corner effect (static for now, enhances the paper look) */}
                 <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/10" 
                      style={{ 
                        clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                        borderBottomRightRadius: '2px'
                      }}>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SpaceGrid;