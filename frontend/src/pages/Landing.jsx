import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Film, Compass, FilePlus, ArrowRight, ShieldCheck, Cpu, Zap, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing({ onOpenBriefBuilder }) {
  const { switchRole } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/10 to-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-lg">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Content Creator & Generative Film Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Connect with World-Class <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Generative AI Filmmakers & Artists
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover verified AI filmmakers, animators, and prompt visualizers. Post briefs with Groq AI assistance, inspect transparent "How it was made" pipelines, and manage commercial buyouts effortlessly.
          </p>

          {/* Dual Entry Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => { switchRole('brand'); onOpenBriefBuilder(); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-cyan-500/25 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <FilePlus className="w-5 h-5 stroke-[2.5]" />
              <span>I'm a Brand: Post Brief & Hire</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/creators"
              onClick={() => switchRole('creator')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border border-slate-700 hover:border-slate-500 text-slate-100 font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>I'm a Creator: Browse Briefs</span>
            </Link>
          </div>

          {/* Dynamic Platform Stats Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-cyan-400 font-mono">12+</span>
              <span className="text-[11px] text-slate-400 block font-medium">Verified Creators</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-purple-400 font-mono">100%</span>
              <span className="text-[11px] text-slate-400 block font-medium">Pipeline Transparency</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-emerald-400 font-mono">Groq LLM</span>
              <span className="text-[11px] text-slate-400 block font-medium">AI Brief Assistant</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-sky-400 font-mono">Full Buyout</span>
              <span className="text-[11px] text-slate-400 block font-medium">Commercial Rights</span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured AI Stack & Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Platform Core Architecture</h2>
          <h3 className="text-2xl font-bold text-slate-100">Engineered for Generative Media Production</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-100">Groq-Powered Brief Assistant</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transform rough brand prompts into structured creative briefs with recommended AI tools, budget guidance, deliverables, and commercial considerations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-100">"How it was made" Workflows</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every portfolio item features verified step-by-step pipeline timelines, seed prompts, model specifications, aspect ratios, and resolution details.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-100">Smart AI Match Scoring</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Find creators automatically scored against campaign requirements with transparent rationale explaining tool overlap, skill match, and budget fit.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Visual Portfolios Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Featured Generative Artwork</h2>
            <p className="text-xs text-slate-400">Inspected and verified from our creator community</p>
          </div>
          <Link to="/creators" className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            Explore All 12 Creators <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Neon Horizon 2099",
              creator: "Elena Vance",
              specialization: "AI Filmmaking & VFX",
              media: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=450&fit=crop",
              tools: ["Midjourney v6", "Runway Gen-3", "Topaz AI"],
              aspect: "16:9"
            },
            {
              title: "Aether Silk - Luxury Reveal",
              creator: "Jaxson Thorne",
              specialization: "Fashion & Product Ads",
              media: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=450&fit=crop",
              tools: ["Flux.1", "Luma Dream Machine"],
              aspect: "16:9"
            },
            {
              title: "Pulse Runner 9:16 Social",
              creator: "Sophia Martinez",
              specialization: "Social Ads & Reels",
              media: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=450&fit=crop",
              tools: ["Flux.1", "After Effects", "Luma"],
              aspect: "9:16"
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-3xl overflow-hidden border border-slate-800 group">
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={item.media}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono text-cyan-300 border border-slate-700">
                  {item.aspect}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-100 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-400">By {item.creator} • {item.specialization}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tools.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-cyan-300 font-mono border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
