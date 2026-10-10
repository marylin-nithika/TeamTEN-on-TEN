import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetCreatorDetail, apiUpdateCreatorProfile, apiAddPortfolioItem, apiGetProposals, apiGetEngagements } from '../services/api';
import { User, Layers, Plus, UploadCloud, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import DeliverableModal from '../components/DeliverableModal';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const creatorId = user?.id || 'a0000000-0000-0000-0000-000000000001';

  const [creatorData, setCreatorData] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio', 'profile', 'engagements'

  // New Portfolio Item State
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    media_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&h=675&fit=crop',
    media_type: 'image',
    tools_used: ['Flux.1', 'Runway Gen-3'],
    prompt_summary: '',
    workflow_steps: ['1. Prompt engineering in Flux.1', '2. Motion video generation in Runway Gen-3'],
    aspect_ratio: '16:9',
    duration: '0:30',
    resolution: '4K UHD',
    verification_status: 'verified_creator'
  });

  // Deliverable Modal State
  const [selectedEngagementForDeliverable, setSelectedEngagementForDeliverable] = useState(null);

  const loadCreatorDashboard = async () => {
    setLoading(true);
    try {
      const [cDetail, pList, eList] = await Promise.all([
        apiGetCreatorDetail(creatorId).catch(() => null),
        apiGetProposals({ creator_id: creatorId }),
        apiGetEngagements({ creator_id: creatorId })
      ]);
      setCreatorData(cDetail);
      setProposals(pList);
      setEngagements(eList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreatorDashboard();
  }, [creatorId]);

  const handleAddPortfolioSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.media_url) return;

    try {
      await apiAddPortfolioItem(creatorId, { ...newItem, creator_id: creatorId });
      setIsAddingPortfolio(false);
      loadCreatorDashboard();
    } catch (err) {
      alert(err.message || 'Failed to add portfolio item');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            Creator Studio Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showcase AI portfolio items, track submitted proposals, and fulfill project deliverables.
          </p>
        </div>

        <button
          onClick={() => setIsAddingPortfolio(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Portfolio Work</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800 w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'portfolio'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Portfolio ({creatorData?.portfolio_items?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('engagements')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'engagements'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Active Projects & Deliverables ({engagements.length})
        </button>
      </div>

      {/* Add Portfolio Modal Inline */}
      {isAddingPortfolio && (
        <div className="p-6 rounded-3xl glass-panel border border-purple-500/40 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Showcase New AI Project
            </h3>
            <button onClick={() => setIsAddingPortfolio(false)} className="text-slate-400 hover:text-white text-xs">
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddPortfolioSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Cyberpunk Hovercraft Teaser"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Media URL</label>
                <input
                  type="text"
                  value={newItem.media_url}
                  onChange={(e) => setNewItem({ ...newItem, media_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Prompt Summary</label>
              <textarea
                value={newItem.prompt_summary}
                onChange={(e) => setNewItem({ ...newItem, prompt_summary: e.target.value })}
                placeholder="Keyframes prompt snippet..."
                rows={2}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs shadow"
            >
              Publish Portfolio Work
            </button>
          </form>
        </div>
      )}

      {/* Main Tab Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading studio details...</p>
        </div>
      ) : activeTab === 'portfolio' ? (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatorData?.portfolio_items?.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl overflow-hidden border border-slate-800 p-4 space-y-3">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950">
                <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>

      ) : (

        <div className="space-y-4">
          {engagements.map((eng) => (
            <div key={eng.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-purple-400 uppercase font-mono">Agreed Client Contract</span>
                  <h3 className="font-bold text-slate-100 text-base">{eng.brief_title}</h3>
                  <p className="text-xs text-slate-400">Client: {eng.brand_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 font-mono">${eng.agreed_price?.toLocaleString()}</span>
                  <span className="block text-[11px] text-slate-400">{eng.usage_rights}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-semibold border border-purple-500/30">
                  Status: {eng.status}
                </span>

                <button
                  onClick={() => setSelectedEngagementForDeliverable(eng)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs shadow flex items-center gap-1.5 active:scale-95"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Deliverable Asset</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      )}

      {/* Deliverable Submission Modal */}
      {selectedEngagementForDeliverable && (
        <DeliverableModal
          engagement={selectedEngagementForDeliverable}
          isOpen={!!selectedEngagementForDeliverable}
          onClose={() => setSelectedEngagementForDeliverable(null)}
          onSubmitted={() => loadCreatorDashboard()}
        />
      )}

    </div>
  );
}
