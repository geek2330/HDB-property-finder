import React from 'react';
import { X, Check, Trash2, ArrowRight } from 'lucide-react';
import { ScoredProperty } from '../types/property';

interface ComparisonModalProps {
  properties: ScoredProperty[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onSelectProperty: (property: ScoredProperty) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  properties,
  onClose,
  onRemoveItem,
  onClearAll,
  onSelectProperty,
}) => {
  if (properties.length === 0) return null;

  // Compute best values for visual highlighting
  const minPrice = Math.min(...properties.map((p) => p.askingPrice));
  const minPsf = Math.min(...properties.map((p) => p.psf));
  const maxArea = Math.max(...properties.map((p) => p.floorAreaSqm));
  const maxLease = Math.max(...properties.map((p) => p.remainingLeaseYears));
  const minMrtWalk = Math.min(...properties.map((p) => p.mrtWalkMins));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Side-by-Side Property Comparison ({properties.length} / 4)
            </h2>
            <p className="text-xs text-slate-500">
              Green highlight indicates the most advantageous metric across selected flats.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto flex-1 p-6">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 font-semibold text-slate-500 w-44 bg-slate-50 rounded-tl-lg">
                  Property Listing
                </th>
                {properties.map((prop) => (
                  <th key={prop.id} className="p-3 w-64 align-top">
                    <div className="space-y-2">
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => onRemoveItem(prop.id)}
                          className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-white rounded text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-slate-900 line-clamp-2 text-sm">
                        {prop.title}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Blk {prop.block} {prop.streetName}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Asking Price */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Asking Price</td>
                {properties.map((p) => {
                  const isBest = p.askingPrice === minPrice;
                  return (
                    <td key={p.id} className={`p-3 font-mono text-sm font-bold ${isBest ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-900'}`}>
                      S${p.askingPrice.toLocaleString()}
                      {isBest && <span className="block text-[10px] font-sans font-medium text-emerald-700">Lowest Price</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Price PSF */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Price Per Sqft (PSF)</td>
                {properties.map((p) => {
                  const isBest = p.psf === minPsf;
                  return (
                    <td key={p.id} className={`p-3 font-mono font-medium ${isBest ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-700'}`}>
                      S${p.psf} psf
                      {isBest && <span className="block text-[10px] font-sans font-medium text-emerald-700">Lowest PSF</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Floor Area */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Floor Area</td>
                {properties.map((p) => {
                  const isBest = p.floorAreaSqm === maxArea;
                  return (
                    <td key={p.id} className={`p-3 font-mono ${isBest ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'}`}>
                      {p.floorAreaSqm} sqm ({p.floorAreaSqft} sqft)
                      {isBest && <span className="block text-[10px] font-sans font-medium text-emerald-700">Largest Space</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Flat Type & Model */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Flat Type & Model</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 text-slate-800">
                    <span className="font-semibold">{p.flatType}</span> ({p.flatModel})
                  </td>
                ))}
              </tr>

              {/* Town & Region */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Town & Region</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 text-slate-800">
                    {p.town} ({p.region})
                  </td>
                ))}
              </tr>

              {/* Walk to MRT */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">MRT Distance</td>
                {properties.map((p) => {
                  const isBest = p.mrtWalkMins === minMrtWalk;
                  return (
                    <td key={p.id} className={`p-3 ${isBest ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-800'}`}>
                      {p.mrtWalkMins} mins walk to {p.mrtStation}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Lines: {p.mrtLines.join(', ')}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Remaining Lease */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Remaining Lease</td>
                {properties.map((p) => {
                  const isBest = p.remainingLeaseYears === maxLease;
                  return (
                    <td key={p.id} className={`p-3 ${isBest ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-800'}`}>
                      {p.remainingLeaseYears} years {p.remainingLeaseMonths} mos (Built {p.builtYear})
                      {isBest && <span className="block text-[10px] font-sans font-medium text-emerald-700">Longest Lease</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Storey Level */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Floor Level & Facing</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 text-slate-800">
                    <div>{p.floorLevelText}</div>
                    <div className="text-[11px] text-slate-500">{p.facing} facing · {p.noWestSun ? 'No West Sun' : 'Normal Sun'}</div>
                  </td>
                ))}
              </tr>

              {/* Primary School (1km) */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Primary Schools (&le; 1km)</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 text-slate-800">
                    {p.primarySchoolsNearby.slice(0, 2).map((s, i) => (
                      <div key={i} className="text-[11px]">
                        {s.name} ({s.distanceKm}km)
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Recommendation Score */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Recommendation Fit</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    <span className="font-bold text-slate-900 tabular-nums text-sm">
                      {p.matchScore}% Match
                    </span>
                    <ul className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                      {p.matchReasons.slice(0, 2).map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">Action</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty(p);
                      }}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                    >
                      <span>View Unit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
