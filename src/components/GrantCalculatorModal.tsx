import React, { useState } from 'react';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import { calculateBSD } from '../utils/calculator';

interface GrantCalculatorProps {
  onApplyBudgetFilter: (maxPrice: number) => void;
}

export const GrantCalculatorView: React.FC<GrantCalculatorProps> = ({
  onApplyBudgetFilter,
}) => {
  const [householdIncome, setHouseholdIncome] = useState<number>(7500);
  const [applicantType, setApplicantType] = useState<'couple' | 'family' | 'single'>('couple');
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(true);
  const [liveNearParents, setLiveNearParents] = useState<boolean>(true);
  const [flatType, setFlatType] = useState<'3-Room' | '4-Room' | '5-Room'>('4-Room');
  const [loanType, setLoanType] = useState<'hdb' | 'bank'>('hdb');
  const [cpfSavings, setCpfSavings] = useState<number>(120000);
  const [cashSavings, setCashSavings] = useState<number>(50000);

  // 1. Grant calculations
  let ehg = 0;
  let familyGrant = 0;
  let proximityGrant = 0;

  if (isFirstTimer) {
    if (applicantType === 'single') {
      if (householdIncome <= 1500) ehg = 40000;
      else if (householdIncome <= 3000) ehg = 25000;
      else if (householdIncome <= 4500) ehg = 10000;
      else ehg = 0;

      if (householdIncome <= 7000) {
        familyGrant = flatType === '5-Room' ? 25000 : 40000;
      }
      if (liveNearParents) proximityGrant = 15000;
    } else {
      if (householdIncome <= 1500) ehg = 80000;
      else if (householdIncome <= 3000) ehg = 65000;
      else if (householdIncome <= 5000) ehg = 45000;
      else if (householdIncome <= 7000) ehg = 25000;
      else if (householdIncome <= 9000) ehg = 10000;
      else ehg = 0;

      if (householdIncome <= 14000) {
        familyGrant = flatType === '5-Room' ? 50000 : 80000;
      }
      if (liveNearParents) proximityGrant = 30000;
    }
  }

  const totalGrants = ehg + familyGrant + proximityGrant;

  // 2. Max Loan under 30% MSR
  const maxMonthlyRepayment = Math.round(householdIncome * 0.30);
  const interestRate = loanType === 'hdb' ? 0.026 : 0.029;
  const tenureMonths = 25 * 12;
  const monthlyRate = interestRate / 12;

  // Loan Amount based on monthly repayment: P = M * ((1+r)^n - 1) / (r * (1+r)^n)
  const maxLoanCapacity = Math.round(
    (maxMonthlyRepayment * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))
  );

  // Maximum Flat Price = (Max Loan / LTV) OR based on Total Downpayment available + Loan
  const ltv = loanType === 'hdb' ? 0.80 : 0.75;
  const maxPriceByLoan = Math.round(maxLoanCapacity / ltv);
  const totalFundsAvailable = maxLoanCapacity + cpfSavings + cashSavings + totalGrants;
  const estimatedMaxPurchaseBudget = Math.min(maxPriceByLoan, totalFundsAvailable);

  const sampleBsd = calculateBSD(estimatedMaxPurchaseBudget);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-rose-600 mb-1">
          <Calculator className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Official HDB Financial Planner</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          CPF Housing Grant & Affordability Estimator
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Accurately calculate your eligible government housing grants under the 2026 Enhanced CPF Housing Grant (EHG) framework and assess your maximum purchasing power within the 30% Mortgage Servicing Ratio (MSR).
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Applicant & Income Profile
          </h3>

          {/* Household Income */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span>Gross Household Monthly Income</span>
              <span className="font-mono text-slate-900 text-sm font-bold">
                S${householdIncome.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={16000}
              step={250}
              value={householdIncome}
              onChange={(e) => setHouseholdIncome(Number(e.target.value))}
              className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>S$2,000</span>
              <span>S$7,000</span>
              <span>S$12,000</span>
              <span>S$16,000+</span>
            </div>
          </div>

          {/* Applicant Type */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'couple', label: 'Married Couple' },
              { id: 'family', label: 'Family with Child' },
              { id: 'single', label: 'Single (&ge; 35)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setApplicantType(t.id as any)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                  applicantType === t.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Flat Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Flat Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['3-Room', '4-Room', '5-Room'] as const).map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setFlatType(ft)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                    flatType === ft
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-200 space-y-2.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isFirstTimer}
                onChange={(e) => setIsFirstTimer(e.target.checked)}
                className="rounded border-slate-300 text-slate-900"
              />
              <span>First-Timer Applicant (Eligible for EHG & Family Grant)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={liveNearParents}
                onChange={(e) => setLiveNearParents(e.target.checked)}
                className="rounded border-slate-300 text-slate-900"
              />
              <span>Live with or within 4km of Parents / Married Child (PHG)</span>
            </label>
          </div>

          {/* Available Savings for Downpayment */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Combined CPF OA Savings
              </label>
              <div className="flex items-center">
                <span className="px-2.5 py-1.5 bg-slate-200 text-xs rounded-l font-mono text-slate-600">S$</span>
                <input
                  type="number"
                  step={5000}
                  value={cpfSavings}
                  onChange={(e) => setCpfSavings(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-r px-2 py-1.5 font-mono text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Liquid Cash Savings
              </label>
              <div className="flex items-center">
                <span className="px-2.5 py-1.5 bg-slate-200 text-xs rounded-l font-mono text-slate-600">S$</span>
                <input
                  type="number"
                  step={5000}
                  value={cashSavings}
                  onChange={(e) => setCashSavings(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-r px-2 py-1.5 font-mono text-xs text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Grant Summary Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Total Government CPF Housing Grants
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
                S${totalGrants.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-xs border-t border-emerald-200 pt-3 text-emerald-950">
              <div className="flex justify-between">
                <span>Enhanced CPF Housing Grant (EHG):</span>
                <span className="font-mono font-bold">+S${ehg.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>CPF Family / Singles Housing Grant:</span>
                <span className="font-mono font-bold">+S${familyGrant.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Proximity Housing Grant (PHG):</span>
                <span className="font-mono font-bold">+S${proximityGrant.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-800">
              Grants are disbursed directly to your CPF Ordinary Account to offset the purchase price and reduce loan commitments.
            </p>
          </div>

          {/* Purchasing Power & Loan Breakdown */}
          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Recommended Max Purchase Budget
                </span>
                <span className="text-3xl font-bold font-mono text-white tabular-nums">
                  S${estimatedMaxPurchaseBudget.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => onApplyBudgetFilter(estimatedMaxPurchaseBudget)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>Filter Flats &le; Budget</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-800 pt-4 text-slate-300">
              <div className="flex justify-between">
                <span>Max Housing Loan (Capped at 30% MSR):</span>
                <span className="font-mono text-white">S${maxLoanCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Monthly Mortgage Payment (30% MSR):</span>
                <span className="font-mono text-rose-400 font-bold">S${maxMonthlyRepayment.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Buyer’s Stamp Duty (IRAS BSD):</span>
                <span className="font-mono text-white">S${sampleBsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Tenure / Rate:</span>
                <span className="text-white">25 Years @ {interestRate * 100}% p.a.</span>
              </div>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Smart HDB Resale Buying Rules:</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-slate-600">
              <li>Up to 100% of your monthly mortgage payment can be serviced with your monthly CPF OA contributions.</li>
              <li>A remaining flat lease of &ge; 20 years and covering the youngest buyer to age 95 is required for maximum CPF usage.</li>
              <li>Always obtain an HDB Flat Eligibility (HFE) letter before issuing an Option to Purchase (OTP).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
