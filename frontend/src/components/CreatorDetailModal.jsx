import React, { useState } from 'react';
import { X, Star, MapPin, Clock, ShieldCheck, Layers, Cpu, Sparkles, CheckCircle2, FilePlus } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import WorkflowModal from './WorkflowModal';

export default function CreatorDetailModal({ creator, onClose, onInvite }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!creator) return null;

  const { profile, creator_profile: cp, portfolio_items = [] } = creator;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
          
          {/* Cover & Header Banner */}
          <div className="h-32 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 relative border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Quick Stats Info */}
          <div className="px-6 pb-6 relative -mt-16 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'}
                  alt={profile.display_name}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-xl"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-slate-100">{profile.display_name}</h2>
                    <VerificationBadge status="verified_creator" />
                  </div>
                  <p className="text-sm font-semibold text-cyan-400">{cp.headline}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {cp.rating || 4.98}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {cp.location}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{cp.availability}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] uppercase text-slate-400 block">Day Rate</span>
                  <span className="text-lg font-bold text-slate-100 font-mono">
                    ${cp.day_rate ? cp.day_rate.toLocaleString() : '1,100'}<span className="text-xs text-slate-400">/day</span>
                  </span>
                </div>
                
                <button
                  onClick={() => { onClose(); onInvite(creator); }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-1.5"
                >
                  <FilePlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Invite to Brief</span>
                </button>
              </div>
            </div>

            {/* Main Tabs / Info Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Sidebar Details */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Biography */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Biography</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{cp.biography}</p>
                </div>

                {/* AI Stack & Specialization */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">AI Tools & Models</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cp.tools?.map((tool) => (
                        <span key={tool} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-medium">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Skills & Pipelines</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cp.skills?.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-purple-300 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Commercial Terms</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Full Commercial Buyout
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Prompt & Asset Source Included
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Turnaround: {cp.turnaround_time}
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Right Portfolio Showcase */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" /> AI Portfolio & Case Studies ({portfolio_items.length})
                  </h3>
                  <span className="text-xs text-slate-400">Click asset for workflow timeline</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio_items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="glass-card rounded-2xl overflow-hidden border border-slate-800 cursor-pointer group hover:border-cyan-500/50 transition-all"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-950">
                        <img
                          src={item.media_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-2 left-2">
                          <VerificationBadge status={item.verification_status} />
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-200">
                          <span className="px-2 py-0.5 rounded bg-slate-900/90 font-mono text-[10px]">
                            {item.aspect_ratio}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/90 text-slate-950 font-bold text-[10px] flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> How it was made
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1.5">
                        <h4 className="font-bold text-slate-200 text-xs line-clamp-1 group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tools_used?.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-cyan-300 font-mono border border-slate-800">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Embedded Workflow Timeline Modal */}
      {selectedItem && (
        <WorkflowModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}
