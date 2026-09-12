'use client';

import { useState, useEffect } from 'react';
import { LandParcel, AdminStats, OwnershipType, LandUse, FloodRisk, Province } from '@/lib/types';
import { DataBadge } from '@/components/shared/DataBadge';
import { formatNPR } from '@/lib/utils/area';
import { PROVINCES, OWNERSHIP_OPTIONS, LAND_USE_OPTIONS, FLOOD_RISK_OPTIONS } from '@/lib/constants';
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Edit,
  Database,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  Layers,
  BarChart3,
  X,
 
  Save,
} from 'lucide-react';

type AdminTab = 'overview' | 'parcels' | 'ownership' | 'factors' | 'sources';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  // Add/Edit Land Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParcelId, setEditingParcelId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LandParcel>>({
    kittaNumber: '',
    province: 'Bagmati',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan',
    ward: 1,
    area: 4,
    areaUnit: 'Aana',
    landUse: 'Residential',
    ownershipType: 'Private',
    floodRisk: 'Low',
    slope: 'Flat',
    terrain: 'Hill',
    roadType: 'Blacktopped',
    roadWidth: 16,
    roadDistance: 10,
    riverDistance: 1200,
    electricity: true,
    water: true,
    drainage: true,
    internet: true,
    availabilityStatus: 'For Sale',
    listingPrice: 20000000,
    latitude: 27.7172,
    longitude: 85.314,
    description: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [resLand, resStats] = await Promise.all([
        fetch('/api/land').then((r) => r.json()),
        fetch('/api/stats').then((r) => r.json()),
      ]);
      if (resLand.success) setParcels(resLand.data);
      if (resStats.success) setStats(resStats.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredParcels = parcels.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      p.kittaNumber.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.municipality.toLowerCase().includes(q) ||
      p.ownershipType.toLowerCase().includes(q);
    const matchProv = !selectedProvince || p.province === selectedProvince;
    return matchQuery && matchProv;
  });

  const handleOpenAdd = () => {
    setEditingParcelId(null);
    setFormData({
      kittaNumber: `NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      province: 'Bagmati',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan',
      ward: 1,
      area: 4,
      areaUnit: 'Aana',
      landUse: 'Residential',
      ownershipType: 'Private',
      floodRisk: 'Low',
      slope: 'Flat',
      terrain: 'Hill',
      roadType: 'Blacktopped',
      roadWidth: 16,
      roadDistance: 10,
      riverDistance: 1200,
      electricity: true,
      water: true,
      drainage: true,
      internet: true,
      availabilityStatus: 'For Sale',
      listingPrice: 15000000,
      latitude: 27.7172,
      longitude: 85.314,
      description: 'Newly added sample land parcel for due diligence demonstration.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: LandParcel) => {
    setEditingParcelId(p.id);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this sample parcel from active session?')) return;
    setParcels((prev) => prev.filter((p) => p.id !== id));
    showNotification('Sample parcel removed successfully from current session.');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kittaNumber) {
      alert('Please enter a Kitta number');
      return;
    }

    if (editingParcelId) {
      setParcels((prev) =>
        prev.map((p) => (p.id === editingParcelId ? ({ ...p, ...formData } as LandParcel) : p))
      );
      showNotification(`Parcel ${formData.kittaNumber} updated successfully.`);
    } else {
      const newId = `SAMPLE-${Date.now().toString().slice(-4)}`;
      const newParcel: LandParcel = {
        id: newId,
        kittaNumber: formData.kittaNumber || '',
        province: formData.province || 'Bagmati',
        district: formData.district || 'Kathmandu',
        municipality: formData.municipality || 'Kathmandu Metropolitan',
        ward: formData.ward || 1,
        area: formData.area || 4,
        areaUnit: formData.areaUnit || 'Aana',
        areaInAana: formData.area || 4,
        areaInSqft: (formData.area || 4) * 342.25,
        areaInSqm: (formData.area || 4) * 31.8,
        landUse: formData.landUse || 'Residential',
        ownershipType: formData.ownershipType || 'Private',
        latitude: formData.latitude || 27.7172,
        longitude: formData.longitude || 85.314,
        roadDistance: formData.roadDistance || 10,
        roadWidth: formData.roadWidth || 16,
        roadType: formData.roadType || 'Blacktopped',
        riverDistance: formData.riverDistance || 1200,
        floodRisk: formData.floodRisk || 'Low',
        slope: formData.slope || 'Flat',
        terrain: formData.terrain || 'Hill',
        electricity: formData.electricity ?? true,
        water: formData.water ?? true,
        drainage: formData.drainage ?? true,
        internet: formData.internet ?? true,
        availabilityStatus: formData.availabilityStatus || 'For Sale',
        listingPrice: formData.listingPrice,
        description: formData.description || '',
        dataStatus: 'Sample',
        dataSource: 'Admin Console (In-Memory Session)',
        lastUpdated: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        tags: ['Admin Created', formData.landUse || 'Residential'],
        nearbyFacilities: [
          {
            id: `${newId}-fac-0`,
            parcelId: newId,
            type: 'School',
            name: 'Local Model School',
            distanceKm: 0.5,
            distanceLabel: '500m',
          },
        ],
      };
      setParcels((prev) => [newParcel, ...prev]);
      showNotification(`New sample parcel ${newParcel.kittaNumber} created successfully.`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Admin Intelligence Dashboard</h1>
            <DataBadge status="Sample" />
          </div>
          <p className="text-xs text-slate-500">
            Control center for dummy land datasets, risk engine calibration, GIS provider adapters, and ownership policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Land Record
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {notification && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mt-6 gap-2 overflow-x-auto text-sm">
        {([
          { id: 'overview' as const, label: 'Dashboard & Charts', icon: BarChart3 },
          { id: 'parcels' as const, label: `Land Records (${parcels.length})`, icon: Database },
          { id: 'ownership' as const, label: 'Ownership & Guthi Settings', icon: Shield },
          { id: 'factors' as const, label: 'Price Engine Calibration', icon: TrendingUp },
          { id: 'sources' as const, label: 'Data Providers & GIS Status', icon: Layers },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="py-6 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Land Parcels</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">{parcels.length}</div>
              <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <span>Fictional sample dataset</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Listings</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">
                {parcels.filter((p) => p.availabilityStatus === 'For Sale' || p.availabilityStatus === 'For Lease').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Available for transactions</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg. Risk Score</div>
              <div className="text-3xl font-bold text-emerald-700 mt-2">
                {stats?.averageRiskScore ?? 68}
                <span className="text-sm font-normal text-slate-500">/100</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Indicative platform assessment</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Verification Required</div>
              <div className="text-3xl font-bold text-amber-600 mt-2">
                {parcels.filter((p) => ['Guthi', 'Government', 'Institutional', 'Unknown'].includes(p.ownershipType)).length}
              </div>
              <div className="text-xs text-amber-700 mt-1">Guthi / Gov / Inst / Unknown</div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart: Parcels by Province */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>Parcels by Province</span>
                <span className="text-xs text-slate-400 font-normal">Sample Coverage</span>
              </h3>
              <div className="space-y-3">
                {PROVINCES.map((prov) => {
                  const count = parcels.filter((p) => p.province === prov).length;
                  const pct = parcels.length > 0 ? Math.round((count / parcels.length) * 100) : 0;
                  return (
                    <div key={prov}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{prov}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart: Ownership Distribution */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>Ownership Distribution</span>
                <span className="text-xs text-slate-400 font-normal">Legal Categories</span>
              </h3>
              <div className="space-y-3">
                {OWNERSHIP_OPTIONS.map((own) => {
                  const count = parcels.filter((p) => p.ownershipType === own).length;
                  const pct = parcels.length > 0 ? Math.round((count / parcels.length) * 100) : 0;
                  const colorMap: Record<string, string> = {
                    Private: 'bg-emerald-500',
                    Guthi: 'bg-amber-500',
                    Government: 'bg-blue-500',
                    Institutional: 'bg-purple-500',
                    Organization: 'bg-indigo-500',
                    Unknown: 'bg-red-500',
                  };
                  return (
                    <div key={own}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{own}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colorMap[own] || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart: Flood Risk Distribution */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>Flood Risk Classification</span>
                <span className="text-xs text-slate-400 font-normal">Environmental Hazard</span>
              </h3>
              <div className="space-y-3">
                {FLOOD_RISK_OPTIONS.map((risk) => {
                  const count = parcels.filter((p) => p.floodRisk === risk).length;
                  const pct = parcels.length > 0 ? Math.round((count / parcels.length) * 100) : 0;
                  const colorMap: Record<string, string> = {
                    None: 'bg-green-500',
                    Low: 'bg-blue-500',
                    Moderate: 'bg-yellow-500',
                    High: 'bg-orange-500',
                    'Very High': 'bg-red-500',
                  };
                  return (
                    <div key={risk}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{risk}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colorMap[risk] || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart: Land Use Distribution */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>Land Use Zoning</span>
                <span className="text-xs text-slate-400 font-normal">Planning Category</span>
              </h3>
              <div className="space-y-3">
                {['Residential', 'Agricultural', 'Commercial', 'Industrial', 'Mixed', 'Forest'].map((u) => {
                  const count = parcels.filter((p) => p.landUse === u).length;
                  const pct = parcels.length > 0 ? Math.round((count / parcels.length) * 100) : 0;
                  return (
                    <div key={u}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{u}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LAND RECORDS TABLE */}
      {activeTab === 'parcels' && (
        <div className="py-6 space-y-4">
          {/* Table Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Kitta, municipality, ownership..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">All Provinces</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Kitta Number</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Land Use</th>
                    <th className="px-4 py-3">Ownership</th>
                    <th className="px-4 py-3">Flood Risk</th>
                    <th className="px-4 py-3">Risk Score</th>
                    <th className="px-4 py-3">Price Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParcels.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800">
                        {p.kittaNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{p.municipality}</div>
                        <div className="text-xs text-slate-500">{p.district}, {p.province}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {p.area} {p.areaUnit}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                          {p.landUse}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            p.ownershipType === 'Guthi'
                              ? 'bg-amber-100 text-amber-800'
                              : p.ownershipType === 'Government'
                              ? 'bg-blue-100 text-blue-800'
                              : p.ownershipType === 'Unknown'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.ownershipType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            p.floodRisk === 'Very High'
                              ? 'bg-red-100 text-red-700'
                              : p.floodRisk === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {p.floodRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {p.riskScore?.overall ?? 50}/100
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {p.listingPrice ? (
                          <span className="text-emerald-700 font-semibold">{formatNPR(p.listingPrice)}</span>
                        ) : p.priceEstimate?.available ? (
                          <span className="text-blue-600 font-semibold">Est: {formatNPR(p.priceEstimate.estimatedTotal)}</span>
                        ) : (
                          <span className="text-slate-400">Unavailable</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-slate-500 hover:text-emerald-600 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 text-slate-500 hover:text-red-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OWNERSHIP & GUTHI POLICY SETTINGS */}
      {activeTab === 'ownership' && (
        <div className="py-6 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-amber-900">Legal Ownership Verification Policy</h3>
                <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                  Under Nepal land laws and platform compliance rules, BhuInfo Nepal <strong>NEVER</strong> certifies or legally guarantees land ownership.
                  Non-private parcels (Guthi, Government, Institutional, Organization, and Unknown) must display prominent legal warnings and restrict automatic automated pricing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                type: 'Guthi',
                title: 'Guthi Land Handling',
                description: 'Land under religious, philanthropic, or customary trusts (Rajguthi, Chhut Guthi, Niji Guthi).',
                warningPolicy: 'Mandatory prominent warning banner: "Ownership category requires legal verification."',
                pricingPolicy: 'Automatic price valuation is disabled. Requires legal clearance from Guthi Sansthan.',
                financingPolicy: 'Bank mortgages may be restricted or subject to tenant/ownership split.',
              },
              {
                type: 'Government',
                title: 'Government / Public Land',
                description: 'Land registered under government ministries, forest, rivers, or public commons.',
                warningPolicy: 'Red-level warning banner: "Government property — not available for private transactions."',
                pricingPolicy: 'Completely disabled.',
                financingPolicy: 'Not eligible for commercial mortgage.',
              },
              {
                type: 'Institutional',
                title: 'Institutional / Corporate Land',
                description: 'Land owned by schools, universities, hospitals, or chartered entities.',
                warningPolicy: 'Requires board authorization and government approval for transfer.',
                pricingPolicy: 'Disabled or marked low confidence.',
                financingPolicy: 'Subject to institutional charter.',
              },
              {
                type: 'Unknown',
                title: 'Unverified / Disputed Land',
                description: 'Records with conflicting cadastral claims, boundary disputes, or missing titles.',
                warningPolicy: 'Maximum alert level. "Title requires full cadastral and court verification."',
                pricingPolicy: 'Completely disabled.',
                financingPolicy: 'No bank financing available.',
              },
            ].map((policy) => (
              <div key={policy.type} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-base">{policy.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Policy Active
                  </span>
                </div>
                <p className="text-xs text-slate-600">{policy.description}</p>
                <div className="border-t border-slate-100 pt-2 space-y-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Warning Policy: </span>
                    <span className="text-slate-600">{policy.warningPolicy}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Price Estimator: </span>
                    <span className="text-slate-600">{policy.pricingPolicy}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Financing Note: </span>
                    <span className="text-slate-600">{policy.financingPolicy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICE CALIBRATION */}
      {activeTab === 'factors' && (
        <div className="py-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Rule-Based Pricing Calibration Engine</h3>
            <p className="text-xs text-slate-500 mb-6">
              Formula: <code>Estimated Price = BasePrice(Municipality) × Location × Road × Infrastructure × LandUse × Accessibility × Risk</code>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">Base Rates by Urban Tier (NPR / Aana)</h4>
                <div className="space-y-2 text-xs">
                  {[
                    ['Kathmandu Metropolitan', 'NPR 4,500,000'],
                    ['Lalitpur Metropolitan', 'NPR 3,500,000'],
                    ['Bhaktapur Core', 'NPR 2,800,000'],
                    ['Pokhara Metropolitan', 'NPR 2,000,000'],
                    ['Bharatpur / Biratnagar', 'NPR 1,200,000 - 1,500,000'],
                    ['Provincial Centers (Butwal, Dharan, Surkhet)', 'NPR 600,000 - 900,000'],
                    ['Rural / Remote Municipalities', 'NPR 300,000'],
                  ].map(([tier, rate]) => (
                    <div key={tier} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">{tier}</span>
                      <span className="font-bold text-slate-800">{rate}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">Adjustment Factor Rules</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Commercial Zoning Premium</span>
                    <span className="font-bold text-emerald-600">+25%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Highway / Blacktopped Road Access</span>
                    <span className="font-bold text-emerald-600">+15% to +20%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Full Utilities (Electricity + Water + Drainage)</span>
                    <span className="font-bold text-emerald-600">+13%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">High / Very High Flood Hazard</span>
                    <span className="font-bold text-red-600">-15% to -25%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Steep Hillside / Mountain Slope</span>
                    <span className="font-bold text-red-600">-8% to -15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATA PROVIDERS & GIS ARCHITECTURE */}
      {activeTab === 'sources' && (
        <div className="py-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Pluggable GIS Architecture & Data Source Providers</h3>
            <p className="text-xs text-slate-500 mb-6">
              The platform implements <code>IDataProvider</code>. Currently active: <strong>DummyDataProvider</strong>. Future authorized government and satellite GIS endpoints can be plugged in without UI code changes.
            </p>

            <div className="space-y-4">
              {[
                {
                  name: 'DummyDataProvider (Built-in Fictional)',
                  status: 'Active (Current Mode)',
                  type: 'In-Memory / Fictional GeoJSON',
                  records: `${parcels.length} sample land parcels`,
                  badge: 'bg-emerald-100 text-emerald-800',
                  desc: 'Provides realistic dummy Nepal land data across 7 provinces for prototyping, testing, and portfolio demo.',
                },
                {
                  name: 'Department of Survey (Naapi) Cadastral API (Future)',
                  status: 'Architecture Ready (Planned)',
                  type: 'Official Government Cadastral Service',
                  records: 'Authorized digital Kitta boundary geometries',
                  badge: 'bg-slate-100 text-slate-600',
                  desc: 'Adapter prepared for secure government integration once legal MoUs and authorized API keys are granted.',
                },
                {
                  name: 'ICIMOD / Department of Hydrology & Meteorology (Future)',
                  status: 'Architecture Ready (Planned)',
                  type: 'Satellite Environmental Hazard Layers',
                  records: 'River flow buffers, 50-yr flood plains, landslide risk maps',
                  badge: 'bg-slate-100 text-slate-600',
                  desc: 'Adapter prepared for GeoServer WMS/WFS spatial layers.',
                },
              ].map((provider) => (
                <div key={provider.name} className="p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{provider.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${provider.badge}`}>
                        {provider.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{provider.desc}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Type: {provider.type} • Coverage: {provider.records}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">
                {editingParcelId ? 'Edit Land Record' : 'Add New Sample Land Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Kitta Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.kittaNumber || ''}
                    onChange={(e) => setFormData({ ...formData, kittaNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400"
                    placeholder="e.g. 12-05-18-099"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Province</label>
                  <select
                    value={formData.province || 'Bagmati'}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value as Province })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Municipality</label>
                  <input
                    type="text"
                    required
                    value={formData.municipality || ''}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Ward Number</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.ward || 1}
                    onChange={(e) => setFormData({ ...formData, ward: parseInt(e.target.value) || 1 })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Area</label>
                  <input
                    type="number"
                    min={0.1}
                    step="0.1"
                    value={formData.area || 4}
                    onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 1 })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={formData.areaUnit || 'Aana'}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as LandParcel['areaUnit'] })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Aana">Aana</option>
                    <option value="Ropani">Ropani</option>
                    <option value="Bigha">Bigha</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Land Use</label>
                  <select
                    value={formData.landUse || 'Residential'}
                    onChange={(e) => setFormData({ ...formData, landUse: e.target.value as LandUse })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {LAND_USE_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Ownership Type</label>
                  <select
                    value={formData.ownershipType || 'Private'}
                    onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value as OwnershipType })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {OWNERSHIP_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Flood Risk</label>
                  <select
                    value={formData.floodRisk || 'Low'}
                    onChange={(e) => setFormData({ ...formData, floodRisk: e.target.value as FloodRisk })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {FLOOD_RISK_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude || 27.7172}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 27.7172 })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude || 85.314}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 85.314 })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Asking Price (NPR, optional)</label>
                <input
                  type="number"
                  value={formData.listingPrice || ''}
                  onChange={(e) => setFormData({ ...formData, listingPrice: parseInt(e.target.value) || undefined })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. 18000000"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-semibold"
                >
                  <Save className="w-4 h-4" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
