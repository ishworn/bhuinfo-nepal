'use client';
import { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { DataBadge } from '@/components/shared/DataBadge';
import { formatNPR } from '@/lib/utils/area';
import { estimatePrice, formatFactorChange, getFactorLabel } from '@/lib/services/price.service';
import { LandParcel, Province, LandUse, RoadType, FloodRisk, Slope } from '@/lib/types';

export default function EstimatorPage() {
  const [municipality, setMunicipality] = useState('Kathmandu Metropolitan');
  const [province, setProvince] = useState<Province>('Bagmati');
  const [landUse, setLandUse] = useState<LandUse>('Residential');
  const [roadType, setRoadType] = useState<RoadType>('Blacktopped');
  const [roadWidth, setRoadWidth] = useState(16);
  const [roadDistance, setRoadDistance] = useState(10);
  const [floodRisk, setFloodRisk] = useState<FloodRisk>('Low');
  const slope: Slope = 'Flat';
  const district = 'Kathmandu';
  const [electricity, setElectricity] = useState(true);
  const [water, setWater] = useState(true);
  const [drainage, setDrainage] = useState(true);
  const [internet, setInternet] = useState(true);
  const [aana, setAana] = useState(4);

  const mockParcel: LandParcel = {
    id: 'estimator-mock', kittaNumber: '', province, district, municipality,
    ward: 1, area: aana, areaUnit: 'Aana', areaInAana: aana, areaInSqft: aana * 342.25, areaInSqm: aana * 31.8,
    landUse, ownershipType: 'Private', latitude: 0, longitude: 0,
    roadDistance, roadWidth, roadType, riverDistance: 1000, floodRisk,
    slope, terrain: 'Hill', electricity, water, drainage, internet,
    nearbyFacilities: [], availabilityStatus: 'For Sale', description: '',
    dataStatus: 'Sample', dataSource: '', lastUpdated: '', createdAt: '', tags: [],
  };

  const estimate = estimatePrice(mockParcel);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-purple-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Price Estimator</h1>
        <DataBadge status="Estimated" />
      </div>
      <p className="text-slate-600 mb-6">Rule-based land price estimation. <strong>Not an official valuation.</strong></p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">Results are estimates using sample data and rule-based calculations. Actual market values may differ significantly. Always get a professional valuation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 mb-2">Land Parameters</h2>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Province</label>
            <select value={province} onChange={e => setProvince(e.target.value as Province)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {['Bagmati', 'Koshi', 'Madhesh', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Municipality</label>
            <select value={municipality} onChange={e => setMunicipality(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {['Kathmandu Metropolitan', 'Lalitpur Metropolitan', 'Bhaktapur', 'Pokhara Metropolitan', 'Biratnagar Metropolitan', 'Bharatpur Metropolitan', 'Butwal', 'Birendranagar', 'Dhulikhel', 'Dharan', 'Hetauda'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Land Use</label>
              <select value={landUse} onChange={e => setLandUse(e.target.value as LandUse)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {['Residential', 'Commercial', 'Industrial', 'Mixed', 'Agricultural'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Area (Aana)</label>
              <input type="number" min={1} value={aana} onChange={e => setAana(parseInt(e.target.value) || 1)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Road Type</label>
              <select value={roadType} onChange={e => setRoadType(e.target.value as RoadType)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {['Highway', 'Blacktopped', 'Gravel', 'Trail', 'None'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Flood Risk</label>
              <select value={floodRisk} onChange={e => setFloodRisk(e.target.value as FloodRisk)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {['None', 'Low', 'Moderate', 'High', 'Very High'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Road Width (ft)</label>
              <input type="number" min={0} value={roadWidth} onChange={e => setRoadWidth(parseInt(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Distance to Road (m)</label>
              <input type="number" min={0} value={roadDistance} onChange={e => setRoadDistance(parseInt(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-2">Infrastructure</label>
            <div className="grid grid-cols-2 gap-2">
              {[['Electricity', electricity, setElectricity], ['Water', water, setWater], ['Drainage', drainage, setDrainage], ['Internet', internet, setInternet]].map(([label, val, setter]) => (
                <label key={label as string} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={val as boolean} onChange={e => (setter as (v: boolean) => void)(e.target.checked)} className="w-4 h-4 text-emerald-600" />
                  {label as string}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div>
          {estimate.available ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="bg-emerald-50 rounded-xl p-5">
                <div className="text-xs text-emerald-600 font-semibold mb-1">Estimated Total Value</div>
                <div className="text-3xl font-bold text-emerald-700">{formatNPR(estimate.estimatedTotal)}</div>
                <div className="text-sm text-emerald-600 mt-1">Range: {formatNPR(estimate.estimatedRangeLow)} — {formatNPR(estimate.estimatedRangeHigh)}</div>
                <div className="text-xs text-slate-500 mt-1">{formatNPR(estimate.estimatedPricePerAana)} per Aana • Confidence: {estimate.confidence}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase">Calculation Breakdown</div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Base Price</span>
                  <span className="font-medium">{formatNPR(estimate.basePrice)}/Aana</span>
                </div>
                {Object.entries(estimate.factors).filter(([k]) => k !== 'basePrice').map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-600">{getFactorLabel(key)}</span>
                    <span className={`font-medium ${
                      (val as number) > 1 ? 'text-green-600' : (val as number) < 1 ? 'text-red-600' : 'text-slate-500'
                    }`}>{formatFactorChange(val as number)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-700">Estimate Not Available</p>
                  <p className="text-sm text-slate-500 mt-1">{estimate.unavailableReason}</p>
                </div>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3">Estimated — not an official valuation. For accurate valuation, consult a certified property assessor.</p>
        </div>
      </div>
    </div>
  );
}
