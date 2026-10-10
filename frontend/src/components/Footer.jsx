import React from 'react';
import { Film, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center">
              <Film className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-bold text-slate-100 tracking-wider">CREOVATE</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The elite generative AI marketplace connecting brands with world-class AI filmmakers, animators, and prompt artists.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">AI Stack Supported</h4>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
            {['Sora', 'Runway Gen-3', 'Flux.1', 'Midjourney v6', 'Luma Dream Machine', 'Kling AI', 'ComfyUI', 'Topaz AI'].map((tool) => (
              <span key={tool} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform Features</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Groq AI Brief Generator</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verifiable Pipeline Timelines</li>
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400" /> Smart Creator Match Scoring</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Backend Status</h4>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">FastAPI API:</span>
              <span className="text-emerald-400 font-mono font-medium">● Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">LLM Provider:</span>
              <span className="text-cyan-400 font-mono font-medium">Groq SDK</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database:</span>
              <span className="text-indigo-400 font-mono font-medium">Supabase PG</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 CREOVATE Platform. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy & AI Licensing</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Commercial Use</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Verification Integrity</span>
        </div>
      </div>
    </footer>
  );
}
