import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, AlertTriangle, FileVideo, ExternalLink } from 'lucide-react';
import { apiSubmitDeliverable } from '../services/api';

export default function DeliverableModal({ engagement, isOpen, onClose, onSubmitted }) {
  const [fileUrl, setFileUrl] = useState('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&h=675&fit=crop');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !engagement) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await apiSubmitDeliverable(engagement.id, {
        engagement_id: engagement.id,
        file_url: fileUrl,
        notes: notes
      });
      onSubmitted(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit deliverable asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h3 className="text-base font-bold text-slate-100">Submit Campaign Deliverable</h3>
            <p className="text-xs text-slate-400">Engagement ID: #{engagement.id?.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Deliverable Asset Media URL *
            </label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://... (Image or Video URL)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Supports direct video/image links, Supabase Storage URLs or external media.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Release Notes & Version Summary
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Describe color grade adjustments, audio mix notes, or version changes..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Version for Approval</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
