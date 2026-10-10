import React, { useState } from 'react';
import { X, Copy, Check, Cpu, Layers, Clock, Monitor, Sparkles } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function WorkflowModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopyPrompt = () => {
    if (item.prompt_summary) {
      navigator.clipboard.writeText(item.prompt_summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400">How it was made • AI Generation Pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <VerificationBadge status={item.verification_status} />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Media & Specs Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video lg:aspect-auto lg:h-64 shadow-lg group">
              <img
                src={item.media_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200">
                <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 font-mono">
                  {item.aspect_ratio || '16:9'}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 font-mono">
                  {item.resolution || '4K UHD'}
                </span>
              </div>
            </div>

            {/* Technical Metadata Box */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Technical Specs</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resolution: <strong className="text-slate-200">{item.resolution || '4K'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Duration: <strong className="text-slate-200">{item.duration || '0:30'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 col-span-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aspect Ratio: <strong className="text-slate-200">{item.aspect_ratio || '16:9'}</strong></span>
                </div>
              </div>

              {/* Tools list */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">AI Tools & Models Used:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.tools_used?.map((tool) => (
                    <span key={tool} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Workflow & Prompts Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Project Overview */}
            {item.description && (
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Overview</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  {item.description}
                </p>
              </div>
            )}

            {/* Prompt Summary */}
            {item.prompt_summary && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Prompt Summary & Seed
                  </h4>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300/90 leading-relaxed overflow-x-auto select-all">
                  "{item.prompt_summary}"
                </div>
              </div>
            )}

            {/* Workflow Pipeline Timeline */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Step-by-Step Generative Workflow
              </h4>

              <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                {item.workflow_steps?.length > 0 ? (
                  item.workflow_steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1 group">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 z-10">
                        {idx + 1}
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex-1 group-hover:border-slate-700 transition-colors">
                        {step}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No detailed steps documented for this asset.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
