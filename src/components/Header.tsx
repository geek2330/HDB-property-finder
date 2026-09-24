import React from 'react';
import { Bookmark, Scale, SlidersHorizontal, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'explore' | 'map' | 'grants' | 'saved';
  setActiveTab: (tab: 'explore' | 'map' | 'grants' | 'saved') => void;
  savedCount: number;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenQuiz: () => void;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
  onOpenHealthCheck?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
  onOpenCompare,
  onOpenQuiz,
  onToggleFilters,
  hasActiveFilters,
  onOpenHealthCheck,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('explore')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
            HDB Nest
          </span>
          <span className="sr-only">HDB Nest Singapore Property Recommender</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('explore')}
            className={`cursor-pointer transition-colors hover:text-slate-900 whitespace-nowrap ${
              activeTab === 'explore' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 -mb-0.5 pb-5 pt-5' : ''
            }`}
          >
            Available Flats
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`cursor-pointer transition-colors hover:text-slate-900 whitespace-nowrap ${
              activeTab === 'map' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 -mb-0.5 pb-5 pt-5' : ''
            }`}
          >
            Estate Map & Prices
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`cursor-pointer transition-colors hover:text-slate-900 whitespace-nowrap ${
              activeTab === 'grants' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 -mb-0.5 pb-5 pt-5' : ''
            }`}
          >
            CPF Grant & Loan Planner
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`cursor-pointer transition-colors hover:text-slate-900 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'saved' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 -mb-0.5 pb-5 pt-5' : ''
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Shortlisted</span>
            {savedCount > 0 && (
              <span className="text-xs text-rose-600 font-semibold tabular-nums ml-0.5">
                ({savedCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Compare toggle if items exist */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Scale className="w-3.5 h-3.5 text-slate-600" />
              <span>Compare</span>
              <span className="tabular-nums font-bold text-slate-900">({compareCount})</span>
            </button>
          )}

          {/* Quick Filter toggle on mobile / tablet */}
          <button
            onClick={onToggleFilters}
            className={`lg:hidden px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              hasActiveFilters
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* API Health Check Trigger */}
          {onOpenHealthCheck && (
            <button
              onClick={onOpenHealthCheck}
              title="Inspect backend and SLA OneMap API health"
              className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span className="sr-only">API Health Check</span>
            </button>
          )}

          {/* Smart Match Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Find Ideal Flat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
