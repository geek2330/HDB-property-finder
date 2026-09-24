import React, { useState } from 'react';
import { MapPin, ArrowRight, Home } from 'lucide-react';
import { TOWN_BENCHMARKS, TownBenchmark } from '../data/hdbProperties';
import { SingaporeRegion } from '../types/property';

interface SingaporeTownMapProps {
  onSelectTown: (town: string) => void;
  onSelectRegion: (region: SingaporeRegion) => void;
}

export const SingaporeTownMap: React.FC<SingaporeTownMapProps> = ({
  onSelectTown,
  onSelectRegion,
}) => {
  const [selectedTown, setSelectedTown] = useState<TownBenchmark>(TOWN_BENCHMARKS[0]);
  const [activeRegionFilter, setActiveRegionFilter] = useState<SingaporeRegion | 'All'>('All');

  const filteredTowns = activeRegionFilter === 'All'
    ? TOWN_BENCHMARKS
    : TOWN_BENCHMARKS.filter((t) => t.region === activeRegionFilter);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-rose-600 uppercase">
            Singapore HDB Geospatial Overview
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Explore Estates & Resale Price Benchmarks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Compare median prices, MRT connectivity, and active listings across Singapore's key residential towns.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto overflow-x-auto max-w-full">
          {(['All', 'Central', 'East', 'North', 'North-East', 'West'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setActiveRegionFilter(reg)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeRegionFilter === reg
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map Representation */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span className="font-semibold text-slate-700">Singapore Islandwide Interactive Map</span>
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Click any town to inspect price benchmarks</span>
            </span>
          </div>

          {/* SVG Map of Singapore simplified regional polygons with town markers */}
          <div className="relative w-full aspect-[16/9] flex items-center justify-center">
            <svg
              viewBox="0 0 800 450"
              className="w-full h-full drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Singapore Island Outline simplified aesthetic */}
              <path
                d="M 80 200 C 100 160 160 140 240 130 C 320 120 400 110 480 120 C 560 130 640 140 710 170 C 740 185 750 210 730 230 C 700 260 620 280 540 290 C 460 300 380 320 300 315 C 220 310 140 290 90 260 C 70 245 70 220 80 200 Z"
                className="fill-slate-200/80 stroke-slate-300 stroke-2"
              />
              {/* Sentosa island */}
              <ellipse cx="360" cy="350" rx="45" ry="12" className="fill-slate-200/80 stroke-slate-300 stroke-1" />
              {/* Pulau Ubin & Tekong */}
              <ellipse cx="640" cy="110" rx="35" ry="14" className="fill-slate-200/60 stroke-slate-300 stroke-1" />
              <ellipse cx="720" cy="115" rx="30" ry="16" className="fill-slate-200/60 stroke-slate-300 stroke-1" />

              {/* Waterway / Kallang Basin accent line */}
              <path d="M 440 220 Q 420 260 410 300" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
            </svg>

            {/* Interactive Town Marker Buttons positioned roughly on the map */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { town: 'Woodlands', x: '42%', y: '26%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Woodlands') },
                { town: 'Punggol', x: '63%', y: '30%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Punggol') },
                { town: 'Sengkang', x: '60%', y: '40%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Sengkang') },
                { town: 'Bishan', x: '46%', y: '44%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Bishan') },
                { town: 'Toa Payoh', x: '48%', y: '52%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Toa Payoh') },
                { town: 'Tampines', x: '72%', y: '46%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Tampines') },
                { town: 'Bedok', x: '68%', y: '56%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Bedok') },
                { town: 'Kallang/Whampoa', x: '53%', y: '60%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Kallang/Whampoa') },
                { town: 'Queenstown', x: '38%', y: '66%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Queenstown') },
                { town: 'Bukit Merah', x: '44%', y: '70%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Bukit Merah') },
                { town: 'Clementi', x: '30%', y: '56%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Clementi') },
                { town: 'Jurong East', x: '24%', y: '50%', benchmark: TOWN_BENCHMARKS.find(b => b.town === 'Jurong East') },
              ].map((pin) => {
                if (!pin.benchmark) return null;
                const isSelected = selectedTown.town === pin.town;
                return (
                  <button
                    key={pin.town}
                    type="button"
                    onClick={() => setSelectedTown(pin.benchmark!)}
                    style={{ left: pin.x, top: pin.y }}
                    className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-110 z-20'
                        : 'bg-white/95 text-slate-800 border-slate-300 hover:border-slate-500 shadow-xs hover:scale-105 z-10'
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-rose-600'}`} />
                    <span>{pin.town}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>MRT & Expressways connected</span>
            <span>Data updated for 2026 Resale Transactions</span>
          </div>
        </div>

        {/* Selected Town Detail Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              {selectedTown.region} Region
            </span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {selectedTown.activeListingsCount} listings
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900">{selectedTown.town}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {selectedTown.highlight}
            </p>
          </div>

          {/* Metrics */}
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Median 4-Room Resale</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  S${selectedTown.medianPrice4Room.toLocaleString()}
                </div>
              </div>
              <Home className="w-5 h-5 text-slate-400" />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Median Price PSF</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  S${selectedTown.medianPsf} psf
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500">Benchmark</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-500">Key Transit Hub</div>
              <div className="text-xs font-semibold text-slate-800 mt-0.5">
                {selectedTown.popularMrt}
              </div>
            </div>
          </div>

          {/* Action to Filter by this Town */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => onSelectTown(selectedTown.town)}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Available Flats in {selectedTown.town}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectRegion(selectedTown.region)}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Filter All {selectedTown.region} Region Flats
            </button>
          </div>
        </div>
      </div>

      {/* Grid of all towns benchmark table */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Town Resale Reference Matrix
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
          {filteredTowns.map((t) => (
            <button
              key={t.town}
              onClick={() => setSelectedTown(t)}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                selectedTown.town === t.town
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{t.town}</span>
                <span className={`text-[10px] ${selectedTown.town === t.town ? 'text-slate-300' : 'text-slate-400'}`}>
                  {t.region}
                </span>
              </div>
              <div className="mt-1 font-mono text-[11px] tabular-nums">
                Med. S${(t.medianPrice4Room / 1000).toLocaleString()}k · S${t.medianPsf} psf
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
