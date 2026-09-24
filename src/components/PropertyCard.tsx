import React from 'react';
import { Bookmark, Scale, ArrowUpRight, Sparkles, Train, Compass } from 'lucide-react';
import { ScoredProperty } from '../types/property';

interface PropertyCardProps {
  property: ScoredProperty;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectProperty: (property: ScoredProperty) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
}) => {
  const priceSavings = property.townMedianPrice - property.askingPrice;

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-400 hover:shadow-md transition-all flex flex-col">
      {/* 1. Imagery Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Match Fit Floating Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-slate-900 border border-slate-200/80 shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="tabular-nums">{property.matchScore}% Match</span>
        </div>

        {/* Action buttons on Image */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {/* Compare Checkbox Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property.id);
            }}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            className={`p-2 rounded-md backdrop-blur-md transition-colors cursor-pointer border ${
              isCompared
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white/90 text-slate-700 border-slate-200/80 hover:bg-white'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Bookmark / Save Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
            className={`p-2 rounded-md backdrop-blur-md transition-colors cursor-pointer border ${
              isSaved
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white/90 text-slate-700 border-slate-200/80 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Walk to MRT overlay indicator */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
          <Train className="w-3 h-3 text-emerald-400" />
          <span>{property.mrtWalkMins} min to {property.mrtStation.split(' ')[0]}</span>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Unboxed clean metadata line */}
        <div className="text-xs text-slate-500 flex items-center flex-wrap gap-1.5 leading-none">
          <span className="font-semibold text-slate-800">{property.town}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{property.flatType}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{property.floorLevelText}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{property.remainingLeaseYears}y lease</span>
        </div>

        {/* Property Title */}
        <div>
          <button
            onClick={() => onSelectProperty(property)}
            className="text-left font-semibold text-slate-900 text-base hover:text-rose-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </button>
          <p className="text-xs text-slate-500 mt-0.5">
            Blk {property.block} {property.streetName}
          </p>
        </div>

        {/* Price & PSF row */}
        <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
          <div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              S${property.askingPrice.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-mono tabular-nums">
              S${property.psf} psf · {property.floorAreaSqm} sqm ({property.floorAreaSqft} sqft)
            </div>
          </div>

          {priceSavings > 0 && (
            <div className="text-right">
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                -S${Math.round(priceSavings / 1000)}k vs median
              </span>
            </div>
          )}
        </div>

        {/* Why Recommended for you (2 items max) */}
        <div className="bg-slate-50 rounded-lg p-2.5 space-y-1">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Why recommended:
          </div>
          {property.matchReasons.slice(0, 2).map((reason, idx) => (
            <div key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
              <span className="text-slate-400 mt-0.5 leading-none">▪</span>
              <span className="line-clamp-1">{reason}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>{property.facing} facing</span>
          </div>

          <button
            onClick={() => onSelectProperty(property)}
            className="text-xs font-semibold text-slate-900 hover:text-rose-600 flex items-center gap-1 group/btn cursor-pointer py-1"
          >
            <span>View Full Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
