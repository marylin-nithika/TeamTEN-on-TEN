import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, CheckCircle2, ShieldAlert, ArrowRight, Save, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiCreateBrief } from '../services/api';
import AiAssistModal from './AiAssistModal';

export default function BriefBuilderModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const [isAiAssistOpen, setIsAiAssistOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    description: '',
    target_audience: '',
    content_type: 'Social Media Commercial',
    style: 'Cyberpunk / Photorealistic',
    tone: 'High-Energy, Premium',
    aspect_ratio: '16:9',
    duration: '0:30',
    resolution: '4K UHD',
    deliverables: ['1x Master Video File', 'Source Prompts & Keyframes'],
    preferred_tools: ['Midjourney v6', 'Runway Gen-3', 'Flux.1'],
    required_skills: ['3D Motion Synthesis', 'Color Grading'],
    references: [],
    budget: 3500,
    currency: 'USD',
    deadline: '2026-11-30',
    revisions: 2,
    licensing_territory: 'Worldwide',
    licensing_duration: 'Perpetual',
    licensing_exclusivity: true,
    ai_disclosure_required: true,
    ownership_type: 'Full Buyout',
    status: 'published'
  });

  const [newDeliverable, setNewDeliverable] = useState('');
  const [newTool, setNewTool] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Calculate form completeness percentage
  const calculateCompleteness = () => {
    let score = 0;
    if (formData.title) score += 20;
    if (formData.description) score += 20;
    if (formData.content_type) score += 15;
    if (formData.budget > 0) score += 15;
    if (formData.deliverables.length > 0) score += 15;
    if (formData.preferred_tools.length > 0) score += 15;
    return score;
  };

  const completeness = calculateCompleteness();

  const handleApplyAiSuggestions = (aiData) => {
    setFormData((prev) => ({
      ...prev,
      title: aiData.campaign_title || prev.title,
      objective: aiData.objective || prev.objective,
      description: aiData.description || prev.description,
      target_audience: aiData.target_audience || prev.target_audience,
      content_type: aiData.content_type || prev.content_type,
      style: aiData.style || prev.style,
      tone: aiData.tone || prev.tone,
      aspect_ratio: aiData.aspect_ratio || prev.aspect_ratio,
      duration: aiData.duration || prev.duration,
      deliverables: aiData.deliverables?.length ? aiData.deliverables : prev.deliverables,
      preferred_tools: aiData.suggested_tools?.length ? aiData.suggested_tools : prev.preferred_tools,
      required_skills: aiData.required_skills?.length ? aiData.required_skills : prev.required_skills,
      budget: aiData.estimated_budget || prev.budget
    }));
  };

  const handleSubmit = async (e, saveStatus = 'published') => {
    e.preventDefault();
    if (!formData.title || !formData.description || formData.budget <= 0) {
      setError('Please fill in required fields (Title, Description, and Budget).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        brand_id: user?.id || '11111111-1111-1111-1111-111111111111',
        status: saveStatus
      };
      const created = await apiCreateBrief(payload);
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create brief');
    } finally {
      setLoading(false);
    }
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setFormData((prev) => ({ ...prev, deliverables: [...prev.deliverables, newDeliverable.trim()] }));
      setNewDeliverable('');
    }
  };

  const addTool = () => {
    if (newTool.trim()) {
      setFormData((prev) => ({ ...prev, preferred_tools: [...prev.preferred_tools, newTool.trim()] }));
      setNewTool('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Brand Brief Builder
              </h2>
              <p className="text-xs text-slate-400">Specify campaign requirements & commercial licensing rights</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Groq AI Launch Button */}
              <button
                type="button"
                onClick={() => setIsAiAssistOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Autofill with Groq AI</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Completeness Indicator Bar */}
          <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-2">
              Brief Completeness:
              <strong className="text-cyan-400 font-mono">{completeness}%</strong>
            </span>
            <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={(e) => handleSubmit(e, 'published')} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Campaign Overview Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">1. Campaign Overview</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NextGen Cyber Sneaker Launch Video"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Campaign Objective</label>
                  <input
                    type="text"
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    placeholder="e.g. Drive viral engagement on Instagram Reels & TikTok"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    placeholder="e.g. Gen-Z & Millennial sneaker enthusiasts aged 18-35"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Creative Brief & Narrative *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe your creative vision, scene breakdowns, key visual elements, and story direction..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Technical Specifications Section */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">2. Technical Specifications & Output</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Content Format</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  >
                    <option value="Social Media Commercial">Social Media Commercial</option>
                    <option value="Brand Anthem Video">Brand Anthem Video</option>
                    <option value="Product Launch Teaser">Product Launch Teaser</option>
                    <option value="3D Surrealist Animation">3D Surrealist Animation</option>
                    <option value="Architectural Flythrough">Architectural Flythrough</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Aspect Ratio</label>
                  <select
                    value={formData.aspect_ratio}
                    onChange={(e) => setFormData({ ...formData, aspect_ratio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Vertical Reels)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:5">4:5 (Instagram Feed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  >
                    <option value="0:15">0:15 (15 Seconds)</option>
                    <option value="0:30">0:30 (30 Seconds)</option>
                    <option value="0:45">0:45 (45 Seconds)</option>
                    <option value="1:00">1:00 (60 Seconds)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Resolution</label>
                  <select
                    value={formData.resolution}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  >
                    <option value="4K UHD">4K UHD (3840x2160)</option>
                    <option value="1080p HD">1080p Full HD</option>
                    <option value="8K Ultra">8K Master Render</option>
                  </select>
                </div>
              </div>

              {/* Tools & Deliverables List Builder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Deliverables Required</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      placeholder="Add deliverable format..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                    />
                    <button
                      type="button"
                      onClick={addDeliverable}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.deliverables.map((del, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
                        {del}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, deliverables: formData.deliverables.filter((_, idx) => idx !== i) })}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred AI Tools / Stack</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="Add tool e.g. Flux.1, Sora..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                    />
                    <button
                      type="button"
                      onClick={addTool}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.preferred_tools.map((tool, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-xs flex items-center gap-1.5">
                        {tool}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, preferred_tools: formData.preferred_tools.filter((_, idx) => idx !== i) })}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget & Commercial Licensing Section */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">3. Budget & Commercial Licensing Terms</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Budget ($ USD) *</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Ownership Type</label>
                  <select
                    value={formData.ownership_type}
                    onChange={(e) => setFormData({ ...formData, ownership_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  >
                    <option value="Full Buyout">Full Buyout (All Rights)</option>
                    <option value="Digital Media Rights Only">Digital Media Rights Only</option>
                    <option value="Licensed Commercial Use">Licensed Commercial Use</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save as Draft</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Publish Brief to Marketplace</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>

      {/* Groq AI Assist Sub-Modal */}
      <AiAssistModal
        isOpen={isAiAssistOpen}
        onClose={() => setIsAiAssistOpen(false)}
        onApplySuggestions={handleApplyAiSuggestions}
      />
    </>
  );
}
