import Link from 'next/link';
import { LandParcel } from '@/lib/types';
import { DataBadge } from '@/components/shared/DataBadge';
import { formatNPR } from '@/lib/utils/area';
import { getRiskBgColor } from '@/lib/services/risk.service';
import { MapPin, Ruler, AlertTriangle, CheckCircle2, Home } from 'lucide-react';

interface LandCardProps {
  parcel: LandParcel;
  showCompareButton?: boolean;
  isComparing?: boolean;
  onCompareToggle?: (id: string) => void;
}

const OWNERSHIP_COLORS: Record<string, string> = {
  Private: 'bg-slate-100 text-slate-700',
  Guthi: 'bg-amber-100 text-amber-800',
  Government: 'bg-blue-100 text-blue-800',
  Institutional: 'bg-purple-100 text-purple-800',
  Organization: 'bg-indigo-100 text-indigo-800',
  Unknown: 'bg-red-100 text-red-800',
};

export function LandCard({ parcel, showCompareButton, isComparing, onCompareToggle }: LandCardProps) {
  const hasWarning = ['Guthi', 'Government', 'Institutional', 'Organization', 'Unknown'].includes(parcel.ownershipType);

  return (
    <div className={`bg-white rounded-xl border transition-all hover:shadow-md ${
      isComparing ? 'border-emerald-400 shadow-md' : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {parcel.kittaNumber}
              </span>
              <DataBadge status={parcel.dataStatus} />
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-sm truncate">{parcel.municipality}, {parcel.district}</span>
            </div>
          </div>
          {parcel.riskScore && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${getRiskBgColor(parcel.riskScore.overall)}`}>
              {parcel.riskScore.overall}/100
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-500">Area</div>
            <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {parcel.area} {parcel.areaUnit}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Land Use</div>
            <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              {parcel.landUse}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${OWNERSHIP_COLORS[parcel.ownershipType] ?? 'bg-slate-100 text-slate-700'}`}>
            {parcel.ownershipType}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            parcel.availabilityStatus === 'For Sale' ? 'bg-green-100 text-green-800' :
            parcel.availabilityStatus === 'For Lease' ? 'bg-blue-100 text-blue-800' :
            'bg-slate-100 text-slate-600'
          }`}>
            {parcel.availabilityStatus}
          </span>
          {hasWarning && (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {[['elec', parcel.electricity], ['water', parcel.water], ['drain', parcel.drainage], ['net', parcel.internet]]
            .map(([label, has], i) => (
              <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${
                has ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
              }`}>
                {label as string}
              </span>
            ))}
        </div>

        {parcel.listingPrice && parcel.availabilityStatus !== 'Not Listed' ? (
          <div className="bg-emerald-50 rounded-lg px-3 py-2">
            <div className="text-xs text-emerald-600">Listed Price</div>
            <div className="text-sm font-bold text-emerald-700">{formatNPR(parcel.listingPrice)}</div>
          </div>
        ) : parcel.priceEstimate?.available ? (
          <div className="bg-blue-50 rounded-lg px-3 py-2">
            <div className="text-xs text-blue-600">Est. Range</div>
            <div className="text-sm font-bold text-blue-700">
              {formatNPR(parcel.priceEstimate.estimatedRangeLow)} — {formatNPR(parcel.priceEstimate.estimatedRangeHigh)}
            </div>
          </div>
        ) : null}
      </div>

      <div className="px-4 pb-4 flex items-center gap-2">
        <Link
          href={`/land/${parcel.id}`}
          className="flex-1 text-center py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          View Details
        </Link>
        {showCompareButton && (
          <button
            onClick={() => onCompareToggle?.(parcel.id)}
            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              isComparing
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                : 'border-slate-300 text-slate-600 hover:border-emerald-400 hover:text-emerald-700'
            }`}
          >
            {isComparing ? <CheckCircle2 className="w-4 h-4" /> : '+'}
          </button>
        )}
      </div>
    </div>
  );
}
