'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LandParcel } from '@/lib/types';
import { formatNPR } from '@/lib/utils/area';
import { getRiskBgColor } from '@/lib/services/risk.service';
import { DataBadge } from '@/components/shared/DataBadge';
import { CheckCircle, XCircle, Loader2, GitCompareArrows } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') ?? '';
  const ids = idsParam.split(',').filter(Boolean).slice(0, 3);
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const results: Array<{ success: boolean; data: LandParcel }> = await Promise.all(
        ids.map((id) => fetch(`/api/land/${id}`).then((r) => r.json()))
      );
      setParcels(results.filter((r) => r.success).map((r) => r.data));
      setLoading(false);
    }
    if (ids.length > 0) {
      fetchAll();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam]);

  const rows: Array<{ label: string; getValue: (p: LandParcel) => React.ReactNode }> = [
    { label: 'Kitta Number', getValue: p => <span className="font-mono text-xs">{p.kittaNumber}</span> },
    { label: 'Location', getValue: p => `${p.municipality}, ${p.district}` },
    { label: 'Province', getValue: p => p.province },
    { label: 'Ward', getValue: p => p.ward },
    { label: 'Area', getValue: p => `${p.area} ${p.areaUnit}` },
    { label: 'Land Use', getValue: p => p.landUse },
    { label: 'Ownership', getValue: p => (
      <span className={p.ownershipType !== 'Private' ? 'text-amber-700 font-medium' : ''}>
        {p.ownershipType}
      </span>
    )},
    { label: 'Risk Score', getValue: p => p.riskScore ? (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRiskBgColor(p.riskScore.overall)}`}>
        {p.riskScore.overall}/100
      </span>
    ) : 'N/A' },
    { label: 'Flood Risk', getValue: p => p.floodRisk },
    { label: 'River Distance', getValue: p => `${p.riverDistance}m` },
    { label: 'Road Type', getValue: p => p.roadType },
    { label: 'Road Width', getValue: p => `${p.roadWidth} ft` },
    { label: 'Slope', getValue: p => p.slope },
    { label: 'Electricity', getValue: p => p.electricity ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-400" /> },
    { label: 'Water', getValue: p => p.water ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-400" /> },
    { label: 'Drainage', getValue: p => p.drainage ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-400" /> },
    { label: 'Internet', getValue: p => p.internet ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-400" /> },
    { label: 'Availability', getValue: p => p.availabilityStatus },
    { label: 'Listed Price', getValue: p => p.listingPrice ? formatNPR(p.listingPrice) : '—' },
    { label: 'Est. Price', getValue: p => p.priceEstimate?.available ? formatNPR(p.priceEstimate.estimatedTotal) : 'N/A' },
    { label: 'Nearby Facilities', getValue: p => `${p.nearbyFacilities.length} listed` },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  if (parcels.length === 0) {
    return (
      <div className="text-center py-20">
        <GitCompareArrows className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-600 font-medium">No parcels selected for comparison</p>
        <p className="text-slate-500 text-sm mt-1">Go to Listings and select 2-3 parcels to compare</p>
        <Link href="/listings" className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Browse Listings</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Compare Land Parcels</h1>
        <DataBadge status="Sample" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 bg-slate-50 border border-slate-200 w-40 text-sm text-slate-600 font-medium">Attribute</th>
              {parcels.map(p => (
                <th key={p.id} className="px-4 py-3 bg-emerald-50 border border-slate-200 text-sm">
                  <div className="font-semibold text-slate-900">{p.municipality}</div>
                  <div className="text-xs font-mono text-slate-500">{p.kittaNumber}</div>
                  <Link href={`/land/${p.id}`} className="text-xs text-emerald-600 hover:underline mt-1 block">View Details</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, getValue }, ri) => (
              <tr key={label} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-2.5 border border-slate-200 text-sm text-slate-600 font-medium">{label}</td>
                {parcels.map(p => (
                  <td key={p.id} className="px-4 py-2.5 border border-slate-200 text-sm text-slate-800 text-center">
                    {getValue(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-4">All comparison data is fictional sample data for demonstration purposes.</p>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
