import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Film, Compass, FileText, UserCheck, LogIn, PlusCircle } from 'lucide-react';

export default function Navbar({ onOpenBriefBuilder }) {
  const { user, role, switchRole, setIsAuthModalOpen, setAuthMode } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider text-slate-100 flex items-center gap-1">
              CREO<span className="text-cyan-400">VATE</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono -mt-1">
              AI Creative Marketplace
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1 rounded-full border border-slate-800">
          <Link
            to="/creators"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive('/creators')
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Discover Creators
          </Link>

          <Link
            to="/briefs"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive('/briefs')
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Creative Briefs
          </Link>

          <Link
            to={role === 'brand' ? '/dashboard/brand' : '/dashboard/creator'}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              location.pathname.startsWith('/dashboard')
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </nav>

        {/* Right Action & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Dual Role Switcher Pill */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-0.5 text-xs">
            <button
              onClick={() => switchRole('brand')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                role === 'brand'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Brand View
            </button>
            <button
              onClick={() => switchRole('creator')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                role === 'creator'
                  ? 'bg-slate-800 text-purple-400 border border-purple-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Creator View
            </button>
          </div>

          {/* Primary Action Button */}
          {role === 'brand' ? (
            <button
              onClick={onOpenBriefBuilder}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Post Brief</span>
            </button>
          ) : (
            <Link
              to="/briefs"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Find Briefs</span>
            </Link>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                alt={user.display_name}
                className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-none">{user.display_name}</span>
                <span className="text-[10px] text-slate-400 capitalize">{role}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2 py-1"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
