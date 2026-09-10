'use client';
import { useState, useEffect, useCallback } from 'react';
import { LandParcel, LandFilter } from '@/lib/types';
import { LandCard } from '@/components/land/LandCard';
import { PROVINCES } from '@/lib/constants';
import { Search, MapPin, Loader2, SlidersHorizontal, X } from 'lucide-react';

export default function ExplorePage() {
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LandFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);

  const fetchParcels = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.province) params.set('province', filters.province);
      if (filters.district) params.set('district', filters.district);
      if (filters.landUse) params.set('landUse', filters.landUse);
      if (filters.ownershipType) params.set('ownershipType', filters.ownershipType);
      if (filters.floodRisk) params.set('floodRisk', filters.floodRisk);
      if (searchQuery) params.set('q', searchQuery);
      const res = await fetch(`/api/land?${params.toString()}`);
      const data = await res.json();
      if (data.success) setParcels(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => { fetchParcels(); }, [fetchParcels]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search land parcels..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <select
            value={filters.province ?? ''}
            onChange={e => setFilters(p => ({ ...p, province: e.target.value as any || undefined }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Provinces</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filters.landUse ?? ''}
            onChange={e => setFilters(p => ({ ...p, landUse: e.target.value as any || undefined }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Land Use</option>
            {['Residential', 'Agricultural', 'Commercial', 'Industrial', 'Mixed'].map(u => <option key={u}>{u}</option>)}
          </select>
          <select
            value={filters.ownershipType ?? ''}
            onChange={e => setFilters(p => ({ ...p, ownershipType: e.target.value as any || undefined }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Ownership</option>
            {['Private', 'Guthi', 'Government', 'Institutional', 'Unknown'].map(o => <option key={o}>{o}</option>)}
          </select>
          {Object.values(filters).some(Boolean) && (
            <button onClick={() => setFilters({})} className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
          <div className="text-sm text-slate-500 ml-auto">
            {loading ? 'Loading...' : `${parcels.length} parcels`}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* List panel */}
        <div className="w-full md:w-96 border-r border-slate-200 overflow-y-auto bg-slate-50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">Sample land parcels — all fictional data</span>
            </div>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : (
              <div className="space-y-3">
                {parcels.map(p => <LandCard key={p.id} parcel={p} />)}
              </div>
            )}
          </div>
        </div>

        {/* Map panel */}
        <div className="hidden md:flex flex-1 bg-slate-200 items-center justify-center">
          <div className="text-center text-slate-500 p-8">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Interactive Map</h3>
            <p className="text-slate-500 max-w-sm">
              The Leaflet map will display sample land parcels here. Click any parcel in the list
              to highlight it on the map. Future GIS layers: roads, rivers, flood zones, facilities.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-left max-w-xs mx-auto">
              {parcels.slice(0, 6).map(p => (
                <div key={p.id} className="bg-white rounded-lg p-2 border border-slate-200">
                  <div className="font-medium text-slate-800 text-xs truncate">{p.municipality}</div>
                  <div className="text-slate-500">{p.latitude.toFixed(3)}°N, {p.longitude.toFixed(3)}°E</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
