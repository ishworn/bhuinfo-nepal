import { notFound } from 'next/navigation';
import { dataProvider } from '@/lib/data';
import { DataBadge } from '@/components/shared/DataBadge';
import { OwnershipWarning } from '@/components/shared/OwnershipWarning';
import { RiskScoreCard } from '@/components/shared/RiskScoreCard';
import { PriceCard } from '@/components/shared/PriceCard';
import { formatNPR } from '@/lib/utils/area';
import { getFloodRiskColor } from '@/lib/services/risk.service';
import {
  MapPin, Ruler, Home, Shield, Zap, Droplets, Wifi,
  GraduationCap, Heart, ShoppingBag, Banknote, Bus, AlertTriangle,
  Building, Mountain, Waves, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import MapWrapper from '@/components/map/MapWrapper';

interface Props {
  params: { id: string };
}

export default async function LandDetailPage({ params }: Props) {
  const parcel = await dataProvider.getLandById(params.id);
  if (!parcel) notFound();

  const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    School: GraduationCap, Hospital: Heart, Market: ShoppingBag,
    Bank: Banknote, 'Bus Stop': Bus, Police: Shield,
    Temple: Building, Restaurant: ShoppingBag, Pharmacy: Heart, Other: MapPin,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <div className="mb-6">
        <Link href="/listings" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded text-sm">{parcel.kittaNumber}</span>
              <DataBadge status={parcel.dataStatus} size="md" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                parcel.availabilityStatus === 'For Sale' ? 'bg-green-100 text-green-800' :
                parcel.availabilityStatus === 'For Lease' ? 'bg-blue-100 text-blue-800' :
                'bg-slate-100 text-slate-600'
              }`}>{parcel.availabilityStatus}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{parcel.municipality}, {parcel.district}</h1>
            <div className="flex items-center gap-1 text-slate-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{parcel.province} Province, Ward {parcel.ward}</span>
            </div>
          </div>
          {parcel.listingPrice && parcel.availabilityStatus !== 'Not Listed' && (
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Listed Price</div>
              <div className="text-2xl font-bold text-emerald-700">{formatNPR(parcel.listingPrice)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Ownership Warning (prominent) */}
      {['Guthi', 'Government', 'Institutional', 'Organization', 'Unknown'].includes(parcel.ownershipType) && (
        <div className="mb-6">
          <OwnershipWarning ownershipType={parcel.ownershipType} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* A. Basic Information */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">A. Basic Information</h2>
              <DataBadge status="Sample" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Ruler, label: 'Area', value: `${parcel.area} ${parcel.areaUnit}` },
                { icon: Home, label: 'Land Use', value: parcel.landUse },
                { icon: Shield, label: 'Ownership', value: parcel.ownershipType },
                { icon: MapPin, label: 'Ward', value: `Ward ${parcel.ward}` },
                { icon: Ruler, label: 'Sq Ft', value: `${parcel.areaInSqft.toLocaleString()} sq ft` },
                { icon: Ruler, label: 'Sq M', value: `${parcel.areaInSqm.toLocaleString()} sq m` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs text-slate-500">{label}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* B. Location */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">B. Location</h2>
              <DataBadge status="Sample" />
            </div>
            <div className="mb-4 h-72">
              <MapWrapper
                parcels={[parcel]}
                selectedParcelId={parcel.id}
                center={[parcel.latitude, parcel.longitude]}
                zoom={14}
                height="100%"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Coordinates</div>
                <div className="text-sm font-mono text-slate-800">{parcel.latitude.toFixed(5)}, {parcel.longitude.toFixed(5)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Terrain</div>
                <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5" />{parcel.terrain}
                </div>
              </div>
            </div>
          </section>

          {/* D. Infrastructure */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">D. Infrastructure</h2>
              <DataBadge status="Sample" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Road Type</div>
                <div className="text-sm font-medium text-slate-800">{parcel.roadType}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Road Width</div>
                <div className="text-sm font-medium text-slate-800">{parcel.roadWidth > 0 ? `${parcel.roadWidth} feet` : 'No road'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Distance to Road</div>
                <div className="text-sm font-medium text-slate-800">{parcel.roadDistance}m</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Zap, label: 'Electricity', ok: parcel.electricity },
                { icon: Droplets, label: 'Water Supply', ok: parcel.water },
                { icon: Waves, label: 'Drainage', ok: parcel.drainage },
                { icon: Wifi, label: 'Internet/Mobile', ok: parcel.internet },
              ].map(({ icon: Icon, label, ok }) => (
                <div key={label} className={`rounded-lg p-3 flex items-center gap-2 ${ok ? 'bg-green-50' : 'bg-red-50'}`}>
                  <Icon className={`w-4 h-4 ${ok ? 'text-green-600' : 'text-red-400'}`} />
                  <div>
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className={`text-xs font-semibold ${ok ? 'text-green-700' : 'text-red-600'}`}>
                      {ok ? 'Available' : 'Not Available'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* E. Environmental */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">E. Environmental Information</h2>
              <DataBadge status="Sample" />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-800">Environmental indicators are indicative/sample data. Professional site assessment required.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Flood Risk</div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getFloodRiskColor(parcel.floodRisk)}`}>{parcel.floodRisk}</span>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">River Distance</div>
                <div className="text-sm font-medium text-slate-800">{parcel.riverDistance}m</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Slope</div>
                <div className="text-sm font-medium text-slate-800">{parcel.slope}</div>
              </div>
            </div>
          </section>

          {/* F. Nearby Facilities */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">F. Nearby Facilities</h2>
              <DataBadge status="Sample" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {parcel.nearbyFacilities.map(facility => {
                const Icon = facilityIcons[facility.type] ?? MapPin;
                return (
                  <div key={facility.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{facility.name}</div>
                      <div className="text-xs text-slate-500">{facility.type} • {facility.distanceLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Risk Score */}
          {parcel.riskScore && <RiskScoreCard riskScore={parcel.riskScore} />}

          {/* Price */}
          {parcel.priceEstimate && <PriceCard estimate={parcel.priceEstimate} />}

          {/* C. Ownership */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">C. Ownership</h3>
              <DataBadge status="Needs Verification" />
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-slate-500">Ownership Type</div>
                <div className="text-sm font-semibold text-slate-800">{parcel.ownershipType}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Transfer Status</div>
                <div className="text-sm text-slate-600">
                  {parcel.ownershipType === 'Private' ? 'Verify at Land Revenue Office' : 'Requires legal verification'}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                BhuInfo Nepal does not legally verify ownership. Always verify at the relevant Land Revenue Office.
              </p>
            </div>
          </div>

          {/* Tags */}
          {parcel.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {parcel.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Data source */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 font-semibold mb-2">Data Information</div>
            <div className="space-y-1 text-xs text-slate-500">
              <div>Source: {parcel.dataSource}</div>
              <div>Last Updated: {parcel.lastUpdated}</div>
              <div className="text-amber-600 font-medium">All information is fictional sample data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
