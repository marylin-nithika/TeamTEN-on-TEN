import React, { useState, useEffect } from 'react';
import { FileText, PlusCircle, Search, Sparkles, Filter, Loader2 } from 'lucide-react';
import { apiGetBriefs } from '../services/api';
import BriefCard from '../components/BriefCard';
import ProposalModal from '../components/ProposalModal';
import { useAuth } from '../context/AuthContext';

export default function BriefsMarketplace({ onOpenBriefBuilder }) {
  const { role } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBriefForProposal, setSelectedBriefForProposal] = useState(null);
  const [selectedBriefDetail, setSelectedBriefDetail] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('published');
  const [contentTypeFilter, setContentTypeFilter] = useState('');

  const fetchBriefs = async () => {
    setLoading(true);
    try {
      const data = await apiGetBriefs({
        status: statusFilter,
        content_type: contentTypeFilter
      });
      setBriefs(data);
    } catch (err) {
      console.error('Error fetching briefs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, [statusFilter, contentTypeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            Creative Briefs Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse active brand campaigns, submit generative visual proposals, or create new AI briefs.
          </p>
        </div>

        {role === 'brand' && (
          <button
            onClick={onOpenBriefBuilder}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Post Campaign Brief</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-2">
          {['published', 'in_progress', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'published' ? 'Open Bids' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Content Type Selector */}
        <select
          value={contentTypeFilter}
          onChange={(e) => setContentTypeFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none"
        >
          <option value="">All Formats</option>
          <option value="Social Media Commercial">Social Media Commercial</option>
          <option value="Brand Anthem Video">Brand Anthem Video</option>
          <option value="Product Launch Teaser">Product Launch Teaser</option>
        </select>
      </div>

      {/* Briefs Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading active campaign briefs...</p>
        </div>
      ) : briefs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief) => (
            <BriefCard
              key={brief.id}
              brief={brief}
              onSelect={setSelectedBriefDetail}
              onSubmitProposal={setSelectedBriefForProposal}
              isCreator={role === 'creator'}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 p-8 rounded-3xl glass-panel border border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No briefs found for selected filter</h3>
          <p className="text-xs text-slate-400">Try changing status tabs or clear content format filters.</p>
        </div>
      )}

      {/* Proposal Submission Modal */}
      {selectedBriefForProposal && (
        <ProposalModal
          brief={selectedBriefForProposal}
          isOpen={!!selectedBriefForProposal}
          onClose={() => setSelectedBriefForProposal(null)}
          onSubmitted={() => {
            fetchBriefs();
          }}
        />
      )}

    </div>
  );
}
