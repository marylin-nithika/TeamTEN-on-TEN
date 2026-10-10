import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal, Loader2, Sparkles, UserX } from 'lucide-react';
import { apiGetCreators } from '../services/api';
import CreatorCard from '../components/CreatorCard';
import CreatorDetailModal from '../components/CreatorDetailModal';

export default function CreatorsDiscovery({ onInviteCreator }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('');
  const [style, setStyle] = useState('');
  const [availability, setAvailability] = useState('');
  const [tool, setTool] = useState('');
  const [maxDayRate, setMaxDayRate] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('match');

  // Load creators
  const fetchCreators = async () => {
    setLoading(true);
    try {
      const data = await apiGetCreators({
        q: searchQuery,
        content_type: contentType,
        style: style,
        availability: availability,
        tool: tool,
        max_day_rate: maxDayRate ? parseFloat(maxDayRate) : null,
        verified_only: verifiedOnly,
        sort_by: sortBy
      });
      setCreators(data);
    } catch (err) {
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCreators();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, contentType, style, availability, tool, maxDayRate, verifiedOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setContentType('');
    setStyle('');
    setAvailability('');
    setTool('');
    setMaxDayRate('');
    setVerifiedOnly(false);
    setSortBy('match');
  };

  const hasActiveFilters = searchQuery || contentType || style || availability || tool || maxDayRate || verifiedOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            Discover Generative AI Talent
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified AI filmmakers, animators, and prompt artists with transparent pipeline workflows.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, tools, or skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Filter & Content Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Filter Controls Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-5 rounded-3xl glass-panel space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Filter Talent
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            {/* Content Format Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Content Format</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="">All Formats</option>
                <option value="Video Commercials">Video Commercials</option>
                <option value="Social Ads">Social Ads & Reels</option>
                <option value="Product Launch Teaser">Product Launch Teaser</option>
                <option value="3D Surrealist Animation">3D Surrealist Animation</option>
                <option value="Anime Commercials">Anime / VFX</option>
              </select>
            </div>

            {/* Visual Style Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Visual Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="">All Visual Styles</option>
                <option value="Photorealistic">Photorealistic</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Minimalist Luxury">Minimalist Luxury</option>
                <option value="Surrealist">Surrealist Bio</option>
                <option value="Anime / Manga">Anime / Cel Shaded</option>
              </select>
            </div>

            {/* AI Tool Stack Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Primary AI Tool</label>
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="">All AI Tools</option>
                <option value="Flux.1">Flux.1</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="Runway Gen-3">Runway Gen-3</option>
                <option value="Sora">Sora</option>
                <option value="Luma Dream Machine">Luma Dream Machine</option>
                <option value="Kling AI">Kling AI</option>
                <option value="ComfyUI">ComfyUI</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="">All Availability</option>
                <option value="Available Now">Available Now</option>
                <option value="Next Week">Next Week</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            {/* Max Day Rate Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                Max Day Rate (${maxDayRate || 'Any'})
              </label>
              <input
                type="range"
                min="500"
                max="2000"
                step="50"
                value={maxDayRate || 2000}
                onChange={(e) => setMaxDayRate(e.target.value)}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Verified Only Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-800">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium">Verified Creators Only</span>
            </label>
          </div>
        </div>

        {/* Creator Results List Column */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar: Active Filter Chips & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-300">
                Found <strong className="text-cyan-400 font-mono">{creators.length}</strong> Creators
              </span>

              {/* Active Filter Chips */}
              {contentType && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 text-[11px] flex items-center gap-1">
                  Format: {contentType}
                </span>
              )}
              {style && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-purple-300 text-[11px] flex items-center gap-1">
                  Style: {style}
                </span>
              )}
              {tool && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 text-[11px] flex items-center gap-1">
                  Tool: {tool}
                </span>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none"
              >
                <option value="match">AI Match Score</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Matching Creators with AI Stack...</p>
            </div>
          ) : creators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creators.map((creator) => (
                <CreatorCard
                  key={creator.profile.id}
                  creator={creator}
                  onSelect={setSelectedCreator}
                  onInvite={onInviteCreator}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-4 p-8 rounded-3xl glass-panel border border-slate-800">
              <UserX className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No matching creators found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try broadening your filter criteria or clearing specific tool/budget constraints.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Creator Detail & Portfolio Modal */}
      {selectedCreator && (
        <CreatorDetailModal
          creator={selectedCreator}
          onClose={() => setSelectedCreator(null)}
          onInvite={onInviteCreator}
        />
      )}

    </div>
  );
}
