import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ArrowLeft, Check, Users, DollarSign, Target, MapPin } from 'lucide-react';
import { PropertyFilters, SingaporeRegion, FlatType } from '../types/property';

interface RecommendationQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyQuizFilters: (filters: Partial<PropertyFilters>) => void;
}

export const RecommendationQuizModal: React.FC<RecommendationQuizModalProps> = ({
  isOpen,
  onClose,
  onApplyQuizFilters,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  // Quiz selections
  const [household, setHousehold] = useState<'couple' | 'family' | 'multigen' | 'single'>('couple');
  const [budgetTier, setBudgetTier] = useState<number>(850000);
  const [topPriority, setTopPriority] = useState<'mrt' | 'space' | 'lease' | 'school'>('mrt');
  const [preferredRegion, setPreferredRegion] = useState<SingaporeRegion | 'any'>('any');

  const handleFinish = () => {
    const filterUpdates: Partial<PropertyFilters> = {
      maxPrice: budgetTier,
    };

    // Set flat types based on household
    if (household === 'couple') {
      filterUpdates.flatTypes = ['3-Room', '4-Room'];
    } else if (household === 'family') {
      filterUpdates.flatTypes = ['4-Room', '5-Room'];
    } else if (household === 'multigen') {
      filterUpdates.flatTypes = ['5-Room', 'Executive', 'Maisonette'];
      filterUpdates.minAreaSqm = 110;
    } else if (household === 'single') {
      filterUpdates.flatTypes = ['2-Room', '3-Room'];
    }

    // Set priorities
    if (topPriority === 'mrt') {
      filterUpdates.maxMrtDistanceMins = 5;
    } else if (topPriority === 'space') {
      filterUpdates.minAreaSqm = 100;
    } else if (topPriority === 'lease') {
      filterUpdates.minLeaseYears = 85;
    }

    // Set region
    if (preferredRegion !== 'any') {
      filterUpdates.regions = [preferredRegion];
    } else {
      filterUpdates.regions = [];
    }

    onApplyQuizFilters(filterUpdates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Find My Ideal HDB Flat</h3>
              <p className="text-xs text-slate-500">Step {step} of 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1 rounded-full my-5 overflow-hidden">
          <div
            className="bg-slate-900 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* STEP 1: Household Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Users className="w-4 h-4 text-rose-600" />
              <span>Who will be living in this home?</span>
            </div>

            <div className="space-y-2">
              {[
                { id: 'couple', label: 'Couple / Newlyweds', desc: 'Ideal for 3-Room or 4-Room flats with modern styling' },
                { id: 'family', label: 'Growing Family with Kids', desc: 'Spacious 4-Room or 5-Room near top primary schools' },
                { id: 'multigen', label: 'Multi-Generational Living', desc: 'Jumbo 5-Room, Executive, or 2-Storey Maisonette' },
                { id: 'single', label: 'Single Professional', desc: 'Cozy 2-Room or 3-Room flat with easy city access' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHousehold(item.id as any)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    household === item.id
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">{item.label}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                  {household === item.id && (
                    <span className="p-1 bg-slate-900 text-white rounded-full mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Budget Range */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <DollarSign className="w-4 h-4 text-rose-600" />
              <span>What is your maximum target purchase budget?</span>
            </div>

            <div className="space-y-2">
              {[
                { max: 650000, label: 'Under S$650,000 (Value & Starter)', desc: 'Affordable entry into vibrant estates like Punggol, Sengkang, Woodlands, Bedok' },
                { max: 850000, label: 'S$650,000 - S$850,000 (Popular Sweet Spot)', desc: 'Spacious 4-room and 5-room flats in Bishan, Clementi, Tampines' },
                { max: 1100000, label: 'S$850,000 - S$1.1M (Prime Mature Estate)', desc: 'High-floor Dawson, Natura Loft DBSS, city-fringe Queenstown & Kallang' },
                { max: 1500000, label: 'Above S$1.1M (Trophy & Sky Apartments)', desc: 'Pinnacle@Duxton 40+ floors, Executive Maisonettes, central heritage lofts' },
              ].map((tier) => (
                <button
                  key={tier.max}
                  type="button"
                  onClick={() => setBudgetTier(tier.max)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    budgetTier === tier.max
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">{tier.label}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{tier.desc}</div>
                  </div>
                  {budgetTier === tier.max && (
                    <span className="p-1 bg-slate-900 text-white rounded-full mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Top Priority */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Target className="w-4 h-4 text-rose-600" />
              <span>What is the single most important factor for you?</span>
            </div>

            <div className="space-y-2">
              {[
                { id: 'mrt', label: 'Direct MRT Proximity', desc: 'Under 5 minutes sheltered walk to MRT station for effortless commutes' },
                { id: 'space', label: 'Maximum Floor Area & Living Space', desc: 'Huge living hall, squarish bedrooms, footprint over 100-140 sqm' },
                { id: 'lease', label: 'Long Remaining Lease (>85 Years)', desc: 'Fresh MOP / young blocks for capital preservation and CPF flexibility' },
                { id: 'school', label: 'Top Primary School Proximity', desc: 'Within 1km balloting priority of Catholic High, Nan Hua, Poi Ching, etc.' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTopPriority(item.id as any)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    topPriority === item.id
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">{item.label}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                  {topPriority === item.id && (
                    <span className="p-1 bg-slate-900 text-white rounded-full mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Preferred Region */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Which region do you prefer to live in?</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'any', label: 'Flexible / Any Region', desc: 'Show top recommendations nationwide' },
                { id: 'Central', label: 'Central', desc: 'Bishan, Queenstown, Toa Payoh, Bukit Merah' },
                { id: 'East', label: 'East', desc: 'Tampines, Bedok, Pasir Ris' },
                { id: 'North-East', label: 'North-East', desc: 'Punggol, Sengkang, Hougang' },
                { id: 'West', label: 'West', desc: 'Clementi, Jurong East' },
                { id: 'North', label: 'North', desc: 'Woodlands, Yishun, Sembawang' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreferredRegion(item.id as any)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    preferredRegion === item.id
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm">{item.label}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Show My Recommended Flats</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
