import React, { useState } from 'react';
import { X, Send, DollarSign, Clock, FileText } from 'lucide-react';
import { apiSubmitProposal } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProposalModal({ brief, isOpen, onClose, onSubmitted }) {
  const { user } = useAuth();
  const [proposedPrice, setProposedPrice] = useState(brief?.budget || 3000);
  const [estimatedTimeline, setEstimatedTimeline] = useState('3-5 Business Days');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !brief) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a pitch message outlining your approach.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        brief_id: brief.id,
        creator_id: user?.id || 'a0000000-0000-0000-0000-000000000001',
        message: message,
        proposed_price: parseFloat(proposedPrice),
        estimated_timeline: estimatedTimeline
      };
      const res = await apiSubmitProposal(payload);
      onSubmitted(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 glow-purple">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h3 className="text-base font-bold text-slate-100">Submit Project Proposal</h3>
            <p className="text-xs text-slate-400 line-clamp-1">Brief: {brief.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Your Price Bid ($ USD)
              </label>
              <input
                type="number"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono font-bold text-xs focus:outline-none focus:border-purple-500"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Brief Target: ${brief.budget?.toLocaleString()}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Estimated Delivery
              </label>
              <input
                type="text"
                value={estimatedTimeline}
                onChange={(e) => setEstimatedTimeline(e.target.value)}
                placeholder="e.g. 3 Days"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Proposal Pitch & Technical Workflow *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Detail your experience, proposed AI stack (e.g. Flux.1, Runway Gen-3), and how you will fulfill the brief requirements..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Proposal</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
