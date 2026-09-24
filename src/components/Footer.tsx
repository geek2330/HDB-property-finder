import React from 'react';
import { TOWN_BENCHMARKS } from '../data/hdbProperties';

interface FooterProps {
  onSelectTown: (town: string) => void;
  onOpenHealthCheck?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTown, onOpenHealthCheck }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <span className="font-display text-lg font-bold text-white tracking-tight">
              HDB Nest
            </span>
            <p className="text-slate-400 leading-relaxed text-xs">
              Singapore’s data-driven public housing recommendation portal. Benchmarking resale transactions, CPF Housing Grants, and transit proximity across all 24 HDB towns.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Compliant with HDB Resale & CPF Housing Board policy frameworks.
            </div>
          </div>

          {/* Col 2: Popular Towns */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Popular Mature Towns
            </h4>
            <ul className="space-y-2 text-xs">
              {TOWN_BENCHMARKS.slice(0, 5).map((t) => (
                <li key={t.town}>
                  <button
                    onClick={() => {
                      onSelectTown(t.town);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    HDB Flats in {t.town}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Emerging & Non-Mature Estates */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              High-Growth Estates
            </h4>
            <ul className="space-y-2 text-xs">
              {TOWN_BENCHMARKS.slice(5, 10).map((t) => (
                <li key={t.town}>
                  <button
                    onClick={() => {
                      onSelectTown(t.town);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    HDB Flats in {t.town}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Buyer Resources */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Buyer Guides & Financing
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Enhanced CPF Housing Grant (EHG) Guide</li>
              <li>HDB Flat Eligibility (HFE) Application Steps</li>
              <li>30% Mortgage Servicing Ratio (MSR) Explainer</li>
              <li>Ethnic Integration Policy (EIP) Checker</li>
              <li>Primary 1 Registration (1km / 2km Priority)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 HDB Nest Singapore. All property data modeled after official resale transaction statistics.
          </div>
          <div className="flex items-center gap-4">
            {onOpenHealthCheck && (
              <button
                onClick={onOpenHealthCheck}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>API Health Check</span>
              </button>
            )}
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Housing Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
