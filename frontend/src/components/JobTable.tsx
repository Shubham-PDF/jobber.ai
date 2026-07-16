import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  score: number;
  reason: string;
  source: string;
  url: string;
}

interface JobTableProps {
  jobs: Job[];
}

export const JobTable: React.FC<JobTableProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="p-12 text-center rounded border border-white/5 bg-white/[0.005] text-neutral-500 text-xs">
        No matching job openings found. Try selecting other platforms.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-white/5 bg-black/20">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-white/[0.02] border-b border-white/5 text-neutral-450 font-bold uppercase tracking-wider">
            <th className="py-4 px-5 text-center w-12">Rank</th>
            <th className="py-4 px-5">Role Details</th>
            <th className="py-4 px-5 text-center">Score</th>
            <th className="py-4 px-5">Match Analysis</th>
            <th className="py-4 px-5 text-center">Source</th>
            <th className="py-4 px-5 text-center">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {jobs.map((job, idx) => (
            <tr key={idx} className="hover:bg-white/[0.015] transition-colors duration-200">
              {/* Rank */}
              <td className="py-4 px-5 text-center font-mono font-bold text-neutral-500">{idx + 1}</td>
              
              {/* Job Details */}
              <td className="py-4 px-5 space-y-1">
                <div className="font-bold text-white text-[13px]">{job.title}</div>
                <div className="text-[10px] text-neutral-500 font-medium space-x-1">
                  <span className="font-bold text-neutral-300">{job.company}</span>
                  {job.location && <span>• {job.location}</span>}
                  {job.salary && <span>• {job.salary}</span>}
                </div>
              </td>
              
              {/* Match Score */}
              <td className="py-4 px-5 text-center">
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold ${
                  job.score >= 8
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : job.score >= 5
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      : 'bg-zinc-500/10 border border-zinc-500/20 text-zinc-400'
                }`}>
                  <Star className={`w-3 h-3 ${
                    job.score >= 8 ? 'fill-emerald-400' : job.score >= 5 ? 'fill-amber-400' : 'fill-zinc-400'
                  }`} />
                  {job.score}/10
                </div>
              </td>
              
              {/* Match Reason */}
              <td className="py-4 px-5 text-neutral-400 leading-relaxed max-w-sm">
                {job.reason}
              </td>
              
              {/* Source */}
              <td className="py-4 px-5 text-center">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded">
                  {job.source}
                </span>
              </td>
              
              {/* Apply link */}
              <td className="py-4 px-5 text-center">
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white hover:text-neutral-350 transition-colors"
                  >
                    Open
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-neutral-600 font-mono">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
