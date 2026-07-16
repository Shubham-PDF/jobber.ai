import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Info } from 'lucide-react';

interface SearchProgressProps {
  currentStep: number; // 0: Idle/Start, 1: Parser, 2: Searcher, 3: Matcher, 4: Done
  selectedPlatforms?: string[];
}

export const SearchProgress: React.FC<SearchProgressProps> = ({ currentStep, selectedPlatforms = [] }) => {
  const steps = [
    { title: 'Parse Resume', desc: 'Extracting text and identifying structure' },
    { title: 'Analyze Profile', desc: 'Using AI to identify skills and target roles' },
    { title: 'Search Platforms', desc: `Querying ${selectedPlatforms.join(', ') || 'selected boards'}` },
    { title: 'Match & Score', desc: 'Evaluating compatibility and sorting results' }
  ];

  const sarcasticQuotes = [
    "You've waited an entire semester to hear back from recruiters. You can wait 10 seconds more.",
    "Analyzing skills... We promise not to tell anyone you listed Microsoft Word.",
    "Searching platforms... Digging deeper than your search history.",
    "Matching jobs... Looking for opportunities where '5+ years experience' is just a suggestion.",
    "Calculating compatibility... Finding jobs that pay more than your coffee addiction cost.",
    "Parsing resume... Hopefully your work history is better than your Tinder bio.",
    "Bypassing ATS filters... Making sure you don't get auto-rejected by a robot.",
    "Doing all the hard work... while you sit back and contemplate your career choices.",
    "Adjusting scores... Converting 'excellent communication' to 'can write Slack messages'.",
    "Syncing... Our engine is currently running faster than you run away from responsibility.",
    "Searching... Finding companies that offer 'competitive salary' (which usually means competitive with minimum wage).",
    "Filtering... Removing jobs that require a PhD for an unpaid internship.",
    "Syncing with servers... Please do not close this tab, unless you want to start over (you don't).",
    "Optimizing match matrix... Trying to find a role that doesn't require a 4-hour take-home test.",
    "Almost done... AI is finalizing your matches. Take a deep breath."
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Randomize quote rotation
  useEffect(() => {
    // Initial random index
    setQuoteIndex(Math.floor(Math.random() * sarcasticQuotes.length));
    
    const interval = setInterval(() => {
      setQuoteIndex((prev) => {
        let nextIndex = prev;
        while (nextIndex === prev) {
          nextIndex = Math.floor(Math.random() * sarcasticQuotes.length);
        }
        return nextIndex;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Smooth progress bar calculation
  // Step 0: ticks to 25%
  // Step 1: ticks to 50%
  // Step 2: ticks to 78% (stops between 75-80%)
  // Step 3: ticks to 95%
  // Step 4: ticks to 100%
  useEffect(() => {
    if (currentStep === 4) {
      setProgress(100);
      return;
    }
    const targets = [25, 50, 78, 95];
    const target = targets[currentStep] || 0;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < target) return prev + 1;
        // Keep progress at target value for steps 0, 1, 2
        return prev;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <div className="w-full max-w-lg mx-auto p-8 glass-card rounded-xl text-white relative overflow-hidden">
      {/* Sleek top loading indicator */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-neutral-500/20 to-transparent shimmer-anim" />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-450">
          Jobber Console
        </h3>
        <span className="font-mono text-xs font-bold text-white tracking-widest">
          {progress}%
        </span>
      </div>

      {/* Progress Bar (Tesla Style) */}
      <div className="w-full h-[1.5px] bg-neutral-900 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-6 relative mb-10">
        {/* Connector line */}
        <div className="absolute top-6 bottom-6 left-5 w-[1px] bg-neutral-900 z-0" />

        {steps.map((step, idx) => {
          const isCompleted = currentStep > idx;
          const isActive = currentStep === idx;
          
          return (
            <div key={idx} className="flex gap-4 items-start relative z-10">
              {/* Indicator Dot */}
              <div className="flex items-center justify-center">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center border border-white"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : isActive ? (
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center border border-white animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-950 text-neutral-600 flex items-center justify-center border border-neutral-850">
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col pt-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : isCompleted ? 'text-neutral-400' : 'text-neutral-650'}`}>
                  {step.title}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Random Sarcastic Quotes Carousel */}
      <div className="pt-6 border-t border-white/5 flex gap-3 items-start min-h-[70px]">
        <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
        <div className="flex-grow text-left">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Status Notes</p>
          <div className="h-10 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-xs text-neutral-450 leading-relaxed absolute"
              >
                {sarcasticQuotes[quoteIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProgress;
