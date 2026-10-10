import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetBriefs, apiGetProposals, apiUpdateProposalStatus, apiGetEngagements, apiGetDeliverables, apiUpdateDeliverableStatus } from '../services/api';
import { FileText, CheckCircle2, XCircle, Clock, ShieldCheck, Loader2, Send, PlusCircle } from 'lucide-react';

export default function BrandDashboard({ onOpenBriefBuilder }) {
  const { user } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals', 'briefs', 'engagements'
  const [loading, setLoading] = useState(true);
  const [selectedEngagementDeliverables, setSelectedEngagementDeliverables] = useState([]);
  const [selectedEngagementId, setSelectedEngagementId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const brandId = user?.id || '11111111-1111-1111-1111-111111111111';
      const [bList, pList, eList] = await Promise.all([
        apiGetBriefs({ brand_id: brandId }),
        apiGetProposals({}),
        apiGetEngagements({ brand_id: brandId })
      ]);
      setBriefs(bList);
      setProposals(pList);
      setEngagements(eList);
    } catch (err) {
      console.error('Error loading brand dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAcceptProposal = async (propId) => {
    try {
      await apiUpdateProposalStatus(propId, 'accepted');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to accept proposal');
    }
  };

  const handleDeclineProposal = async (propId) => {
    try {
      await apiUpdateProposalStatus(propId, 'declined');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to decline proposal');
    }
  };

  const handleViewDeliverables = async (engId) => {
    setSelectedEngagementId(engId);
    try {
      const delivs = await apiGetDeliverables(engId);
      setSelectedEngagementDeliverables(delivs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveDeliverable = async (delivId) => {
    try {
      await apiUpdateDeliverableStatus(delivId, 'approved', 'Approved by Brand Client');
      if (selectedEngagementId) {
        handleViewDeliverables(selectedEngagementId);
      }
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to approve deliverable');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            Brand Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track published campaign briefs, review incoming creator proposals, and manage project deliverables.
          </p>
        </div>

        <button
          onClick={onOpenBriefBuilder}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Brief</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800 w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'proposals'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Incoming Proposals ({proposals.length})
        </button>
        <button
          onClick={() => setActiveTab('briefs')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'briefs'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Briefs ({briefs.length})
        </button>
        <button
          onClick={() => setActiveTab('engagements')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'engagements'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Active Engagements ({engagements.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading dashboard records...</p>
        </div>
      ) : activeTab === 'proposals' ? (
        
        /* Proposals View */
        <div className="space-y-4">
          {proposals.length > 0 ? (
            proposals.map((prop) => (
              <div key={prop.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={prop.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'}
                      alt={prop.creator_name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{prop.creator_name}</h3>
                      <p className="text-xs text-cyan-400 font-medium">{prop.creator_specialization || 'AI Creator'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400">Bid: <strong className="text-emerald-400 font-bold text-sm">${prop.proposed_price?.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span className="text-slate-400">Timeline: <strong className="text-slate-200">{prop.estimated_timeline}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  "{prop.message}"
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    prop.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  }`}>
                    Status: {prop.status}
                  </span>

                  {prop.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeclineProposal(prop.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-medium text-xs transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptProposal(prop.id)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Accept Proposal & Start Project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-10 text-center">No proposals received yet.</p>
          )}
        </div>

      ) : activeTab === 'briefs' ? (
        
        /* Briefs View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {briefs.map((b) => (
            <div key={b.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-100 text-base">{b.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{b.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="font-mono text-emerald-400 font-bold">${b.budget?.toLocaleString()} USD</span>
                <span className="text-slate-400">{b.proposal_count || 0} Proposals</span>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* Engagements View */
        <div className="space-y-6">
          {engagements.map((eng) => (
            <div key={eng.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">Active Contract</span>
                  <h3 className="font-bold text-slate-100 text-base">{eng.brief_title}</h3>
                  <p className="text-xs text-slate-400">Creator: {eng.creator_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 font-mono">${eng.agreed_price?.toLocaleString()}</span>
                  <span className="block text-[11px] text-slate-400">{eng.usage_rights}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                  Engagement Status: {eng.status}
                </span>

                <button
                  onClick={() => handleViewDeliverables(eng.id)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Review Deliverables History
                </button>
              </div>

              {/* Deliverable Review Sub-panel */}
              {selectedEngagementId === eng.id && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Submitted Deliverable Versions</h4>
                  {selectedEngagementDeliverables.length > 0 ? (
                    selectedEngagementDeliverables.map((deliv) => (
                      <div key={deliv.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs gap-3">
                        <div className="space-y-1">
                          <span className="font-bold text-cyan-400 font-mono">Version {deliv.version}</span>
                          <p className="text-slate-300">{deliv.notes || 'Asset submission'}</p>
                          <a href={deliv.file_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-[11px]">
                            Preview Asset URL ↗
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          {deliv.approval_status === 'submitted' ? (
                            <button
                              onClick={() => handleApproveDeliverable(deliv.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow"
                            >
                              Approve Asset
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold">
                              Approved
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No deliverable versions submitted yet by creator.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      )}

    </div>
  );
}
