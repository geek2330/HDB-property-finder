import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Train, Home, DollarSign, Maximize2, Calendar, Layers, Sun } from 'lucide-react';
import { FlatType, PropertyFilters, SingaporeRegion, StoreyCategory } from '../types/property';
import { TOWN_BENCHMARKS } from '../data/hdbProperties';

interface FilterSidebarProps {
  filters: PropertyFilters;
  onUpdateFilters: (updates: Partial<PropertyFilters>) => void;
  onResetFilters: () => void;
  totalCount: number;
}

const ALL_FLAT_TYPES: FlatType[] = ['2-Room', '3-Room', '4-Room', '5-Room', 'Executive', 'Maisonette'];
const ALL_REGIONS: SingaporeRegion[] = ['Central', 'East', 'North', 'North-East', 'West'];
const ALL_STOREY_CATEGORIES: StoreyCategory[] = ['Low (01-04)', 'Mid (05-10)', 'High (11-20)', 'Sky (21+)'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalCount,
}) => {
  const isSqm = filters.unitMeasurement === 'sqm';

  const toggleTown = (town: string) => {
    const exists = filters.towns.includes(town);
    const newTowns = exists
      ? filters.towns.filter((t) => t !== town)
      : [...filters.towns, town];
    onUpdateFilters({ towns: newTowns });
  };

  const toggleRegion = (region: SingaporeRegion) => {
    const exists = filters.regions.includes(region);
    const newRegions = exists
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region];
    onUpdateFilters({ regions: newRegions });
  };

  const toggleFlatType = (type: FlatType) => {
    const exists = filters.flatTypes.includes(type);
    const newTypes = exists
      ? filters.flatTypes.filter((t) => t !== type)
      : [...filters.flatTypes, type];
    onUpdateFilters({ flatTypes: newTypes });
  };

  const toggleStorey = (storey: StoreyCategory) => {
    const exists = filters.storeyCategories.includes(storey);
    const newStoreys = exists
      ? filters.storeyCategories.filter((s) => s !== storey)
      : [...filters.storeyCategories, storey];
    onUpdateFilters({ storeyCategories: newStoreys });
  };

  return (
    <aside className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
      {/* Header with Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Search Filters</h2>
          <span className="text-xs text-slate-500 tabular-nums">({totalCount} matches)</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            <span>Price Range (SGD)</span>
          </label>
          <span className="text-xs font-mono text-slate-600 tabular-nums">
            S${(filters.minPrice / 1000).toLocaleString()}k - {filters.maxPrice >= 1500000 ? 'Any' : `S$${(filters.maxPrice / 1000).toLocaleString()}k`}
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={300000}
            max={1500000}
            step={25000}
            value={filters.maxPrice}
            onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
            className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex items-center gap-1 text-[11px] text-slate-500 justify-between">
            <span>S$300k</span>
            <span>S$600k</span>
            <span>S$900k</span>
            <span>S$1.2M</span>
            <span>S$1.5M+</span>
          </div>
        </div>

        {/* Quick Price Buttons */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[
            { label: '< S$650k', max: 650000 },
            { label: '< S$850k', max: 850000 },
            { label: '< S$1.1M', max: 1100000 },
          ].map((tier) => (
            <button
              key={tier.label}
              type="button"
              onClick={() => onUpdateFilters({ maxPrice: tier.max })}
              className={`py-1 px-2 text-[11px] font-medium rounded border text-center transition-colors cursor-pointer ${
                filters.maxPrice === tier.max
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Floor Area & Unit Toggle */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Floor Area</span>
          </label>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-[10px]">
            <button
              type="button"
              onClick={() => onUpdateFilters({ unitMeasurement: 'sqm' })}
              className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                isSqm ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              sqm
            </button>
            <button
              type="button"
              onClick={() => onUpdateFilters({ unitMeasurement: 'sqft' })}
              className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                !isSqm ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              sqft
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-600">
          <span>
            Min {isSqm ? `${filters.minAreaSqm} sqm` : `${Math.round(filters.minAreaSqm * 10.764)} sqft`}
          </span>
          <span>
            Max {isSqm ? `${filters.maxAreaSqm} sqm` : `${Math.round(filters.maxAreaSqm * 10.764)} sqft`}
          </span>
        </div>

        <input
          type="range"
          min={40}
          max={150}
          step={5}
          value={filters.minAreaSqm}
          onChange={(e) => onUpdateFilters({ minAreaSqm: Number(e.target.value) })}
          className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>40 sqm (2-Room)</span>
          <span>90 sqm (4-Room)</span>
          <span>150 sqm (Exec)</span>
        </div>
      </div>

      {/* 3. Flat Type Selection */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span>Flat Types</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_FLAT_TYPES.map((type) => {
            const isSelected = filters.flatTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleFlatType(type)}
                className={`py-1.5 px-2.5 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{type}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Region & Popular Towns */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900">Singapore Regions</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_REGIONS.map((region) => {
            const isSelected = filters.regions.includes(region);
            return (
              <button
                key={region}
                type="button"
                onClick={() => toggleRegion(region)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <label className="text-xs font-bold text-slate-900 block mb-2">Specific Towns</label>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {TOWN_BENCHMARKS.map((t) => {
              const isSelected = filters.towns.includes(t.town);
              return (
                <button
                  key={t.town}
                  type="button"
                  onClick={() => toggleTown(t.town)}
                  className={`w-full px-2 py-1 text-xs rounded text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.town}</span>
                  <span className="text-[11px] text-slate-400 tabular-nums">({t.activeListingsCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. MRT Proximity */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-slate-500" />
            <span>Walk to MRT</span>
          </label>
          <span className="text-xs font-mono text-slate-600">
            {filters.maxMrtDistanceMins >= 20 ? 'Any distance' : `< ${filters.maxMrtDistanceMins} mins`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: '< 5 min', mins: 5 },
            { label: '< 8 min', mins: 8 },
            { label: '< 12 min', mins: 12 },
            { label: 'Any', mins: 20 },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => onUpdateFilters({ maxMrtDistanceMins: option.mins })}
              className={`py-1 text-[11px] font-medium rounded border text-center transition-colors cursor-pointer ${
                filters.maxMrtDistanceMins === option.mins
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Remaining Lease */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Remaining Lease</span>
          </label>
          <span className="text-xs font-mono text-slate-600">
            {filters.minLeaseYears <= 50 ? 'Any (>50y)' : `> ${filters.minLeaseYears} years`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: 'Any', years: 50 },
            { label: '> 70y', years: 70 },
            { label: '> 80y', years: 80 },
            { label: '> 90y', years: 90 },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onUpdateFilters({ minLeaseYears: opt.years })}
              className={`py-1 text-[11px] font-medium rounded border text-center transition-colors cursor-pointer ${
                filters.minLeaseYears === opt.years
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Storey Level */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Floor Level</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_STOREY_CATEGORIES.map((storey) => {
            const isSelected = filters.storeyCategories.includes(storey);
            return (
              <button
                key={storey}
                type="button"
                onClick={() => toggleStorey(storey)}
                className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {storey}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Orientation & Premium Features */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-900">Unit Features</label>
        
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.unblockedViewOnly}
            onChange={(e) => onUpdateFilters({ unblockedViewOnly: e.target.checked })}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
          <span>Unblocked View only</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.cornerUnitOnly}
            onChange={(e) => onUpdateFilters({ cornerUnitOnly: e.target.checked })}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
          <span>Corner Unit only (Privacy)</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.noWestSunOnly}
            onChange={(e) => onUpdateFilters({ noWestSunOnly: e.target.checked })}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
          <span className="flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-500" />
            <span>North-South Facing (No west sun)</span>
          </span>
        </label>
      </div>
    </aside>
  );
};
