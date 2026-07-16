import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Coins, AlertCircle } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onChange: (platforms: string[]) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatforms, onChange }) => {
  const { user } = useAuth();

  const platforms = [
    { id: 'indeed', name: 'Indeed', cost: 3, desc: 'Best results. Comprehensive job index with highest coverage.' },
    { id: 'simplyhired', name: 'SimplyHired', cost: 2, desc: 'Verified job board. Great for general job search.' },
    { id: 'dailyremote', name: 'DailyRemote', cost: 1, desc: 'Remote work community. Clean curated listings.' }
  ];

  const handleToggle = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      onChange(selectedPlatforms.filter((p) => p !== id));
    } else {
      onChange([...selectedPlatforms, id]);
    }
  };

  const totalCost = platforms
    .filter((p) => selectedPlatforms.includes(p.id))
    .reduce((sum, p) => sum + p.cost, 0);

  const isInsufficient = user ? user.credits < totalCost : false;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-neutral-450 uppercase tracking-widest">Select Search Targets</h4>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Coins className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px] uppercase tracking-wider">Total Cost: <strong className="text-white font-bold">{totalCost} Credits</strong></span>
          </div>
        </div>
        <p className="text-[10px] text-neutral-555">You can select multiple platforms at once to scan them simultaneously.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {platforms.map((p) => {
          const isSelected = selectedPlatforms.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => handleToggle(p.id)}
              className={`p-4 rounded border cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[110px] ${isSelected
                  ? 'border-white bg-white/[0.03]'
                  : 'border-white/5 bg-white/[0.005] hover:border-white/15 hover:bg-white/[0.015]'
                }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{p.name}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/10 text-[9px] font-mono font-bold text-neutral-400">
                    {p.cost} Cr
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {isInsufficient && (
        <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">
            Insufficient credits. Need {totalCost} credits, but you only have {user?.credits}. Please add credits or deselect platforms.
          </span>
        </div>
      )}
      {selectedPlatforms.length > 1 && (
        <p className="text-[10px] text-neutral-500 italic mt-2">
          * Selecting {selectedPlatforms.length} platforms will consolidate all results, but will increase the search duration by few minutes.
        </p>
      )}
    </div>
  );
};

export default PlatformSelector;
