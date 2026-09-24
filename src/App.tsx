/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, List, ArrowUpDown, Bookmark, 
  Sparkles, X, Filter, ChevronRight
} from 'lucide-react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FilterSidebar } from './components/FilterSidebar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { SingaporeTownMap } from './components/SingaporeTownMap';
import { GrantCalculatorView } from './components/GrantCalculatorModal';
import { RecommendationQuizModal } from './components/RecommendationQuizModal';
import { Footer } from './components/Footer';
import { HDB_PROPERTIES } from './data/hdbProperties';
import { PropertyFilters, ScoredProperty, SingaporeRegion } from './types/property';
import { filterAndScoreProperties } from './utils/recommender';

const INITIAL_FILTERS: PropertyFilters = {
  query: '',
  towns: [],
  regions: [],
  minPrice: 300000,
  maxPrice: 1500000,
  minAreaSqm: 40,
  maxAreaSqm: 160,
  unitMeasurement: 'sqm',
  flatTypes: [],
  maxMrtDistanceMins: 20,
  minLeaseYears: 50,
  storeyCategories: [],
  renovationCondition: 'all',
  cornerUnitOnly: false,
  unblockedViewOnly: false,
  noWestSunOnly: false,
  sortBy: 'recommended',
};

export default function App() {
  const [filters, setFilters] = useState<PropertyFilters>(INITIAL_FILTERS);
  const [activeTab, setActiveTab] = useState<'explore' | 'map' | 'grants' | 'saved'>('explore');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Shortlist state persisted in localStorage
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hdb_nest_saved');
      return saved ? JSON.parse(saved) : ['hdb-01', 'hdb-02'];
    } catch {
      return ['hdb-01', 'hdb-02'];
    }
  });

  // Comparison state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<ScoredProperty | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('hdb_nest_saved', JSON.stringify(savedPropertyIds));
    } catch {
      // ignore
    }
  }, [savedPropertyIds]);

  // Update filters handler
  const handleUpdateFilters = (updates: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    if (activeTab !== 'explore' && activeTab !== 'saved') {
      setActiveTab('explore');
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Toggle Save
  const handleToggleSave = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Compare
  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  // Calculate scored properties
  const scoredProperties = useMemo(() => {
    return filterAndScoreProperties(HDB_PROPERTIES, filters);
  }, [filters]);

  // Saved properties list
  const savedProperties = useMemo(() => {
    return scoredProperties.filter((p) => savedPropertyIds.includes(p.id));
  }, [scoredProperties, savedPropertyIds]);

  // Compare properties list
  const compareProperties = useMemo(() => {
    return scoredProperties.filter((p) => compareIds.includes(p.id));
  }, [scoredProperties, compareIds]);

  const displayList = activeTab === 'saved' ? savedProperties : scoredProperties;

  const hasActiveFilters = 
    filters.towns.length > 0 ||
    filters.regions.length > 0 ||
    filters.flatTypes.length > 0 ||
    filters.maxPrice < 1500000 ||
    filters.minAreaSqm > 40 ||
    filters.maxMrtDistanceMins < 20 ||
    filters.minLeaseYears > 50 ||
    filters.storeyCategories.length > 0 ||
    filters.cornerUnitOnly ||
    filters.unblockedViewOnly ||
    filters.noWestSunOnly ||
    Boolean(filters.query);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-900">
      {/* 1. Header (Strict Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPropertyIds.length}
        compareCount={compareIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onToggleFilters={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* TAB 1: EXPLORE & AVAILABLE FLATS */}
        {activeTab === 'explore' && (
          <div>
            {/* Hero Search Area */}
            <HeroSearch
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              totalMatchingCount={scoredProperties.length}
              onOpenQuiz={() => setIsQuizOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Desktop Filter Sidebar (4 cols) */}
                <div className="hidden lg:block lg:col-span-4 sticky top-20">
                  <FilterSidebar
                    filters={filters}
                    onUpdateFilters={handleUpdateFilters}
                    onResetFilters={handleResetFilters}
                    totalCount={scoredProperties.length}
                  />
                </div>

                {/* Mobile Filter Drawer */}
                {isMobileFiltersOpen && (
                  <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
                    <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-6 flex flex-col justify-between">
                      <FilterSidebar
                        filters={filters}
                        onUpdateFilters={handleUpdateFilters}
                        onResetFilters={handleResetFilters}
                        totalCount={scoredProperties.length}
                      />
                      <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="mt-4 w-full py-3 bg-slate-900 text-white font-semibold rounded-lg text-sm"
                      >
                        Apply & View {scoredProperties.length} Results
                      </button>
                    </div>
                  </div>
                )}

                {/* Results Section (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Controls Bar: Sort + View Mode */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">Sort by:</span>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleUpdateFilters({ sortBy: e.target.value as any })}
                        className="text-xs font-semibold text-slate-900 bg-transparent border-0 focus:outline-none cursor-pointer"
                      >
                        <option value="recommended">Best Recommendation Match</option>
                        <option value="price-asc">Price: Lowest First</option>
                        <option value="price-desc">Price: Highest First</option>
                        <option value="area-desc">Area: Largest First</option>
                        <option value="psf-asc">Value: Lowest S$ PSF</option>
                        <option value="lease-desc">Lease: Longest Remaining</option>
                        <option value="mrt-asc">Transit: Nearest to MRT</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                            viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Grid View"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('table')}
                          className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                            viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Table View"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filter Badges */}
                  {hasActiveFilters && (
                    <div className="flex items-center flex-wrap gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">Active filters:</span>
                      {filters.towns.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-medium flex items-center gap-1">
                          {t}
                          <button onClick={() => handleUpdateFilters({ towns: filters.towns.filter((item) => item !== t) })} className="hover:text-rose-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {filters.flatTypes.map((ft) => (
                        <span key={ft} className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-medium flex items-center gap-1">
                          {ft}
                          <button onClick={() => handleUpdateFilters({ flatTypes: filters.flatTypes.filter((item) => item !== ft) })} className="hover:text-rose-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {filters.maxPrice < 1500000 && (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-medium flex items-center gap-1">
                          &le; S${(filters.maxPrice / 1000).toLocaleString()}k
                          <button onClick={() => handleUpdateFilters({ maxPrice: 1500000 })} className="hover:text-rose-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.maxMrtDistanceMins < 20 && (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-medium flex items-center gap-1">
                          MRT &lt; {filters.maxMrtDistanceMins} min
                          <button onClick={() => handleUpdateFilters({ maxMrtDistanceMins: 20 })} className="hover:text-rose-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.unblockedViewOnly && (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-medium flex items-center gap-1">
                          Unblocked View
                          <button onClick={() => handleUpdateFilters({ unblockedViewOnly: false })} className="hover:text-rose-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      <button
                        onClick={handleResetFilters}
                        className="text-rose-600 hover:text-rose-700 font-medium ml-1 cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  {/* Property Listings Output */}
                  {displayList.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Filter className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        No HDB flats match your specific filter criteria
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Try broadening your price ceiling, selecting additional towns, or removing specific storey and orientation filters.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {displayList.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isSaved={savedPropertyIds.includes(property.id)}
                          isCompared={compareIds.includes(property.id)}
                          onToggleSave={handleToggleSave}
                          onToggleCompare={handleToggleCompare}
                          onSelectProperty={(p) => setSelectedProperty(p)}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Table / Dense View */
                    <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-3">Property</th>
                            <th className="p-3">Town / Type</th>
                            <th className="p-3">Price / PSF</th>
                            <th className="p-3">Area</th>
                            <th className="p-3">MRT</th>
                            <th className="p-3">Match</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {displayList.map((prop) => (
                            <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3">
                                <button
                                  onClick={() => setSelectedProperty(prop)}
                                  className="font-semibold text-slate-900 hover:text-rose-600 text-left cursor-pointer"
                                >
                                  {prop.title}
                                </button>
                                <div className="text-[11px] text-slate-400">
                                  Blk {prop.block} {prop.streetName}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-medium text-slate-800">{prop.town}</div>
                                <div className="text-[11px] text-slate-400">{prop.flatType}</div>
                              </td>
                              <td className="p-3 font-mono">
                                <div className="font-bold text-slate-900">S${prop.askingPrice.toLocaleString()}</div>
                                <div className="text-[11px] text-slate-400">S${prop.psf} psf</div>
                              </td>
                              <td className="p-3 font-mono">
                                <div>{prop.floorAreaSqm} sqm</div>
                                <div className="text-[11px] text-slate-400">({prop.floorAreaSqft} sqft)</div>
                              </td>
                              <td className="p-3">
                                <div>{prop.mrtWalkMins} min</div>
                                <div className="text-[11px] text-slate-400">{prop.mrtStation.split(' ')[0]}</div>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-slate-900 tabular-nums">{prop.matchScore}%</span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => setSelectedProperty(prop)}
                                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-[11px] cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ESTATE MAP & BENCHMARKS */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SingaporeTownMap
              onSelectTown={(town) => {
                handleUpdateFilters({ towns: [town] });
                setActiveTab('explore');
              }}
              onSelectRegion={(region: SingaporeRegion) => {
                handleUpdateFilters({ regions: [region], towns: [] });
                setActiveTab('explore');
              }}
              onSelectProperty={(p) => {
                const found = scoredProperties.find(item => item.id === p.id) || (p as ScoredProperty);
                setSelectedProperty(found);
              }}
            />
          </div>
        )}

        {/* TAB 3: CPF GRANT & LOAN PLANNER */}
        {activeTab === 'grants' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <GrantCalculatorView
              onApplyBudgetFilter={(maxBudget) => {
                handleUpdateFilters({ maxPrice: maxBudget });
                setActiveTab('explore');
              }}
            />
          </div>
        )}

        {/* TAB 4: SAVED SHORTLIST */}
        {activeTab === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Your Shortlisted Flats ({savedProperties.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Saved units are preserved in your browser for easy re-visiting and comparison.
                </p>
              </div>

              {savedProperties.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCompareIds(savedPropertyIds.slice(0, 4));
                      setIsCompareOpen(true);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Compare All Shortlisted
                  </button>
                  <button
                    onClick={() => setSavedPropertyIds([])}
                    className="text-xs text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    Clear Shortlist
                  </button>
                </div>
              )}
            </div>

            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No properties bookmarked yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the bookmark icon on any flat card to add it to your personal shortlist.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Explore Available Flats
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isSaved={true}
                    isCompared={compareIds.includes(property.id)}
                    onToggleSave={handleToggleSave}
                    onToggleCompare={handleToggleCompare}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Compare Drawer Bar if items are selected */}
      {compareIds.length > 0 && !isCompareOpen && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-5 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-3 hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer border border-slate-700"
          >
            <span>Compare Selected ({compareIds.length}/4)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        isCompared={selectedProperty ? compareIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
        onToggleCompare={handleToggleCompare}
      />

      {/* Comparison Modal */}
      {isCompareOpen && (
        <ComparisonModal
          properties={compareProperties}
          onClose={() => setIsCompareOpen(false)}
          onRemoveItem={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
          onClearAll={() => setCompareIds([])}
          onSelectProperty={(p) => {
            setIsCompareOpen(false);
            setSelectedProperty(p);
          }}
        />
      )}

      {/* Recommendation Quiz Modal */}
      <RecommendationQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onApplyQuizFilters={(quizFilters) => {
          handleUpdateFilters(quizFilters);
          setActiveTab('explore');
        }}
      />

      {/* Footer */}
      <Footer
        onSelectTown={(town) => {
          handleUpdateFilters({ towns: [town] });
          setActiveTab('explore');
        }}
      />
    </div>
  );
}
