// BhuInfo Nepal — Risk Score Calculation Service
// Transparent rule-based scoring. All results are indicative/sample data.

import { LandParcel, RiskScore, FloodRisk, Slope, RoadType } from '@/lib/types';

function floodRiskPenalty(risk: FloodRisk): number {
  const map: Record<FloodRisk, number> = { None: 0, Low: 5, Moderate: 12, High: 20, 'Very High': 25 };
  return map[risk] ?? 0;
}

function riverProximityPenalty(distanceM: number): number {
  if (distanceM < 50) return 15;
  if (distanceM < 100) return 12;
  if (distanceM < 200) return 8;
  if (distanceM < 500) return 4;
  return 0;
}

function slopePenalty(slope: Slope): number {
  const map: Record<Slope, number> = { Flat: 0, Gentle: 3, Moderate: 7, Steep: 12, 'Very Steep': 15 };
  return map[slope] ?? 0;
}

function roadBonus(roadType: RoadType, roadDistanceM: number): number {
  let typeBonus = 0;
  switch (roadType) {
    case 'Highway': typeBonus = 20; break;
    case 'Blacktopped': typeBonus = 18; break;
    case 'Gravel': typeBonus = 10; break;
    case 'Trail': typeBonus = 4; break;
    case 'None': typeBonus = 0; break;
  }
  // Penalize distance from road
  const distancePenalty = Math.min(10, Math.floor(roadDistanceM / 100));
  return Math.max(0, typeBonus - distancePenalty);
}

function infrastructureBonus(electricity: boolean, water: boolean, drainage: boolean, internet: boolean): number {
  let bonus = 0;
  if (electricity) bonus += 5;
  if (water) bonus += 5;
  if (drainage) bonus += 3;
  if (internet) bonus += 2;
  return bonus;
}

function locationBonus(municipality: string): number {
  const prime = ['Kathmandu Metropolitan', 'Lalitpur Metropolitan', 'Pokhara Metropolitan', 'Biratnagar Metropolitan', 'Bharatpur Metropolitan'];
  const good = ['Bhaktapur', 'Dhulikhel', 'Banepa', 'Butwal', 'Birendranagar', 'Dhangadhi', 'Dharan', 'Hetauda'];
  if (prime.includes(municipality)) return 10;
  if (good.includes(municipality)) return 7;
  return 4;
}

export function calculateRiskScore(parcel: LandParcel): RiskScore {
  const flood = Math.round(floodRiskPenalty(parcel.floodRisk));
  const river = Math.round(riverProximityPenalty(parcel.riverDistance));
  const slope = Math.round(slopePenalty(parcel.slope));
  const road = Math.round(roadBonus(parcel.roadType, parcel.roadDistance));
  const infra = Math.round(infrastructureBonus(parcel.electricity, parcel.water, parcel.drainage, parcel.internet));
  const loc = Math.round(locationBonus(parcel.municipality));

  const overall = Math.max(0, Math.min(100,
    100 - flood - river - slope + road + infra + loc - 100 + 65
    // base of 65, then adjustments cap at 100
  ));

  // Re-calc with cleaner formula:
  // Start with 50 base, add bonuses, subtract penalties, clamp 0-100
  const raw = 50 + road + infra + loc - flood - river - slope;
  const finalScore = Math.max(0, Math.min(100, Math.round(raw)));

  let label: RiskScore['label'];
  if (finalScore >= 75) label = 'Low Risk';
  else if (finalScore >= 55) label = 'Moderate Risk';
  else if (finalScore >= 35) label = 'High Risk';
  else label = 'Very High Risk';

  return {
    overall: finalScore,
    flood: Math.max(0, 25 - flood),
    riverProximity: Math.max(0, 15 - river),
    slope: Math.max(0, 15 - slope),
    road,
    infrastructure: infra,
    location: loc,
    label,
    dataStatus: 'Sample',
  };
}

export function getRiskColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 55) return 'text-yellow-600';
  if (score >= 35) return 'text-orange-600';
  return 'text-red-600';
}

export function getRiskBgColor(score: number): string {
  if (score >= 75) return 'bg-green-100 text-green-800';
  if (score >= 55) return 'bg-yellow-100 text-yellow-800';
  if (score >= 35) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

export function getFloodRiskColor(risk: FloodRisk): string {
  const map: Record<FloodRisk, string> = {
    None: 'bg-green-100 text-green-800',
    Low: 'bg-blue-100 text-blue-800',
    Moderate: 'bg-yellow-100 text-yellow-800',
    High: 'bg-orange-100 text-orange-800',
    'Very High': 'bg-red-100 text-red-800',
  };
  return map[risk];
}
