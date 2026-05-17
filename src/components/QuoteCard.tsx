import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { cn } from '../lib/utils';

export const QuoteCard: React.FC = () => {
  const { moodConfig } = useMood();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Pick a random quote when mood changes
    const quotes = moodConfig.quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, [moodConfig]);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 border transition-all duration-500",
      moodConfig.bgColor,
      moodConfig.accentColor
    )}>
      <div className={cn("absolute top-4 right-4 opacity-20", moodConfig.textColor)}>
        <Quote size={48} />
      </div>
      
      <div className="relative z-10 min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn("text-2xl md:text-3xl font-outfit font-bold text-center max-w-3xl", moodConfig.textColor)}
          >
            "{quote}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};
