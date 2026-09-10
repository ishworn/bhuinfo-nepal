import { PriceEstimate } from '@/lib/types';
import { DataBadge } from './DataBadge';
import { formatNPR } from '@/lib/utils/area';
import { formatFactorChange, getFactorLabel } from '@/lib/services/price.service';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface PriceCardProps {
  estimate: PriceEstimate;
}

function FactorRow({ label, factor }: { label: string; factor: number }) {
  const change = Math.round((factor - 1) * 100);
  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const color = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-slate-500';
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`flex items-center gap-1 font-medium ${color}`}>
        <Icon className="w-3.5 h-3.5" />
        {formatFactorChange(factor)}
      </span>
    </div>
  );
}

export function PriceCard({ estimate }: PriceCardProps) {
  if (!estimate.available) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Estimated Land Value</h3>
          <DataBadge status="Estimated" />
        </div>
        <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-700">Price Estimate Unavailable</p>
            <p className="text-sm text-slate-500 mt-1">{estimate.unavailableReason}</p>
          </div>
        </div>
      </div>
    );
  }

  const factors = estimate.factors;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">Estimated Land Value</h3>
          <p className="text-xs text-slate-500">Estimated — not an official valuation</p>
        </div>
        <DataBadge status="Estimated" />
      </div>

      <div className="bg-emerald-50 rounded-lg p-4 mb-4">
        <div className="text-2xl font-bold text-emerald-700">
          {formatNPR(estimate.estimatedTotal)}
        </div>
        <div className="text-sm text-emerald-600 mt-0.5">
          Range: {formatNPR(estimate.estimatedRangeLow)} — {formatNPR(estimate.estimatedRangeHigh)}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {formatNPR(estimate.estimatedPricePerAana)} per Aana • Confidence: {estimate.confidence}
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price Factors</div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Base Price</span>
          <span className="font-medium text-slate-800">{formatNPR(estimate.basePrice)}/Aana</span>
        </div>
        {Object.entries(factors)
          .filter(([k]) => k !== 'basePrice')
          .map(([key, value]) => (
            <FactorRow key={key} label={getFactorLabel(key)} factor={value as number} />
          ))}
      </div>

      <p className="text-xs text-slate-400 mt-3 border-t pt-3">
        Estimated using rule-based engine. Market conditions, legal status, and other factors may significantly affect actual value.
      </p>
    </div>
  );
}
