// BhuInfo Nepal — Data Provider Interface
// Swap out DummyDataProvider for GISDataProvider or OfficialDataProvider later.

import { LandParcel, LandFilter, NearbyFacility, PriceEstimate, AdminStats } from '@/lib/types';

export interface IDataProvider {
  getLandParcels(filters?: LandFilter): Promise<LandParcel[]>;
  getLandById(id: string): Promise<LandParcel | null>;
  getNearbyFacilities(parcelId: string): Promise<NearbyFacility[]>;
  getPriceEstimate(parcelId: string): Promise<PriceEstimate | null>;
  getAdminStats(): Promise<AdminStats>;
  createLandParcel?(parcel: Omit<LandParcel, 'id' | 'createdAt'>): Promise<LandParcel>;
  updateLandParcel?(id: string, parcel: Partial<LandParcel>): Promise<LandParcel>;
  deleteLandParcel?(id: string): Promise<void>;
}
