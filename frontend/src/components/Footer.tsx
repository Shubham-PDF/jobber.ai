import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-zinc-950/80 py-12 text-xs text-neutral-500 mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-semibold text-neutral-300 tracking-wider uppercase">JOBBER.AI</p>
          <p className="text-[10px] text-neutral-600">The Modern Job Placement Agent.</p>
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-wider text-neutral-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
        <div className="text-center md:text-right text-[10px] text-neutral-600 space-y-1">
          <p>© {new Date().getFullYear()} jobber.ai. All rights reserved.</p>
          <p>Powered by advanced web automation and AI scoring.</p>
        </div>
      </div>
    </footer>
  );
};
