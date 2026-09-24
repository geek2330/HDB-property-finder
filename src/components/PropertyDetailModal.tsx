import React, { useState } from 'react';
import { 
  X, Bookmark, Scale, Train, School, ShoppingBag, 
  TreePine, CheckCircle2, 
  Compass, ShieldCheck, Calculator, ArrowRight, Share2, CalendarCheck
} from 'lucide-react';
import { ScoredProperty } from '../types/property';
import { calculateHDBFinances } from '../utils/calculator';

interface PropertyDetailModalProps {
  property: ScoredProperty | null;
  onClose: () => void;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
}) => {
  if (!property) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'amenities' | 'floorplan'>('overview');

  // Interactive mortgage parameters
  const [monthlyIncome, setMonthlyIncome] = useState(8500);
  const [isFirstTimer, setIsFirstTimer] = useState(true);
  const [buyerType, setBuyerType] = useState<'couple' | 'family' | 'single'>('couple');
  const [liveNearParents, setLiveNearParents] = useState(true);
  const [loanType, setLoanType] = useState<'hdb' | 'bank'>('hdb');
  const [loanTenure, setLoanTenure] = useState(25);

  // Viewing scheduler state
  const [viewingDate, setViewingDate] = useState('2026-09-28');
  const [viewingTime, setViewingTime] = useState('14:00');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [viewingBooked, setViewingBooked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const financeResults = calculateHDBFinances({
    purchasePrice: property.askingPrice,
    monthlyHouseholdIncome: monthlyIncome,
    isFirstTimer,
    buyerType,
    liveNearParents,
    loanType,
    loanTenureYears: loanTenure,
    flatType: property.flatType,
  });

  const handleBookViewing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) return;
    setViewingBooked(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Header Navigation */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-slate-900">{property.town}</span>
              <span>·</span>
              <span>{property.flatType} ({property.flatModel})</span>
              <span>·</span>
              <span>Blk {property.block} {property.streetName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleCompare(property.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isCompared
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from shortlist' : 'Save property'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {copiedLink && (
            <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg text-center border border-emerald-200">
              Listing link copied to clipboard!
            </div>
          )}

          {/* Photo Gallery & Thumbnail Selector */}
          <div className="space-y-2">
            <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={property.images[activeImageIdx] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-semibold tabular-nums">
                {property.matchScore}% Match for your search
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs text-slate-500">Asking Price</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                S${property.askingPrice.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                S${property.psf} psf
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Floor Area</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                {property.floorAreaSqm} sqm
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {property.floorAreaSqft} sqft
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Remaining Lease</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                {property.remainingLeaseYears}y {property.remainingLeaseMonths}m
              </div>
              <div className="text-[11px] text-slate-500">
                Built in {property.builtYear}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Floor Level</div>
              <div className="text-xl font-bold text-slate-900">
                {property.floorLevelText}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Compass className="w-3 h-3 text-slate-400" />
                <span>{property.facing} facing</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Overview & Highlights
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calculator' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-rose-600" />
              <span>CPF Grants & Mortgage</span>
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'amenities' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Transit & Schools (1km)
            </button>
            <button
              onClick={() => setActiveTab('floorplan')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'floorplan' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Floor Plan Layout
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Property Description
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {property.description}
                </p>
              </div>

              {/* Key Features & Highlights */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Key Unit Highlights
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {property.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EIP Ethnic Quota Eligibility */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    HDB Ethnic Integration Policy (EIP) & SPR Quota
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Chinese: Eligible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Malay: Eligible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${property.eipEligibility.indianOther ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>Indian / Others: {property.eipEligibility.indianOther ? 'Eligible' : 'Full for Month'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 text-xs text-rose-900">
                <span className="font-bold">HDB Resale Financial Breakdown:</span> Live computation of eligible CPF Housing Grants (EHG + Family Grant + PHG), downpayment requirements, and estimated monthly mortgage payments.
              </div>

              {/* Calculator Inputs */}
              <div className="grid sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gross Monthly Household Income
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 bg-slate-200 rounded-l-md font-mono text-slate-600">S$</span>
                    <input
                      type="number"
                      value={monthlyIncome}
                      step={500}
                      onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded-r-md px-2 py-2 font-mono text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Buyer Profile
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as 'couple' | 'family' | 'single')}
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="couple">Married Couple (First-Timers)</option>
                    <option value="family">Family with Child (First-Timers)</option>
                    <option value="single">Single Citizen (&ge; 35 yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Financing Choice
                  </label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value as 'hdb' | 'bank')}
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="hdb">HDB Concessionary Loan (2.6% · 80% LTV)</option>
                    <option value="bank">Commercial Bank Loan (2.9% · 75% LTV)</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 col-span-full pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={liveNearParents}
                      onChange={(e) => setLiveNearParents(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900"
                    />
                    <span>Live with or within 4km of Parents (PHG Grant)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isFirstTimer}
                      onChange={(e) => setIsFirstTimer(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900"
                    />
                    <span>First-Timer Applicant</span>
                  </label>
                </div>
              </div>

              {/* Calculator Output Matrix */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Eligible Grants */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Eligible CPF Housing Grants
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Enhanced CPF Housing Grant (EHG):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        +S${financeResults.eligibleGrants.ehg.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>CPF Family / Singles Grant:</span>
                      <span className="font-mono font-semibold text-slate-900">
                        +S${financeResults.eligibleGrants.familyGrant.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Proximity Housing Grant (PHG):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        +S${financeResults.eligibleGrants.proximityGrant.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-700 text-sm">
                      <span>Total Government Grants:</span>
                      <span className="font-mono">
                        S${financeResults.eligibleGrants.totalGrants.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Installment & Outlay */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Monthly Loan Repayment
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Net Purchase Price (After grants):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        S${financeResults.netPurchasePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Max Loan Amount ({financeResults.maxLtvPercentage * 100}% LTV):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        S${financeResults.maxLoanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Buyer’s Stamp Duty (IRAS BSD):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        S${financeResults.buyersStampDuty.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Estimated Monthly Installment:</span>
                      <span className="font-mono text-rose-600">
                        S${financeResults.monthlyInstallment.toLocaleString()} / mo
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Can be fully serviced via CPF Ordinary Account (OA) contributions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AMENITIES & SCHOOLS */}
          {activeTab === 'amenities' && (
            <div className="space-y-6">
              {/* Primary Schools within 1km Priority */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <School className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Primary Schools Within 1km - 2km (Priority Balloting Distance)
                  </h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {property.primarySchoolsNearby.map((school, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="font-semibold text-slate-900 text-xs">{school.name}</div>
                      <div className="text-slate-500 text-[11px] mt-1 flex items-center justify-between">
                        <span>Distance: {school.distanceKm} km</span>
                        {school.popularRanking && (
                          <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                            Phase 2C Top
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit & Amenities */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Train className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Public Transport & Neighborhood Essentials
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {property.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center gap-2 text-xs">
                        {item.type === 'MRT' && <Train className="w-4 h-4 text-emerald-600" />}
                        {item.type === 'Mall' && <ShoppingBag className="w-4 h-4 text-rose-600" />}
                        {item.type === 'Park' && <TreePine className="w-4 h-4 text-green-600" />}
                        {item.type === 'Hawker' && <ShoppingBag className="w-4 h-4 text-amber-600" />}
                        <span className="font-medium text-slate-800">{item.name}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono tabular-nums">{item.walkMinutes} min walk</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FLOOR PLAN LAYOUT */}
          {activeTab === 'floorplan' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base">Architectural Layout Schematic</h3>
                    <p className="text-slate-400 text-xs">
                      {property.flatType} ({property.flatModel}) · {property.floorAreaSqm} sqm / {property.floorAreaSqft} sqft
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-400">
                    <div>{property.floorPlanLayout.bedrooms} Bedrooms</div>
                    <div>{property.floorPlanLayout.bathrooms} Bathrooms</div>
                  </div>
                </div>

                {/* 2D Blueprint Schematic Box */}
                <div className="border border-slate-700 rounded-lg p-6 bg-slate-950 font-mono text-xs text-slate-300">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="border border-dashed border-slate-700 p-4 rounded bg-slate-900/50">
                      <div className="text-slate-400 text-[10px]">BEDROOM 2</div>
                      <div className="font-bold mt-1 text-white">3.4m × 3.0m</div>
                    </div>
                    <div className="border border-dashed border-slate-700 p-4 rounded bg-slate-900/50">
                      <div className="text-slate-400 text-[10px]">MASTER BEDROOM</div>
                      <div className="font-bold mt-1 text-white">4.2m × 3.6m</div>
                      <div className="text-[10px] text-emerald-400 mt-1">En-Suite Bath</div>
                    </div>
                    <div className="border border-dashed border-slate-700 p-4 rounded bg-slate-900/50">
                      <div className="text-slate-400 text-[10px]">BEDROOM 3</div>
                      <div className="font-bold mt-1 text-white">3.2m × 3.0m</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center mt-3">
                    <div className="col-span-2 border border-slate-600 p-6 rounded bg-slate-900/80">
                      <div className="text-slate-400 text-[10px]">LIVING & DINING HALL</div>
                      <div className="font-bold text-sm mt-1 text-white">6.8m × 4.2m</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {property.facing} Orientation · No West Sun
                      </div>
                    </div>
                    <div className="border border-dashed border-slate-700 p-4 rounded bg-slate-900/50 flex flex-col justify-between">
                      <div>
                        <div className="text-slate-400 text-[10px]">KITCHEN & YARD</div>
                        <div className="font-bold mt-1 text-white">3.5m × 2.6m</div>
                      </div>
                      <div className="text-[10px] text-amber-400 mt-2">Bomb Shelter Included</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>*Dimensions represent standard HDB architect guidelines for this block model.</span>
                  <span className="text-white font-medium">HDB Approved Squarish Layout</span>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Private Viewing Section */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-rose-600" />
              <span>Schedule an In-Person Property Viewing</span>
            </h3>

            {viewingBooked ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-emerald-900">
                  Viewing Request Confirmed!
                </div>
                <p className="text-xs text-emerald-700">
                  We have reserved your slot for {viewingDate} at {viewingTime}. An HDB-accredited specialist will contact {userPhone} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookViewing} className="grid sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Rachel Tan"
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. 9123 4567"
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={viewingDate}
                    onChange={(e) => setViewingDate(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Request Viewing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
