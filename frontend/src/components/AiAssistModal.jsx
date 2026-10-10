import React, { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, ArrowRight, Bot, HelpCircle } from 'lucide-react';
import { apiAssistBrief } from '../services/api';

export default function AiAssistModal({ isOpen, onClose, onApplySuggestions }) {
  const [roughIdea, setRoughIdea] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!roughIdea.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await apiAssistBrief({
        rough_idea: roughIdea,
        target_audience: targetAudience,
        budget_range: budgetRange
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate brief with Groq AI');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApplySuggestions(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 glow-cyan">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 font-bold">
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Groq AI Campaign Assistant
              </h3>
              <p className="text-xs text-slate-400">Powered by Groq LLM Inference Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {!result ? (
            /* Input Form */
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Rough Campaign Idea <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  value={roughIdea}
                  onChange={(e) => setRoughIdea(e.target.value)}
                  placeholder="e.g. Create a 30-second futuristic sneaker advertisement for Instagram Reels featuring glowing neon assemble effects..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Audience (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Gen-Z sneakerheads, 18-35"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="e.g. $3,000 - $5,000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !roughIdea.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Campaign & Querying Groq LLM...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Generate Structured Brief with Groq AI</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Structured Brief Generated ({result.generated_via === 'groq' ? 'Groq Model API' : 'Rule-Based Engine'})
                </span>
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Edit Input Prompt
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Campaign Title</span>
                  <h4 className="text-base font-bold text-slate-100">{result.campaign_title}</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block">Content Type & Format</span>
                    <span className="font-semibold text-slate-200">{result.content_type} ({result.aspect_ratio})</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block">Estimated Budget</span>
                    <span className="font-bold text-emerald-400 font-mono">${result.estimated_budget?.toLocaleString()} USD</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Suggested AI Toolstack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suggested_tools?.map((tool) => (
                      <span key={tool} className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Required Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.required_skills?.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-purple-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {result.clarifying_questions?.length > 0 && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs space-y-1">
                    <span className="font-semibold text-purple-300 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> AI Recommended Clarifications
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {result.clarifying_questions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleApply}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-1.5"
                >
                  <span>Populate Brief Builder Form</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
