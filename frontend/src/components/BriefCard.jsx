import React from 'react';
import { Clock, DollarSign, Send, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function BriefCard({ brief, onSelect, onSubmitProposal, isCreator }) {
  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={brief.brand_avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop'}
            alt={brief.brand_name || 'Brand'}
            className="w-11 h-11 rounded-2xl object-cover border border-slate-700"
          />
          <div>
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
              {brief.brand_name || 'Brand Client'}
            </span>
            <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors line-clamp-1">
              {brief.title}
            </h3>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
          brief.status === 'published'
            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
            : brief.status === 'in_progress'
            ? 'bg-sky-950/80 text-sky-400 border border-sky-500/30'
            : 'bg-slate-800 text-slate-400'
        }`}>
          {brief.status === 'published' ? 'Open for Bids' : brief.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
        {brief.description}
      </p>

      {/* Campaign Metadata Badges */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase block">Content Format</span>
          <span className="font-semibold text-slate-200 line-clamp-1">{brief.content_type} ({brief.aspect_ratio || '16:9'})</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase block">Style & Tone</span>
          <span className="font-semibold text-slate-200 line-clamp-1">{brief.style || 'Cinematic'}</span>
        </div>
      </div>

      {/* Preferred Tools */}
      {brief.preferred_tools?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {brief.preferred_tools.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 font-mono">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Pricing & Deadline Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase block">Budget</span>
          <span className="font-bold text-slate-100 font-mono text-base text-emerald-400">
            ${brief.budget ? brief.budget.toLocaleString() : '3,500'} <span className="text-xs text-slate-400 font-sans font-normal">{brief.currency || 'USD'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(brief)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Details</span>
          </button>

          {isCreator && brief.status === 'published' && (
            <button
              onClick={() => onSubmitProposal(brief)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs transition-all shadow-md shadow-purple-500/20 active:scale-95 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
