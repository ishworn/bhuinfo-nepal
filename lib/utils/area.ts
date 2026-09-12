// Nepal Land Area Calculator Utilities

import { AREA_CONVERSIONS } from '@/lib/constants';

export interface AreaResult {
  ropani: number;
  aana: number;
  paisa: number;
  daam: number;
  sqft: number;
  sqm: number;
  hectare: number;
  acre: number;
  bigha?: number;
  kattha?: number;
}

export function sqftToAll(sqft: number): AreaResult {
  const sqm = sqft / 10.7639;
  const ropani = sqft / AREA_CONVERSIONS.ropaniToSqft;
  const ropaniInt = Math.floor(ropani);
  const aanaRemainder = (ropani - ropaniInt) * AREA_CONVERSIONS.ropaniToAana;
  const aanaInt = Math.floor(aanaRemainder);
  const paisaRemainder = (aanaRemainder - aanaInt) * 4;
  const paisaInt = Math.floor(paisaRemainder);
  const daamRemainder = (paisaRemainder - paisaInt) * 4;
  const daamInt = Math.floor(daamRemainder);

  return {
    ropani: ropaniInt,
    aana: aanaInt,
    paisa: paisaInt,
    daam: daamInt,
    sqft: Math.round(sqft * 100) / 100,
    sqm: Math.round(sqm * 100) / 100,
    hectare: Math.round((sqm / 10000) * 10000) / 10000,
    acre: Math.round((sqft / 43560) * 10000) / 10000,
    bigha: Math.round((sqft / AREA_CONVERSIONS.bighaToSqft) * 10000) / 10000,
    kattha: Math.round((sqft / AREA_CONVERSIONS.katthaToSqft) * 10000) / 10000,
  };
}

export function ropaniToSqft(ropani: number, aana = 0, paisa = 0, daam = 0): number {
  return ropani * AREA_CONVERSIONS.ropaniToSqft +
    aana * AREA_CONVERSIONS.aanaToSqft +
    paisa * (AREA_CONVERSIONS.aanaToSqft / 4) +
    daam * (AREA_CONVERSIONS.aanaToSqft / 16);
}

export function sqmToSqft(sqm: number): number {
  return sqm * 10.7639;
}

export function formatArea(areaInAana: number): string {
  const ropani = Math.floor(areaInAana / 16);
  const aana = Math.floor(areaInAana % 16);
  if (ropani > 0) return `${ropani}-${aana}-0-0 (Ropani-Aana-Paisa-Daam)`;
  return `${aana} Aana`;
}

export function formatNPR(amount: number): string {
  if (amount >= 10000000) return `NPR ${(amount / 10000000).toFixed(2)} Crore`;
  if (amount >= 100000) return `NPR ${(amount / 100000).toFixed(2)} Lakh`;
  return `NPR ${amount.toLocaleString('en-IN')}`;
}
