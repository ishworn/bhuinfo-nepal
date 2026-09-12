'use client';
import { useState, useEffect } from 'react';
import { LandParcel } from '@/lib/types';
import { getRiskBgColor } from '@/lib/services/risk.service';
import { DataBadge } from '@/components/shared/DataBadge';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RiskPage() {
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/land').then(r => r.json()).then(d => {
      if (d.success) setParcels(d.data);
    }).finally(() => setLoading(false));
  }, []);

  const floodCounts: Record<string, number> = {};
  const provinceCounts: Record<string, { high: number; total: number }> = {};
  for (const p of parcels) {
    floodCounts[p.floodRisk] = (floodCounts[p.floodRisk] ?? 0) + 1;
    if (!provinceCounts[p.province]) provinceCounts[p.province] = { high: 0, total: 0 };
    provinceCounts[p.province].total++;
    if (['High', 'Very High'].includes(p.floodRisk)) provinceCounts[p.province].high++;
  }

  const sorted = [...parcels].sort((a, b) => (a.riskScore?.overall ?? 100) - (b.riskScore?.overall ?? 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Risk Analysis</h1>
          <DataBadge status="Sample" className="mt-1" />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Risk scores shown here are indicative assessments based on fictional sample data.
            They are NOT official safety certifications or government risk assessments.
            Always conduct professional site evaluation before any land decision.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="space-y-8">
          {/* Flood risk summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Flood Risk Distribution (Sample Data)</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['None', 'Low', 'Moderate', 'High', 'Very High'].map(risk => {
                const count = floodCounts[risk] ?? 0;
                const pct = parcels.length > 0 ? Math.round((count / parcels.length) * 100) : 0;
                const colors: Record<string, string> = { None: 'bg-green-100 text-green-800', Low: 'bg-blue-100 text-blue-800', Moderate: 'bg-yellow-100 text-yellow-800', High: 'bg-orange-100 text-orange-800', 'Very High': 'bg-red-100 text-red-800' };
                return (
                  <div key={risk} className={`rounded-lg p-4 text-center ${colors[risk]}`}>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs font-medium mt-1">{risk}</div>
                    <div className="text-xs opacity-75">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highest risk parcels */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Parcels by Risk Score (Lowest First)</h2>
            <div className="space-y-2">
              {sorted.slice(0, 15).map(p => (
                <Link key={p.id} href={`/land/${p.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full w-16 text-center flex-shrink-0 ${getRiskBgColor(p.riskScore?.overall ?? 50)}`}>
                    {p.riskScore?.overall ?? '?'}/100
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{p.municipality}, {p.district}</div>
                    <div className="text-xs text-slate-500">{p.kittaNumber} • {p.landUse} • Flood: {p.floodRisk}</div>
                  </div>
                  <div className="text-xs text-emerald-600 font-medium flex-shrink-0">View →</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Province risk */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">High Flood Risk by Province</h2>
            <div className="space-y-3">
              {Object.entries(provinceCounts).map(([province, { high, total }]) => {
                const pct = total > 0 ? Math.round((high / total) * 100) : 0;
                return (
                  <div key={province}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{province}</span>
                      <span className="text-slate-500">{high}/{total} high risk ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct > 50 ? 'bg-red-500' : pct > 20 ? 'bg-orange-400' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
