export type FlatType = '2-Room' | '3-Room' | '4-Room' | '5-Room' | 'Executive' | 'Maisonette';

export type SingaporeRegion = 'Central' | 'East' | 'North' | 'North-East' | 'West';

export type StoreyCategory = 'Low (01-04)' | 'Mid (05-10)' | 'High (11-20)' | 'Sky (21+)';

export type RenovationCondition = 'Fully Renovated' | 'Well-Kept' | 'Original Condition';

export type MRTLine = 'North-South' | 'East-West' | 'Circle' | 'Downtown' | 'Thomson-East Coast' | 'North-East' | 'Cross Island' | 'Jurong Region';

export interface NearbySchool {
  name: string;
  distanceKm: number;
  popularRanking?: boolean;
}

export interface NearbyAmenity {
  type: 'MRT' | 'Hawker' | 'Mall' | 'Park' | 'Supermarket';
  name: string;
  walkMinutes: number;
}

export interface HDBProperty {
  id: string;
  title: string;
  block: string;
  streetName: string;
  town: string;
  region: SingaporeRegion;
  postalCode: string;
  flatType: FlatType;
  flatModel: string;
  floorAreaSqm: number;
  floorAreaSqft: number;
  askingPrice: number;
  psf: number;
  storeyCategory: StoreyCategory;
  floorLevelText: string;
  remainingLeaseYears: number;
  remainingLeaseMonths: number;
  builtYear: number;
  leaseCommenceDate: number;
  mrtStation: string;
  mrtWalkMins: number;
  mrtLines: MRTLine[];
  facing: 'North-South' | 'North-East' | 'South-East' | 'East-West';
  cornerUnit: boolean;
  unblockedView: boolean;
  noWestSun: boolean;
  renovationCondition: RenovationCondition;
  townMedianPrice: number;
  primarySchoolsNearby: NearbySchool[];
  amenities: NearbyAmenity[];
  images: string[];
  description: string;
  keyFeatures: string[];
  eipEligibility: {
    chinese: boolean;
    malay: boolean;
    indianOther: boolean;
  };
  floorPlanLayout: {
    bedrooms: number;
    bathrooms: number;
    hasBalcony: boolean;
    hasServiceYard: boolean;
    hasHouseholdShelter: boolean;
  };
}

export interface PropertyFilters {
  query: string;
  towns: string[];
  regions: SingaporeRegion[];
  minPrice: number;
  maxPrice: number;
  minAreaSqm: number;
  maxAreaSqm: number;
  unitMeasurement: 'sqm' | 'sqft';
  flatTypes: FlatType[];
  maxMrtDistanceMins: number;
  minLeaseYears: number;
  storeyCategories: StoreyCategory[];
  renovationCondition: string;
  cornerUnitOnly: boolean;
  unblockedViewOnly: boolean;
  noWestSunOnly: boolean;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'area-desc' | 'psf-asc' | 'lease-desc' | 'mrt-asc';
}

export interface ScoredProperty extends HDBProperty {
  matchScore: number;
  matchReasons: string[];
}
