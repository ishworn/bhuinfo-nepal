import { NextRequest, NextResponse } from 'next/server';
import { dataProvider } from '@/lib/data';
import { LandFilter } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: LandFilter = {};

    const province = searchParams.get('province');
    const district = searchParams.get('district');
    const municipality = searchParams.get('municipality');
    const ward = searchParams.get('ward');
    const landUse = searchParams.get('landUse');
    const ownershipType = searchParams.get('ownershipType');
    const roadType = searchParams.get('roadType');
    const floodRisk = searchParams.get('floodRisk');
    const availability = searchParams.get('availabilityStatus');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const query = searchParams.get('q');

    if (province) filters.province = province as LandFilter['province'];
    if (district) filters.district = district;
    if (municipality) filters.municipality = municipality;
    if (ward) filters.ward = parseInt(ward);
    if (landUse) filters.landUse = landUse as LandFilter['landUse'];
    if (ownershipType) filters.ownershipType = ownershipType as LandFilter['ownershipType'];
    if (roadType) filters.roadType = roadType as LandFilter['roadType'];
    if (floodRisk) filters.floodRisk = floodRisk as LandFilter['floodRisk'];
    if (availability) filters.availabilityStatus = availability as LandFilter['availabilityStatus'];
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    if (query) filters.searchQuery = query;

    const parcels = await dataProvider.getLandParcels(filters);
    return NextResponse.json({ success: true, data: parcels, count: parcels.length });
  } catch (error) {
    console.error('Land API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch land data' }, { status: 500 });
  }
}
