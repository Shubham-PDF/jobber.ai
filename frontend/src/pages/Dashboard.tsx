import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import api, { authenticatedDownload } from '../lib/api';
import { ResumeUpload } from '../components/ResumeUpload';
import { PlatformSelector } from '../components/PlatformSelector';
import { SearchProgress } from '../components/SearchProgress';
import { BuyCreditsModal } from '../components/BuyCreditsModal';
import { Coins, Plus, History, Calendar, ExternalLink, Download, FileText } from 'lucide-react';

interface HistoryItem {
  id: string;
  resume_filename: string;
  platforms_used: string[];
  credits_used: number;
  jobs_found: number;
  created_at: string;
}

export const Dashboard: React.FC = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [resume, setResume] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0); // Stepper progress
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch search history
  const fetchHistory = async () => {
    try {
      const res = await api.get('/jobs/history/');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const calculateCost = () => {
    let cost = 0;
    selectedPlatforms.forEach((p) => {
      if (p === 'simplyhired') cost += 2;
      if (p === 'dailyremote') cost += 1;
      if (p === 'indeed') cost += 3;
    });
    return cost;
  };

  const handleSearch = async () => {
    if (!resume || selectedPlatforms.length === 0) return;
    setSubmitError(null);
    setSearching(true);
    setSearchStep(0);

    // Stepper interval simulator for UX (longer wait for more platforms)
    // Stops at step 2 ("Scrape Platforms", the second last option) while waiting for API
    const stepDuration = 1800 + (selectedPlatforms.length * 1500);
    const interval = setInterval(() => {
      setSearchStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, stepDuration);

    const formData = new FormData();
    formData.append('resume', resume);
    selectedPlatforms.forEach((p) => {
      formData.append('platforms', p);
    });

    try {
      const res = await api.post('/jobs/search/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(interval);
      
      // Move to step 3 ("Match & Score") and pause for user to witness scoring phase
      setSearchStep(3);
      await new Promise((resolve) => setTimeout(resolve, 1300));
      
      // Move to step 4 ("Done")
      setSearchStep(4);
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      await refreshUserData();
      
      // Redirect to results page
      navigate(`/results/${res.data.search_id}`, { state: { results: res.data } });
    } catch (err: any) {
      clearInterval(interval);
      setSearching(false);
      setSubmitError(err.response?.data?.error || 'An error occurred during matching. Please try again.');
    }
  };

  const cost = calculateCost();
  const hasEnoughCredits = user ? user.credits >= cost : false;

  return (
    <div className="bg-zinc-950 min-h-screen text-neutral-200 py-12 relative tesla-grid">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Title and Credits bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 pb-6 border-b border-white/5">
          <div className="text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-white m-0">Workspace</h1>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Configure scanner parameters & analyze history</p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-lg shrink-0 self-start sm:self-center">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-neutral-300" />
              <div className="text-left">
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest leading-none">Balance</p>
                <p className="text-xs font-bold text-white mt-0.5">{user?.credits} Credits</p>
              </div>
            </div>
            <button
              onClick={() => setQrModalOpen(true)}
              className="px-3 py-1.5 rounded bg-white hover:bg-neutral-200 text-black transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {searching ? (
          <div className="py-12">
            <SearchProgress currentStep={searchStep} selectedPlatforms={selectedPlatforms} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* New Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 p-8 glass-card rounded-xl space-y-8"
            >
              <div className="space-y-4 text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">1. Upload Resume</h3>
                <ResumeUpload onFileSelect={setResume} selectedFile={resume} />
              </div>

              <div className="space-y-4 border-t border-white/5 pt-8 text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">2. Select Platforms</h3>
                <PlatformSelector selectedPlatforms={selectedPlatforms} onChange={setSelectedPlatforms} />
              </div>

              {submitError && (
                <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-450 text-xs text-left font-medium">
                  {submitError}
                </div>
              )}

              <div className="border-t border-white/5 pt-6 flex justify-end">
                <button
                  onClick={handleSearch}
                  disabled={!resume || selectedPlatforms.length === 0 || !hasEnoughCredits}
                  className="w-full px-6 py-3 rounded bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-white/5 active:scale-95"
                >
                  Match Jobs (Cost: {cost} Credits)
                </button>
              </div>
            </motion.div>

            {/* History Section */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <History className="w-4 h-4 text-neutral-500" />
                Recent Scrapes
              </h3>

              {history.length === 0 ? (
                <div className="p-8 text-center rounded border border-white/5 bg-white/[0.005] text-neutral-500 text-xs leading-relaxed">
                  No match queries executed yet. Complete a new search to see results.
                </div>
              ) : (
                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded border border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.02] transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">{item.resume_filename}</h4>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 items-center text-[10px] text-neutral-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{item.credits_used} Cr</span>
                            <span>•</span>
                            <span className="capitalize text-neutral-300">{item.platforms_used.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {item.jobs_found} Matches
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => authenticatedDownload(`/jobs/download/csv/${item.id}/`, `jobs_${item.id}.csv`)}
                            className="p-2 rounded border border-white/5 hover:border-white/15 bg-zinc-950 text-neutral-400 hover:text-white transition-colors"
                            title="Download CSV"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={async () => {
                              try {
                                const res = await api.get(`/jobs/history/`);
                                const fullItem = res.data.find((h: any) => h.id === item.id);
                                navigate(`/results/${item.id}`, { state: { results: { ...fullItem, search_id: item.id } } });
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 text-neutral-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                          >
                            Results
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <BuyCreditsModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
      </div>
    </div>
  );
};

export default Dashboard;
