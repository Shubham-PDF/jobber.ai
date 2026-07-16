import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  TrendingUp,
  Cpu,
  UploadCloud,
  FileText
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Landing: React.FC = () => {
  const { user } = useAuth();

  // Smooth scroll to element on mount if hash present
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  return (
    <div className="bg-zinc-950 text-neutral-200 min-h-screen overflow-hidden relative tesla-grid">
      {/* Decorative gradient glow spots */}
      <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[150px] pointer-events-none" />

      {/* 1. Intro / About Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[10px] uppercase tracking-widest font-semibold"
        >
          <Sparkles className="w-3 h-3 text-neutral-200" />
          <span>A New Era of Job Hunting</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mt-4 text-xs uppercase tracking-wider text-neutral-500 font-medium max-w-lg mx-auto"
        >
          Designed for students, career transitioners, and high-growth engineers. We believe in high-fidelity career matching over spamming job boards.
        </motion.p>
      </section>

      {/* 2. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.08] m-0"
            >
              Stop searching.<br />
              Start <span className="text-neutral-400 italic font-light">matching</span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Upload your resume and select your targets. jobber.ai searches major platforms and scores matches based on your actual work history and skills.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2"
            >
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="w-full sm:w-auto px-8 py-3.5 rounded bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-white/5"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#why-us"
                className="w-full sm:w-auto px-8 py-3.5 rounded border border-white/10 hover:bg-white/5 hover:border-white/20 text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center"
              >
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Interactive UI Mockup (Apple/Tesla Style) */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl p-6 relative overflow-hidden shimmer-anim"
            >
              {/* Card Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">jobber_dashboard.exe</span>
              </div>

              {/* Mock Resume Uploaded */}
              <div className="space-y-4">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-white">
                      <FileSpreadsheet className="w-4 h-4 text-neutral-300" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-white leading-none">resume_developer.pdf</p>
                      <p className="text-[9px] text-neutral-500 mt-1">Parsed: 14 Technical Skills extracted</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                    Ready
                  </span>
                </div>

                {/* Platforms Searched */}
                <div className="space-y-2 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Configured Search Targets</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 border border-white/10 bg-white/[0.04] rounded text-center">
                      <span className="text-[10px] text-white font-semibold">Indeed</span>
                      <p className="text-[8px] text-neutral-500 mt-0.5">3 Credits</p>
                    </div>
                    <div className="p-2 border border-white/5 bg-white/[0.01] rounded text-center opacity-60">
                      <span className="text-[10px] text-neutral-300 font-semibold">SimplyHired</span>
                      <p className="text-[8px] text-neutral-500 mt-0.5">2 Credits</p>
                    </div>
                    <div className="p-2 border border-white/5 bg-white/[0.01] rounded text-center opacity-60">
                      <span className="text-[10px] text-neutral-300 font-semibold">DailyRemote</span>
                      <p className="text-[8px] text-neutral-500 mt-0.5">1 Credit</p>
                    </div>
                  </div>
                </div>

                {/* Mock Job matches list */}
                <div className="space-y-2 pt-2 border-t border-white/5 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Configured matches</span>
                    <span className="text-[9px] text-neutral-400">Showing top compatibility</span>
                  </div>

                  <div className="space-y-2">
                    {/* Job 1 */}
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded flex justify-between items-center hover:border-white/10 transition-colors">
                      <div>
                        <p className="text-[10px] font-bold text-white leading-none">Senior React Engineer</p>
                        <p className="text-[9px] text-neutral-500 mt-0.5">Tesla Inc. • Remote</p>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-450 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
                        9/10 Match
                      </span>
                    </div>
                    {/* Job 2 */}
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded flex justify-between items-center opacity-85">
                      <div>
                        <p className="text-[10px] font-bold text-white leading-none">Python Backend Developer</p>
                        <p className="text-[9px] text-neutral-500 mt-0.5">Stripe • San Francisco</p>
                      </div>
                      <span className="text-[9px] font-bold text-amber-450 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">
                        7/10 Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Why Us ("Why To") Section */}
      <section id="why-us" className="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Why use <span className="font-bold">jobber.ai</span>
          </h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">Engineered to respect your focus and time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-4 text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">High Efficiency</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We sync with Indeed, SimplyHired, and DailyRemote instantly. Spend less time copying details and more time preparing for interviews.
            </p>
          </div>

          <div className="p-6 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-4 text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Calculated Relevance</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We analyze the actual content of your experience dates and skills, matching them against job specifications rather than matching on simple keywords.
            </p>
          </div>

          <div className="p-6 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-4 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Privacy & Simplicity</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No tracking, no cookies, no spam emails. Your resume is parsed strictly to find jobs and discarded afterward. Simple, clean, and fast.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How To Use Section (Revamped with visuals modeled after hero section) */}
      <section id="how-to-use" className="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            How to <span className="font-bold">Use</span>
          </h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">Get matched jobs in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Step 1 */}
          <div className="p-6 rounded border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6 text-left">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono">STEP 01</span>
                <span className="w-2 h-2 rounded-full bg-white/40" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">1. Upload Your Resume</h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Drag and drop your PDF or Word resume. Our engine extracts technical skill vectors and calculates exact employment timelines automatically.
              </p>
            </div>
            
            {/* Visual element */}
            <div className="p-3 bg-white/[0.02] border border-dashed border-white/10 rounded flex flex-col items-center justify-center py-6 text-neutral-500 text-[10px]">
              <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
              <p className="font-bold text-white uppercase tracking-wider">resume_developer.pdf</p>
              <span className="text-[8px] text-emerald-450 mt-1 uppercase tracking-wider">Ready to scan</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6 text-left">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono">STEP 02</span>
                <span className="w-2 h-2 rounded-full bg-white/40" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">2. Select Platforms</h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Choose the platforms to scrape (Indeed, SimplyHired, or DailyRemote). Selecting multiple sources pools all matching results dynamically.
              </p>
            </div>
            
            {/* Visual element */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded space-y-2 text-[9px]">
              <div className="flex justify-between items-center bg-white/[0.03] p-1.5 rounded border border-white/5">
                <span className="text-white font-bold font-mono">Indeed</span>
                <span className="text-neutral-400">3 Cr (Selected)</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.01] p-1.5 rounded border border-white/5 opacity-50">
                <span className="text-neutral-300 font-mono">DailyRemote</span>
                <span className="text-neutral-550">1 Cr</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6 text-left">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono">STEP 03</span>
                <span className="w-2 h-2 rounded-full bg-white/40" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">3. Download Matches</h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Our algorithm processes listings in batches. Please allow up to 30 seconds extra to parse and match the most fresh results, then export as Excel or CSV.
              </p>
            </div>
            
            {/* Visual element */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span className="text-white font-bold leading-none">Senior Python Dev</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold">
                9.2/10 Match
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Designed for <span className="font-bold">Precision</span>
          </h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">Everything you need to automate target matching</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-left">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Resume Parsing</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Upload PDF or DOCX. We calculate the exact duration of each job using date math to get an accurate representation of your experience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Multi-Platform Crawler</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Scrapes jobs across major platforms using automated search queries. Limits queries to the top 3 matches to optimize credit efficiency.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Compatibility Scoring</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  We assign a compatibility score from 1-10 to every single crawled job, sorted from highest to lowest. No arbitrary filters.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-8 border border-white/5 flex items-center justify-center bg-white/[0.005]">
            <div className="grid grid-cols-2 gap-6 w-full text-center">
              <div className="p-4 border border-white/5 bg-white/[0.01] rounded">
                <span className="text-2xl font-light text-white font-mono">100%</span>
                <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">Deduplicated</p>
              </div>
              <div className="p-4 border border-white/5 bg-white/[0.01] rounded">
                <span className="text-2xl font-light text-white font-mono">Multi-Agent</span>
                <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">Search Crawlers</p>
              </div>
              <div className="p-4 border border-white/5 bg-white/[0.01] rounded">
                <span className="text-2xl font-light text-white font-mono">3</span>
                <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">Platforms</p>
              </div>
              <div className="p-4 border border-white/5 bg-white/[0.01] rounded">
                <span className="text-2xl font-light text-white font-mono">1 - 10</span>
                <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">Score Matrix</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing & Credits Section (Badge visibility fixed by changing translate) */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Transparent <span className="font-bold">Credits</span>
          </h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">Pay exactly for what you scan. No subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Credit Information Cards */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 border border-white/5 bg-white/[0.01] rounded flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Indeed Search</span>
                <p className="text-white font-semibold text-sm mt-1">3 Credits / search</p>
              </div>
              <p className="text-[10px] text-neutral-500 mt-4 leading-relaxed">Queries the largest job directory online for maximum placement results.</p>
            </div>
            
            <div className="p-5 border border-white/5 bg-white/[0.01] rounded flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">SimplyHired Search</span>
                <p className="text-white font-semibold text-sm mt-1">2 Credits / search</p>
              </div>
              <p className="text-[10px] text-neutral-500 mt-4 leading-relaxed">Accesses a highly clean, verified registry of corporate job posts.</p>
            </div>

            <div className="p-5 border border-white/5 bg-white/[0.01] rounded flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">DailyRemote Search</span>
                <p className="text-white font-semibold text-sm mt-1">1 Credit / search</p>
              </div>
              <p className="text-[10px] text-neutral-500 mt-4 leading-relaxed">Direct connection to curated, high-quality distributed roles.</p>
            </div>

            <div className="p-5 border border-white/5 bg-white/[0.01] rounded flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-550 font-bold">Sign-Up Bonus</span>
                <p className="text-white font-semibold text-sm mt-1">2 Free Credits</p>
              </div>
              <p className="text-[10px] text-neutral-500 mt-4 leading-relaxed">Granted automatically upon account creation to test scanners.</p>
            </div>
          </div>

          {/* Core pricing checkout card (Badge visibility fixed by using top-4 right-4 inside padding) */}
          <div className="md:col-span-5 rounded border border-white/10 bg-zinc-900/30 p-6 flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white text-black text-[9px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase">
              Buy Credits
            </div>

            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Standard Refill</h3>
              <div className="flex items-baseline gap-1.5 py-4 border-b border-white/5">
                <span className="text-4xl font-light text-white font-mono">₹100</span>
                <span className="text-neutral-500 text-[10px] uppercase tracking-widest">/ 10 credits</span>
              </div>

              <div className="space-y-3 py-4 text-[10px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>Manual transaction claim verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>Supports all UPI payment clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>Credits credited within 24 hours</span>
                </div>
              </div>
            </div>

            <Link
              to={user ? '/dashboard' : '/signup'}
              className="block text-center w-full py-3 rounded bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 mt-4"
            >
              Start Matching
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Contact Details Section (Simplified to a mailto button centered layout) */}
      <section id="contact" className="max-w-xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 text-center">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Have a <span className="font-bold">Question?</span>
          </h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">Need assistance with your credit purchases or scans?</p>
        </div>

        <div className="p-8 rounded border border-white/5 bg-white/[0.01] space-y-6">
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Our support desk is available to assist you. Submit inquiries regarding payment verifications or credit refills directly to our email.
          </p>
          <a
            href="mailto:trickyshubham@gmail.com"
            className="inline-flex justify-center items-center px-8 py-3 rounded bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95"
          >
            Contact Us
          </a>
          <p className="text-[10px] text-neutral-600 font-mono">support@jobber.ai • trickyshubham@gmail.com</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
