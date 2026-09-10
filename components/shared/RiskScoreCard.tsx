import { RiskScore } from '@/lib/types';
import { DataBadge } from './DataBadge';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface RiskScoreCardProps {
  riskScore: RiskScore;
}

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full risk-meter ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function RiskScoreCard({ riskScore }: RiskScoreCardProps) {
  const score = riskScore.overall;
  const color = score >= 75 ? 'text-green-600' : score >= 55 ? 'text-yellow-600' : score >= 35 ? 'text-orange-600' : 'text-red-600';
  const bgColor = score >= 75 ? 'bg-green-600' : score >= 55 ? 'bg-yellow-500' : score >= 35 ? 'bg-orange-500' : 'bg-red-600';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">Information & Risk Score</h3>
          <DataBadge status="Sample" className="mt-1" />
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${color}`}>{score}</div>
          <div className="text-xs text-slate-500">/100</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full risk-meter ${bgColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">Lower Score = Higher Risk</span>
          <span className={`font-semibold ${color}`}>{riskScore.label}</span>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-3">
        <ScoreBar label="Road Access" value={riskScore.road} max={20} color="bg-blue-500" />
        <ScoreBar label="Infrastructure" value={riskScore.infrastructure} max={15} color="bg-indigo-500" />
        <ScoreBar label="Location" value={riskScore.location} max={10} color="bg-purple-500" />
        <ScoreBar label="Flood Safety" value={riskScore.flood} max={25} color="bg-teal-500" />
        <ScoreBar label="River Safety" value={riskScore.riverProximity} max={15} color="bg-cyan-500" />
        <ScoreBar label="Slope Safety" value={riskScore.slope} max={15} color="bg-emerald-500" />
      </div>

      <p className="text-xs text-slate-400 mt-3 border-t pt-3">
        Indicative assessment based on available sample data. Not a legal safety guarantee.
      </p>
    </div>
  );
}
