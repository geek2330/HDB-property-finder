import React, { useState } from 'react';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';
import heroBannerImg from '../assets/images/hero_singapore_hdb_skyline_1790236556117.jpg';
import { POPULAR_SEARCH_PRESETS, TOWN_BENCHMARKS } from '../data/hdbProperties';
import { FlatType, PropertyFilters } from '../types/property';
import { parseNaturalQuery } from '../utils/queryParser';

interface HeroSearchProps {
  filters: PropertyFilters;
  onUpdateFilters: (updates: Partial<PropertyFilters>) => void;
  totalMatchingCount: number;
  onOpenQuiz: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onUpdateFilters,
  totalMatchingCount,
  onOpenQuiz,
}) => {
  const [searchInput, setSearchInput] = useState(filters.query);

  const parsedQuery = searchInput ? parseNaturalQuery(searchInput) : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilters({ query: searchInput });
  };

  const handleApplyPreset = (queryStr: string) => {
    setSearchInput(queryStr);
    onUpdateFilters({ query: queryStr });
  };

  const handleClearQuery = () => {
    setSearchInput('');
    onUpdateFilters({ query: '' });
  };

  return (
    <div className="relative border-b border-slate-200 bg-white overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
        <img
          src={heroBannerImg}
          alt="Singapore skyline"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-rose-600 uppercase mb-2">
            Singapore Resale Housing Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
            Find your ideal HDB home with data-backed recommendations.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Query across 24 towns by location, budget, floor area, and MRT proximity with real town median benchmarking and CPF grant estimations.
          </p>
        </div>

        {/* Primary Natural Language Query Bar */}
        <div className="mt-8 max-w-3xl">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-xl shadow-lg shadow-slate-200/60 border border-slate-300 p-2 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10"
          >
            <div className="relative flex-1 flex items-center px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="E.g. 4-room in Bishan under 850k near MRT, or spacious Tampines >110 sqm..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none py-2"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>Search & Recommend</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Real-time Query Interpretation Tags */}
          {parsedQuery && parsedQuery.detectedCriteria.length > 0 && (
            <div className="mt-2.5 flex items-center flex-wrap gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-500">Detected filters:</span>
              {parsedQuery.detectedCriteria.map((crit, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium border border-slate-200"
                >
                  {crit.label}
                </span>
              ))}
            </div>
          )}

          {/* Quick Clickable Presets */}
          <div className="mt-4 flex items-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-600">Popular queries:</span>
            {POPULAR_SEARCH_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.query)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Facet Selectors Row */}
        <div className="mt-6 pt-6 border-t border-slate-200 max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Quick Town Select */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Town</label>
            <select
              value={filters.towns[0] || ''}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateFilters({ towns: val ? [val] : [] });
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-slate-400"
            >
              <option value="">All Singapore Towns</option>
              {TOWN_BENCHMARKS.map((t) => (
                <option key={t.town} value={t.town}>
                  {t.town} ({t.region})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Budget Select */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Max Price</label>
            <select
              value={filters.maxPrice >= 1500000 ? '' : filters.maxPrice}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : 1500000;
                onUpdateFilters({ maxPrice: val });
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-slate-400"
            >
              <option value="">Any Budget</option>
              <option value="600000">Under S$600,000</option>
              <option value="750000">Under S$750,000</option>
              <option value="900000">Under S$900,000</option>
              <option value="1100000">Under S$1,100,000</option>
              <option value="1300000">Under S$1,300,000</option>
            </select>
          </div>

          {/* Quick Flat Type Select */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Flat Type</label>
            <select
              value={filters.flatTypes[0] || ''}
              onChange={(e) => {
                const val = e.target.value as FlatType;
                onUpdateFilters({ flatTypes: val ? [val] : [] });
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-slate-400"
            >
              <option value="">All Flat Types</option>
              <option value="3-Room">3-Room</option>
              <option value="4-Room">4-Room</option>
              <option value="5-Room">5-Room</option>
              <option value="Executive">Executive</option>
              <option value="Maisonette">Executive Maisonette</option>
            </select>
          </div>

          {/* Recommendation Quiz Trigger */}
          <div className="flex flex-col justify-end">
            <button
              onClick={onOpenQuiz}
              type="button"
              className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Matching Quiz</span>
            </button>
          </div>
        </div>

        {/* Live Result Counter Line */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-900 tabular-nums">
              {totalMatchingCount}
            </span>{' '}
            available {totalMatchingCount === 1 ? 'property' : 'properties'} recommended
          </div>
          {(filters.towns.length > 0 || filters.flatTypes.length > 0 || filters.maxPrice < 1500000 || filters.query) && (
            <button
              onClick={() => {
                setSearchInput('');
                onUpdateFilters({
                  query: '',
                  towns: [],
                  regions: [],
                  flatTypes: [],
                  minPrice: 300000,
                  maxPrice: 1500000,
                  minAreaSqm: 40,
                  maxAreaSqm: 160,
                  maxMrtDistanceMins: 20,
                  minLeaseYears: 50,
                  storeyCategories: [],
                  cornerUnitOnly: false,
                  unblockedViewOnly: false,
                  noWestSunOnly: false,
                });
              }}
              className="text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
