'use client';

import { useState, useEffect, useCallback } from 'react';
import { LandParcel, LandFilter, Province, LandUse, OwnershipType } from '@/lib/types';
import { LandCard } from '@/components/land/LandCard';
import { PROVINCES } from '@/lib/constants';
import MapWrapper from '@/components/map/MapWrapper';
import { Search, MapPin, Loader2, X, Map as MapIcon, List } from 'lucide-react';

export default function ExplorePage() {
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LandFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'split' | 'list' | 'map'>('split');

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
      if (data.success) {
        setParcels(data.data);
        setSelectedParcelId((prev) => prev ?? (data.data[0]?.id || null));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchParcels();
  }, [fetchParcels]);

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top filter bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Kitta, district, municipality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <select
            value={filters.province ?? ''}
            onChange={(e) => setFilters((p) => ({ ...p, province: (e.target.value as Province) || undefined }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Provinces</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={filters.landUse ?? ''}
            onChange={(e) => setFilters((p) => ({ ...p, landUse: (e.target.value as LandUse) || undefined }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Land Use</option>
            {['Residential', 'Agricultural', 'Commercial', 'Industrial', 'Mixed'].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <select
            value={filters.ownershipType ?? ''}
            onChange={(e) => setFilters((p) => ({ ...p, ownershipType: (e.target.value as OwnershipType) || undefined }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Ownership</option>
            {['Private', 'Guthi', 'Government', 'Institutional', 'Organization', 'Unknown'].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          {Object.values(filters).some(Boolean) && (
            <button
              onClick={() => setFilters({})}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 font-medium px-2 py-1 rounded"
            >
              <X className="w-4 h-4" /> Reset
            </button>
          )}

          {/* Mobile view toggle */}
          <div className="md:hidden flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setMobileView('list')}
              className={`p-1.5 rounded text-xs font-medium ${mobileView === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`p-1.5 rounded text-xs font-medium ${mobileView === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              title="Map view"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-500 ml-auto hidden sm:block">
            {loading ? 'Loading...' : `${parcels.length} sample parcels`}
          </div>
        </div>
      </div>

      {/* Content layout */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Parcel Cards */}
        <div
          className={`w-full md:w-[420px] border-r border-slate-200 overflow-y-auto bg-slate-50 flex-shrink-0 ${
            mobileView === 'map' ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Click parcel to locate on map
              </span>
              <span className="text-amber-600 font-medium">All data fictional</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <p className="text-sm">Loading land parcels...</p>
              </div>
            ) : parcels.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="font-semibold text-slate-700">No matching parcels</p>
                <p className="text-xs mt-1">Try relaxing the search filters</p>
              </div>
            ) : (
              parcels.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedParcelId(p.id)}
                  className={`cursor-pointer transition-all rounded-xl ${
                    selectedParcelId === p.id
                      ? 'ring-2 ring-emerald-500 ring-offset-2'
                      : 'hover:shadow-sm'
                  }`}
                >
                  <LandCard parcel={p} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Interactive Leaflet Map */}
        <div
          className={`flex-1 relative bg-slate-100 p-2 md:p-3 h-full overflow-hidden ${
            mobileView === 'list' ? 'hidden md:block' : 'block'
          }`}
        >
          <MapWrapper
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onParcelSelect={(p) => setSelectedParcelId(p.id)}
            center={selectedParcel ? [selectedParcel.latitude, selectedParcel.longitude] : [28.0, 84.5]}
            zoom={selectedParcel ? 13 : 7}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
