// BhuInfo Nepal — Core TypeScript Types
// All data is fictional/sample unless explicitly marked

export type Province =
  | 'Koshi'
  | 'Madhesh'
  | 'Bagmati'
  | 'Gandaki'
  | 'Lumbini'
  | 'Karnali'
  | 'Sudurpashchim';

export type LandUse =
  | 'Residential'
  | 'Agricultural'
  | 'Commercial'
  | 'Industrial'
  | 'Mixed'
  | 'Forest'
  | 'Riverbed'
  | 'Public'
  | 'Unknown';

export type OwnershipType =
  | 'Private'
  | 'Guthi'
  | 'Government'
  | 'Institutional'
  | 'Organization'
  | 'Unknown';

export type FloodRisk = 'None' | 'Low' | 'Moderate' | 'High' | 'Very High';
export type Slope = 'Flat' | 'Gentle' | 'Moderate' | 'Steep' | 'Very Steep';
export type Terrain = 'Plain' | 'Hill' | 'Mountain' | 'Valley' | 'Terai';
export type RoadType = 'None' | 'Trail' | 'Gravel' | 'Blacktopped' | 'Highway';
export type AvailabilityStatus = 'For Sale' | 'For Lease' | 'Not Listed' | 'Under Negotiation';

export type DataStatus = 'Sample' | 'Estimated' | 'Needs Verification' | 'Verified';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoPolygon {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: Record<string, unknown>;
}

export interface NearbyFacility {
  id: string;
  parcelId: string;
  type: 'School' | 'Hospital' | 'Market' | 'Bank' | 'Bus Stop' | 'Police' | 'Temple' | 'Restaurant' | 'Pharmacy' | 'Other';
  name: string;
  distanceKm: number;
  distanceLabel: string;
}

export interface PriceFactors {
  basePrice: number; // NPR per aana or per ropani
  locationFactor: number;
  roadFactor: number;
  infrastructureFactor: number;
  landUseFactor: number;
  accessibilityFactor: number;
  riskFactor: number;
}

export interface PriceEstimate {
  id: string;
  parcelId: string;
  available: boolean;
  unavailableReason?: string;
  basePrice: number;
  factors: PriceFactors;
  estimatedPricePerAana: number;
  estimatedTotal: number;
  estimatedRangeLow: number;
  estimatedRangeHigh: number;
  confidence: ConfidenceLevel;
  currency: 'NPR';
  dataStatus: DataStatus;
  lastUpdated: string;
}

export interface RiskScore {
  overall: number; // 0-100
  flood: number;
  riverProximity: number;
  slope: number;
  road: number;
  infrastructure: number;
  location: number;
  label: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';
  dataStatus: DataStatus;
}

export interface LandParcel {
  id: string;
  kittaNumber: string;
  province: Province;
  district: string;
  municipality: string;
  ward: number;
  area: number;
  areaUnit: 'Ropani' | 'Aana' | 'Bigha';
  areaInAana: number; // normalized
  areaInSqft: number;
  areaInSqm: number;
  landUse: LandUse;
  ownershipType: OwnershipType;
  latitude: number;
  longitude: number;
  geometry?: GeoPolygon;
  roadDistance: number; // meters
  roadWidth: number; // feet
  roadType: RoadType;
  riverDistance: number; // meters
  floodRisk: FloodRisk;
  slope: Slope;
  terrain: Terrain;
  electricity: boolean;
  water: boolean;
  drainage: boolean;
  internet: boolean;
  nearbyFacilities: NearbyFacility[];
  riskScore?: RiskScore;
  priceEstimate?: PriceEstimate;
  availabilityStatus: AvailabilityStatus;
  listingPrice?: number; // asking price if listed
  description: string;
  dataStatus: DataStatus;
  dataSource: string;
  lastUpdated: string;
  createdAt: string;
  tags: string[];
}

export interface LandFilter {
  province?: Province;
  district?: string;
  municipality?: string;
  ward?: number;
  landUse?: LandUse;
  ownershipType?: OwnershipType;
  minArea?: number;
  maxArea?: number;
  roadType?: RoadType;
  floodRisk?: FloodRisk;
  minPrice?: number;
  maxPrice?: number;
  availabilityStatus?: AvailabilityStatus;
  searchQuery?: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'risk-asc' | 'risk-desc' | 'newest' | 'oldest';

export interface ComparisonItem {
  parcelId: string;
  parcel: LandParcel;
}

export interface AdminStats {
  totalParcels: number;
  byProvince: Record<string, number>;
  byOwnership: Record<string, number>;
  byFloodRisk: Record<string, number>;
  byLandUse: Record<string, number>;
  listedParcels: number;
  averageRiskScore: number;
}

// Data Provider Interface — swap in real providers later
export interface IDataProvider {
  getLandParcels(filters?: LandFilter): Promise<LandParcel[]>;
  getLandById(id: string): Promise<LandParcel | null>;
  getNearbyFacilities(parcelId: string): Promise<NearbyFacility[]>;
  getPriceEstimate(parcelId: string): Promise<PriceEstimate | null>;
  getAdminStats(): Promise<AdminStats>;
  createLandParcel?(parcel: Omit<LandParcel, 'id' | 'createdAt' | 'updatedAt'>): Promise<LandParcel>;
  updateLandParcel?(id: string, parcel: Partial<LandParcel>): Promise<LandParcel>;
  deleteLandParcel?(id: string): Promise<void>;
}
