'use client';
import { useState, useEffect, useCallback } from 'react';
import { LandParcel, LandFilter, SortOption, Province, LandUse, OwnershipType, AvailabilityStatus, FloodRisk } from '@/lib/types';
import { LandCard } from '@/components/land/LandCard';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { PROVINCES } from '@/lib/constants';

export default function ListingsPage() {
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<LandFilter>({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchParcels = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.province) params.set('province', filters.province);
      if (filters.district) params.set('district', filters.district);
      if (filters.landUse) params.set('landUse', filters.landUse);
      if (filters.ownershipType) params.set('ownershipType', filters.ownershipType);
      if (filters.floodRisk) params.set('floodRisk', filters.floodRisk);
      if (filters.availabilityStatus) params.set('availabilityStatus', filters.availabilityStatus);
      if (searchQuery) params.set('q', searchQuery);
      const res = await fetch(`/api/land?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        const sorted = [...data.data] as LandParcel[];
        if (sort === 'price-asc') sorted.sort((a, b) => (a.listingPrice ?? a.priceEstimate?.estimatedTotal ?? 0) - (b.listingPrice ?? b.priceEstimate?.estimatedTotal ?? 0));
        if (sort === 'price-desc') sorted.sort((a, b) => (b.listingPrice ?? b.priceEstimate?.estimatedTotal ?? 0) - (a.listingPrice ?? a.priceEstimate?.estimatedTotal ?? 0));
        if (sort === 'area-asc') sorted.sort((a, b) => a.areaInSqft - b.areaInSqft);
        if (sort === 'area-desc') sorted.sort((a, b) => b.areaInSqft - a.areaInSqft);
        if (sort === 'risk-desc') sorted.sort((a, b) => (b.riskScore?.overall ?? 0) - (a.riskScore?.overall ?? 0));
        if (sort === 'risk-asc') sorted.sort((a, b) => (a.riskScore?.overall ?? 0) - (b.riskScore?.overall ?? 0));
        setParcels(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, searchQuery]);

  useEffect(() => { fetchParcels(); }, [fetchParcels]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Land Listings</h1>
          <p className="text-slate-500 text-sm mt-1">{parcels.length} sample parcels — all fictional data</p>
        </div>
        <div className="flex items-center gap-2">
          {compareIds.length > 1 && (
            <a
              href={`/compare?ids=${compareIds.join(',')}`}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
            >
              Compare ({compareIds.length})
            </a>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by district, municipality, kitta..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="area-asc">Area: Small to Large</option>
          <option value="area-desc">Area: Large to Small</option>
          <option value="risk-desc">Risk Score: Best First</option>
          <option value="risk-asc">Risk Score: Worst First</option>
        </select>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-slate-800">Filter Options</span>
            <button onClick={() => { setFilters({}); }} className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filters.province ?? ''}
              onChange={e => setFilters(p => ({ ...p, province: (e.target.value as Province) || undefined }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Provinces</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={filters.landUse ?? ''}
              onChange={e => setFilters(p => ({ ...p, landUse: (e.target.value as LandUse) || undefined }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Land Use</option>
              {['Residential', 'Agricultural', 'Commercial', 'Industrial', 'Mixed', 'Forest'].map(u => <option key={u}>{u}</option>)}
            </select>
            <select
              value={filters.ownershipType ?? ''}
              onChange={e => setFilters(p => ({ ...p, ownershipType: (e.target.value as OwnershipType) || undefined }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Ownership</option>
              {['Private', 'Guthi', 'Government', 'Institutional', 'Organization', 'Unknown'].map(o => <option key={o}>{o}</option>)}
            </select>
            <select
              value={filters.availabilityStatus ?? ''}
              onChange={e => setFilters(p => ({ ...p, availabilityStatus: (e.target.value as AvailabilityStatus) || undefined }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              {['For Sale', 'For Lease', 'Not Listed', 'Under Negotiation'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select
              value={filters.floodRisk ?? ''}
              onChange={e => setFilters(p => ({ ...p, floodRisk: (e.target.value as FloodRisk) || undefined }))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Any Flood Risk</option>
              {['None', 'Low', 'Moderate', 'High', 'Very High'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Compare hint */}
      {compareIds.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 mb-4 flex items-center justify-between">
          <span className="text-sm text-emerald-700">{compareIds.length} parcel(s) selected for comparison</span>
          <button onClick={() => setCompareIds([])} className="text-xs text-emerald-600 hover:text-emerald-800">Clear</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : parcels.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg font-medium">No parcels found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {parcels.map(parcel => (
            <LandCard
              key={parcel.id}
              parcel={parcel}
              showCompareButton
              isComparing={compareIds.includes(parcel.id)}
              onCompareToggle={toggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
}
