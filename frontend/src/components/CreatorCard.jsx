import React from 'react';
import { Star, MapPin, Clock, ArrowRight, Layers, DollarSign } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import VerificationBadge from './VerificationBadge';

export default function CreatorCard({ creator, onSelect, onInvite }) {
  const profile = creator.profile;
  const cp = creator.creator_profile;
  const portfolioCount = creator.portfolio_items?.length || 0;

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'}
              alt={profile.display_name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-cyan-500/60 transition-colors shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                cp.availability === 'Available Now'
                  ? 'bg-emerald-400'
                  : cp.availability === 'Next Week'
                  ? 'bg-sky-400'
                  : 'bg-amber-400'
              }`}
              title={cp.availability}
            />
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              {profile.display_name}
            </h3>
            <p className="text-xs text-slate-400 font-medium line-clamp-1">{cp.specialization}</p>
            
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-amber-400" />
                {cp.rating || 4.9}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                {cp.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Match Score Badge */}
        {creator.match_explanation && (
          <MatchScoreBadge matchExplanation={creator.match_explanation} />
        )}
      </div>

      {/* Headline / Bio snippet */}
      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
        "{cp.headline || cp.biography}"
      </p>

      {/* AI Stack Tags */}
      <div>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block mb-1.5">AI Tools & Workflows</span>
        <div className="flex flex-wrap gap-1">
          {cp.tools?.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-medium"
            >
              {tool}
            </span>
          ))}
          {cp.tools?.length > 4 && (
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
              +{cp.tools.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Pricing & Availability Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase block">Day Rate</span>
          <span className="font-bold text-slate-100 font-mono text-sm">
            ${cp.day_rate ? cp.day_rate.toLocaleString() : '1,000'}<span className="text-xs text-slate-400 font-sans font-normal">/day</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(creator)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Portfolio ({portfolioCount})</span>
          </button>
          
          <button
            onClick={() => onInvite(creator)}
            className="p-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold transition-all shadow-sm active:scale-95"
            title="Invite Creator"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

    </div>
  );
}
