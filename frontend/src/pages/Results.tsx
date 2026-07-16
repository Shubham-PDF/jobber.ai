import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JobTable } from '../components/JobTable';
import { ArrowLeft, Download, FileSpreadsheet, CheckCircle, Award, Briefcase } from 'lucide-react';
import { authenticatedDownload } from '../lib/api';

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  // Fallback if accessed directly without state
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4">No results found</h2>
        <Link to="/dashboard" className="px-6 py-2.5 rounded bg-white text-black text-xs font-bold uppercase tracking-wider transition-colors">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const { search_id, platforms_used, credits_used } = results;
  const profile = results.profile || results.extracted_profile;
  const matches = results.matches || results.matched_jobs;

  return (
    <div className="bg-zinc-950 min-h-screen text-neutral-250 py-12 relative tesla-grid">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Back and Download actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => authenticatedDownload(`/jobs/download/csv/${search_id}/`, `jobs_${search_id}.csv`)}
              className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-xs font-semibold text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={() => authenticatedDownload(`/jobs/download/excel/${search_id}/`, `jobs_${search_id}.xlsx`)}
              className="px-4 py-2 rounded bg-white hover:bg-neutral-250 text-xs font-semibold text-black transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel
            </button>
          </div>
        </div>

        {/* Results layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main results table (Left) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="text-left">
              <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2 m-0">
                <CheckCircle className="w-5 h-5 text-neutral-400" />
                {matches?.length || 0} Match{matches?.length === 1 ? '' : 'es'} Located
              </h2>
              <p className="text-xs text-neutral-550 mt-1 uppercase tracking-wider">Sorted by compatibility rating</p>
            </div>

            <JobTable jobs={matches || []} />
          </div>

          {/* Profile Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded border border-white/5 bg-white/[0.01] space-y-6"
            >
              <div className="text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Parsed Profile</h3>
                <p className="text-[10px] text-neutral-500 mt-1">Extracted from your resume</p>
              </div>

              <div className="space-y-4 text-xs text-left">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                  <Award className="w-4 h-4 text-neutral-500" />
                  <div>
                    <span className="text-neutral-500">Name:</span>
                    <p className="text-white font-bold mt-0.5">{profile?.name || 'Candidate'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                  <Briefcase className="w-4 h-4 text-neutral-500" />
                  <div>
                    <span className="text-neutral-500">Calculated Experience:</span>
                    <p className="text-white font-bold mt-0.5 capitalize">
                      {profile?.total_years_of_experience ?? 0} Years ({profile?.experience_level || 'fresher'})
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-neutral-500">Extracted Skills:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profile?.skills?.map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-350 text-[10px] uppercase font-mono tracking-wider font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scrape stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded border border-white/5 bg-white/[0.005] space-y-4 text-xs text-left"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Search Metadata</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-neutral-500">Sources Searched:</span>
                  <span className="font-semibold text-white capitalize">{platforms_used?.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-neutral-500">Credits Expended:</span>
                  <span className="font-semibold text-white">{credits_used} Credits</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;
