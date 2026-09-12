// Prisma seed script to populate PostgreSQL / database with the 40+ sample parcels
import { PrismaClient } from '@prisma/client';
import DUMMY_PARCELS from '../lib/data/dummy-parcels';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy parcels into database...');

  // Create default sample DataSource
  const dataSource = await prisma.dataSource.upsert({
    where: { id: 'sample-ds-01' },
    update: {},
    create: {
      id: 'sample-ds-01',
      name: 'BhuInfo Nepal Fictional Prototype Dataset',
      type: 'SAMPLE_MOCK',
      provider: 'BhuInfo Nepal In-Memory Generator',
      isActive: true,
      license: 'Prototype Demo Only',
    },
  });

  for (const p of DUMMY_PARCELS) {
    await prisma.landParcel.upsert({
      where: { kittaNumber: p.kittaNumber },
      update: {},
      create: {
        id: p.id,
        kittaNumber: p.kittaNumber,
        province: p.province,
        district: p.district,
        municipality: p.municipality,
        ward: p.ward,
        area: p.area,
        areaUnit: p.areaUnit,
        areaInAana: p.areaInAana,
        areaInSqft: p.areaInSqft,
        areaInSqm: p.areaInSqm,
        landUse: p.landUse,
        ownershipType: p.ownershipType,
        latitude: p.latitude,
        longitude: p.longitude,
        roadDistance: p.roadDistance,
        roadWidth: p.roadWidth,
        roadType: p.roadType,
        riverDistance: p.riverDistance,
        floodRisk: p.floodRisk,
        slope: p.slope,
        terrain: p.terrain,
        electricity: p.electricity,
        water: p.water,
        drainage: p.drainage,
        internet: p.internet,
        availabilityStatus: p.availabilityStatus,
        dataStatus: p.dataStatus,
        description: p.description,
        tags: JSON.stringify(p.tags),
        dataSourceId: dataSource.id,
        facilities: {
          create: p.nearbyFacilities.map((f) => ({
            type: f.type,
            name: f.name,
            distanceKm: f.distanceKm,
            distanceLabel: f.distanceLabel,
          })),
        },
      },
    });
  }

  console.log(`Successfully seeded ${DUMMY_PARCELS.length} sample land parcels!`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
