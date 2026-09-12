'use client';

import dynamic from 'next/dynamic';
import { LandParcel } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-xl border border-slate-200 text-slate-400 p-8">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
      <p className="text-sm font-medium text-slate-600">Loading Nepal GIS Map Engine...</p>
      <p className="text-xs text-slate-400">Rendering OpenStreetMap layers and sample parcels</p>
    </div>
  ),
});

interface MapWrapperProps {
  parcels: LandParcel[];
  selectedParcelId?: string | null;
  onParcelSelect?: (parcel: LandParcel) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
