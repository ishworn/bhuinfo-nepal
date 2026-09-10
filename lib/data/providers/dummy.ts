// BhuInfo Nepal — Dummy Data Provider
// Uses fictional in-memory data. All information is sample/indicative only.

import { IDataProvider } from './interface';
import { LandParcel, LandFilter, NearbyFacility, PriceEstimate, AdminStats } from '@/lib/types';
import DUMMY_PARCELS from '../dummy-parcels';
import { calculateRiskScore } from '@/lib/services/risk.service';
import { estimatePrice } from '@/lib/services/price.service';

function applyFilters(parcels: LandParcel[], filters?: LandFilter): LandParcel[] {
  if (!filters) return parcels;
  return parcels.filter(p => {
    if (filters.province && p.province !== filters.province) return false;
    if (filters.district && p.district !== filters.district) return false;
    if (filters.municipality && p.municipality !== filters.municipality) return false;
    if (filters.ward && p.ward !== filters.ward) return false;
    if (filters.landUse && p.landUse !== filters.landUse) return false;
    if (filters.ownershipType && p.ownershipType !== filters.ownershipType) return false;
    if (filters.roadType && p.roadType !== filters.roadType) return false;
    if (filters.floodRisk && p.floodRisk !== filters.floodRisk) return false;
    if (filters.availabilityStatus && p.availabilityStatus !== filters.availabilityStatus) return false;
    if (filters.minArea && p.areaInSqft < filters.minArea) return false;
    if (filters.maxArea && p.areaInSqft > filters.maxArea) return false;
    if (filters.minPrice && p.listingPrice && p.listingPrice < filters.minPrice) return false;
    if (filters.maxPrice && p.listingPrice && p.listingPrice > filters.maxPrice) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match = p.kittaNumber.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.municipality.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

function enrichParcel(p: LandParcel): LandParcel {
  return {
    ...p,
    riskScore: calculateRiskScore(p),
    priceEstimate: estimatePrice(p),
  };
}

class DummyDataProvider implements IDataProvider {
  async getLandParcels(filters?: LandFilter): Promise<LandParcel[]> {
    const enriched = DUMMY_PARCELS.map(enrichParcel);
    return applyFilters(enriched, filters);
  }

  async getLandById(id: string): Promise<LandParcel | null> {
    const parcel = DUMMY_PARCELS.find(p => p.id === id);
    if (!parcel) return null;
    return enrichParcel(parcel);
  }

  async getNearbyFacilities(parcelId: string): Promise<NearbyFacility[]> {
    const parcel = DUMMY_PARCELS.find(p => p.id === parcelId);
    return parcel?.nearbyFacilities ?? [];
  }

  async getPriceEstimate(parcelId: string): Promise<PriceEstimate | null> {
    const parcel = DUMMY_PARCELS.find(p => p.id === parcelId);
    if (!parcel) return null;
    return estimatePrice(parcel);
  }

  async getAdminStats(): Promise<AdminStats> {
    const parcels = DUMMY_PARCELS;
    const byProvince: Record<string, number> = {};
    const byOwnership: Record<string, number> = {};
    const byFloodRisk: Record<string, number> = {};
    const byLandUse: Record<string, number> = {};

    for (const p of parcels) {
      byProvince[p.province] = (byProvince[p.province] ?? 0) + 1;
      byOwnership[p.ownershipType] = (byOwnership[p.ownershipType] ?? 0) + 1;
      byFloodRisk[p.floodRisk] = (byFloodRisk[p.floodRisk] ?? 0) + 1;
      byLandUse[p.landUse] = (byLandUse[p.landUse] ?? 0) + 1;
    }

    const enriched = parcels.map(enrichParcel);
    const riskScores = enriched.map(p => p.riskScore?.overall ?? 50);
    const avgRisk = Math.round(riskScores.reduce((a, b) => a + b, 0) / riskScores.length);

    return {
      totalParcels: parcels.length,
      byProvince,
      byOwnership,
      byFloodRisk,
      byLandUse,
      listedParcels: parcels.filter(p => p.availabilityStatus === 'For Sale' || p.availabilityStatus === 'For Lease').length,
      averageRiskScore: avgRisk,
    };
  }

  async createLandParcel(parcel: Omit<LandParcel, 'id' | 'createdAt'>): Promise<LandParcel> {
    throw new Error('Read-only in dummy mode');
  }

  async updateLandParcel(id: string, parcel: Partial<LandParcel>): Promise<LandParcel> {
    throw new Error('Read-only in dummy mode');
  }

  async deleteLandParcel(id: string): Promise<void> {
    throw new Error('Read-only in dummy mode');
  }
}

export const dummyDataProvider = new DummyDataProvider();
