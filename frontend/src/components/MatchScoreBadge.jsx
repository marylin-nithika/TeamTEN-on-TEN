import React, { useState } from 'react';
import { Cpu, Info, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function MatchScoreBadge({ matchExplanation }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!matchExplanation) return null;

  const { score, reasons, overlapping_skills, overlapping_tools } = matchExplanation;

  const getScoreColor = (s) => {
    if (s >= 85) return 'from-cyan-500 to-emerald-400 text-slate-950 border-cyan-400/40 shadow-cyan-500/20';
    if (s >= 70) return 'from-indigo-500 to-purple-500 text-white border-indigo-400/40 shadow-indigo-500/20';
    return 'from-slate-700 to-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getScoreColor(score)} border shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer`}
        title="Click to see why this creator matches"
      >
        <Cpu className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{score}% Match</span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Rationale Popover */}
      {expanded && (
        <div className="absolute right-0 mt-2 w-72 p-3.5 rounded-2xl glass-panel bg-slate-900/95 border border-slate-700 shadow-2xl z-30 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Match Breakdown
            </span>
            <span className="font-mono text-[10px] text-cyan-400 font-bold">{score}/100</span>
          </div>

          <div className="space-y-1.5">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-slate-300 leading-tight">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          {(overlapping_tools?.length > 0 || overlapping_skills?.length > 0) && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
              {overlapping_tools?.map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-[10px]">
                  Tool: {t}
                </span>
              ))}
              {overlapping_skills?.map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/50 text-purple-300 text-[10px]">
                  Skill: {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
