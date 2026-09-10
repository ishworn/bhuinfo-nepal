// BhuInfo Nepal — Data Provider Factory
// Change DATA_PROVIDER env var to switch providers without code changes.

import { IDataProvider } from './providers/interface';
import { dummyDataProvider } from './providers/dummy';

function getDataProvider(): IDataProvider {
  const providerType = process.env.DATA_PROVIDER ?? 'dummy';
  switch (providerType) {
    case 'dummy':
    default:
      return dummyDataProvider;
    // Future providers:
    // case 'gis': return gisDataProvider;
    // case 'official': return officialDataProvider;
  }
}

export const dataProvider = getDataProvider();
export type { IDataProvider };
