// BhuInfo Nepal — Rule-Based Price Estimation Service
// IMPORTANT: Results are ESTIMATES ONLY, not official valuations.

import { LandParcel, PriceEstimate, PriceFactors, OwnershipType } from '@/lib/types';

// Base prices per Aana in NPR by municipality category
const BASE_PRICES: Record<string, number> = {
  // Prime urban — Kathmandu valley
  'Kathmandu Metropolitan': 4500000,
  'Lalitpur Metropolitan': 3500000,
  'Bhaktapur': 2800000,
  'Madhyapur Thimi': 2500000,
  // Pokhara
  'Pokhara Metropolitan': 2000000,
  // Other major cities
  'Biratnagar Metropolitan': 1200000,
  'Bharatpur Metropolitan': 1500000,
  'Butwal': 900000,
  'Dharan': 800000,
  'Birendranagar': 600000,
  'Dhangadhi': 500000,
  'Hetauda': 700000,
  'Dhulikhel': 1000000,
  'Banepa': 900000,
  'Panauti': 700000,
  // Default
  DEFAULT: 300000,
};

function getBasePrice(municipality: string): number {
  return BASE_PRICES[municipality] ?? BASE_PRICES.DEFAULT;
}

function locationFactor(province: string, district: string): number {
  if (province === 'Bagmati' && district === 'Kathmandu') return 1.15;
  if (province === 'Bagmati' && district === 'Lalitpur') return 1.10;
  if (province === 'Bagmati' && district === 'Bhaktapur') return 1.05;
  if (province === 'Gandaki') return 0.95;
  if (province === 'Koshi') return 0.90;
  if (province === 'Lumbini') return 0.85;
  if (province === 'Madhesh') return 0.80;
  if (province === 'Karnali') return 0.65;
  if (province === 'Sudurpashchim') return 0.60;
  return 0.85;
}

function roadFactor(roadType: string, roadWidth: number): number {
  let base = 1.0;
  switch (roadType) {
    case 'Highway': base = 1.20; break;
    case 'Blacktopped': base = 1.15; break;
    case 'Gravel': base = 1.0; break;
    case 'Trail': base = 0.85; break;
    case 'None': base = 0.70; break;
  }
  if (roadWidth >= 20) base += 0.05;
  if (roadWidth >= 30) base += 0.05;
  return base;
}

function infrastructureFactor(electricity: boolean, water: boolean, drainage: boolean, internet: boolean): number {
  let factor = 0.85;
  if (electricity) factor += 0.05;
  if (water) factor += 0.05;
  if (drainage) factor += 0.03;
  if (internet) factor += 0.02;
  return factor;
}

function landUseFactor(landUse: string): number {
  const map: Record<string, number> = {
    Commercial: 1.25,
    Industrial: 1.15,
    Mixed: 1.10,
    Residential: 1.0,
    Agricultural: 0.70,
    Public: 0.50,
    Forest: 0.40,
    Riverbed: 0.30,
    Unknown: 0.80,
  };
  return map[landUse] ?? 0.80;
}

function accessibilityFactor(roadDistanceM: number): number {
  if (roadDistanceM <= 10) return 1.10;
  if (roadDistanceM <= 30) return 1.05;
  if (roadDistanceM <= 100) return 1.0;
  if (roadDistanceM <= 300) return 0.92;
  if (roadDistanceM <= 500) return 0.85;
  return 0.75;
}

function riskFactor(floodRisk: string, slope: string): number {
  let factor = 1.0;
  switch (floodRisk) {
    case 'None': factor += 0.05; break;
    case 'Low': break;
    case 'Moderate': factor -= 0.08; break;
    case 'High': factor -= 0.15; break;
    case 'Very High': factor -= 0.25; break;
  }
  switch (slope) {
    case 'Flat': break;
    case 'Gentle': break;
    case 'Moderate': factor -= 0.03; break;
    case 'Steep': factor -= 0.08; break;
    case 'Very Steep': factor -= 0.15; break;
  }
  return Math.max(0.3, factor);
}

const OWNERSHIP_PRICE_BLOCKED: OwnershipType[] = ['Guthi', 'Government', 'Unknown'];

export function canEstimatePrice(parcel: LandParcel): { can: boolean; reason?: string } {
  if (OWNERSHIP_PRICE_BLOCKED.includes(parcel.ownershipType)) {
    return {
      can: false,
      reason: `Price estimation is not available for ${parcel.ownershipType} land. Ownership and transfer conditions require legal verification.`,
    };
  }
  if (parcel.floodRisk === 'Very High') {
    return {
      can: false,
      reason: 'Price estimation is not available for parcels with Very High flood risk.',
    };
  }
  if (parcel.landUse === 'Riverbed' || parcel.landUse === 'Forest') {
    return {
      can: false,
      reason: `Price estimation is not available for ${parcel.landUse} land type.`,
    };
  }
  return { can: true };
}

export function estimatePrice(parcel: LandParcel): PriceEstimate {
  const check = canEstimatePrice(parcel);

  if (!check.can) {
    return {
      id: `est-${parcel.id}`,
      parcelId: parcel.id,
      available: false,
      unavailableReason: check.reason,
      basePrice: 0,
      factors: {} as PriceFactors,
      estimatedPricePerAana: 0,
      estimatedTotal: 0,
      estimatedRangeLow: 0,
      estimatedRangeHigh: 0,
      confidence: 'Low',
      currency: 'NPR',
      dataStatus: 'Estimated',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  }

  const basePrice = getBasePrice(parcel.municipality);
  const locF = locationFactor(parcel.province, parcel.district);
  const roadF = roadFactor(parcel.roadType, parcel.roadWidth);
  const infraF = infrastructureFactor(parcel.electricity, parcel.water, parcel.drainage, parcel.internet);
  const useF = landUseFactor(parcel.landUse);
  const accessF = accessibilityFactor(parcel.roadDistance);
  const riskF = riskFactor(parcel.floodRisk, parcel.slope);

  const pricePerAana = Math.round(basePrice * locF * roadF * infraF * useF * accessF * riskF);
  const areaInAana = parcel.areaInAana > 0 ? parcel.areaInAana : parcel.areaInSqft / 342.25;
  const total = Math.round(pricePerAana * areaInAana);

  // 15% range on either side
  const rangeLow = Math.round(total * 0.85);
  const rangeHigh = Math.round(total * 1.15);

  // Confidence based on data completeness
  let confidence: PriceEstimate['confidence'] = 'Medium';
  if (parcel.electricity && parcel.water && parcel.roadType !== 'None' && parcel.roadType !== 'Trail') {
    confidence = 'High';
  }
  if (!parcel.electricity && !parcel.water) confidence = 'Low';

  return {
    id: `est-${parcel.id}`,
    parcelId: parcel.id,
    available: true,
    basePrice,
    factors: { basePrice, locationFactor: locF, roadFactor: roadF, infrastructureFactor: infraF, landUseFactor: useF, accessibilityFactor: accessF, riskFactor: riskF },
    estimatedPricePerAana: pricePerAana,
    estimatedTotal: total,
    estimatedRangeLow: rangeLow,
    estimatedRangeHigh: rangeHigh,
    confidence,
    currency: 'NPR',
    dataStatus: 'Estimated',
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

export function formatFactorChange(factor: number): string {
  const pct = Math.round((factor - 1) * 100);
  if (pct > 0) return `+${pct}%`;
  if (pct < 0) return `${pct}%`;
  return 'No change';
}

export function getFactorLabel(key: string): string {
  const labels: Record<string, string> = {
    locationFactor: 'Location Adjustment',
    roadFactor: 'Road Access Adjustment',
    infrastructureFactor: 'Infrastructure Adjustment',
    landUseFactor: 'Land Use Adjustment',
    accessibilityFactor: 'Accessibility Adjustment',
    riskFactor: 'Risk Adjustment',
  };
  return labels[key] ?? key;
}
