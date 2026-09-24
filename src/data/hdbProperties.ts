import { HDBProperty, SingaporeRegion } from '../types/property';
import heroImg from '../assets/images/hero_singapore_hdb_skyline_1790236556117.jpg';
import livingImg from '../assets/images/flat_scandi_living_interior_1790236577472.jpg';
import kitchenImg from '../assets/images/flat_open_kitchen_dining_1790236595413.jpg';
import balconyImg from '../assets/images/flat_balcony_park_view_1790236608498.jpg';

export interface TownBenchmark {
  town: string;
  region: SingaporeRegion;
  medianPrice4Room: number;
  medianPsf: number;
  popularMrt: string;
  activeListingsCount: number;
  highlight: string;
}

export const TOWN_BENCHMARKS: TownBenchmark[] = [
  { town: 'Bishan', region: 'Central', medianPrice4Room: 820000, medianPsf: 825, popularMrt: 'Bishan MRT (NS17/CC15)', activeListingsCount: 42, highlight: 'Top schools, Junction 8, dual-line interchange' },
  { town: 'Queenstown', region: 'Central', medianPrice4Room: 890000, medianPsf: 910, popularMrt: 'Queenstown MRT (EW19)', activeListingsCount: 38, highlight: 'City fringe, Dawson architectural precinct, high lease' },
  { town: 'Tampines', region: 'East', medianPrice4Room: 640000, medianPsf: 610, popularMrt: 'Tampines MRT (EW2/DT32)', activeListingsCount: 65, highlight: 'East hub, 3 major shopping malls, Tampines Hub' },
  { town: 'Punggol', region: 'North-East', medianPrice4Room: 610000, medianPsf: 590, popularMrt: 'Punggol MRT (NE17/CP4)', activeListingsCount: 74, highlight: 'Waterfront living, Digital District, young modern flats' },
  { town: 'Toa Payoh', region: 'Central', medianPrice4Room: 780000, medianPsf: 790, popularMrt: 'Toa Payoh MRT (NS19)', activeListingsCount: 35, highlight: 'Mature estate charm, 15 mins to Orchard, rich food heritage' },
  { town: 'Bukit Merah', region: 'Central', medianPrice4Room: 850000, medianPsf: 880, popularMrt: 'Tiong Bahru MRT (EW17)', activeListingsCount: 29, highlight: 'Pinnacle & Tiong Bahru cafes, ultra central location' },
  { town: 'Clementi', region: 'West', medianPrice4Room: 760000, medianPsf: 770, popularMrt: 'Clementi MRT (EW23)', activeListingsCount: 31, highlight: 'Tertiary education belt (NUS/SP/NP), direct EW line' },
  { town: 'Bedok', region: 'East', medianPrice4Room: 590000, medianPsf: 580, popularMrt: 'Bedok MRT (EW5)', activeListingsCount: 52, highlight: 'East coast lifestyle, hawker haven, Bedok Reservoir' },
  { town: 'Woodlands', region: 'North', medianPrice4Room: 510000, medianPsf: 490, popularMrt: 'Woodlands MRT (NS9/TE2)', activeListingsCount: 58, highlight: 'Regional center, RTS Link growth, spacious flat layouts' },
  { town: 'Kallang/Whampoa', region: 'Central', medianPrice4Room: 810000, medianPsf: 830, popularMrt: 'Kallang MRT (EW10)', activeListingsCount: 26, highlight: 'Riverfront views, near Bugis & CBD, Sports Hub' },
  { town: 'Jurong East', region: 'West', medianPrice4Room: 620000, medianPsf: 605, popularMrt: 'Jurong East MRT (NS1/EW24)', activeListingsCount: 44, highlight: 'Jurong Lake District, high speed rail vision, 4 mega malls' },
  { town: 'Sengkang', region: 'North-East', medianPrice4Room: 585000, medianPsf: 575, popularMrt: 'Sengkang MRT (NE16)', activeListingsCount: 68, highlight: 'Comprehensive LRT network, riverside park connectors' },
];

export const HDB_PROPERTIES: HDBProperty[] = [
  {
    id: 'hdb-01',
    title: 'Natura Loft DBSS High Floor Corner Unit',
    block: '273A',
    streetName: 'Bishan Street 24',
    town: 'Bishan',
    region: 'Central',
    postalCode: '571273',
    flatType: '4-Room',
    flatModel: 'DBSS',
    floorAreaSqm: 95,
    floorAreaSqft: 1022,
    askingPrice: 875000,
    psf: 856,
    storeyCategory: 'High (11-20)',
    floorLevelText: '16th to 18th Floor',
    remainingLeaseYears: 87,
    remainingLeaseMonths: 4,
    builtYear: 2012,
    leaseCommenceDate: 2012,
    mrtStation: 'Bishan MRT',
    mrtWalkMins: 6,
    mrtLines: ['North-South', 'Circle'],
    facing: 'North-South',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 890000,
    primarySchoolsNearby: [
      { name: 'Catholic High School (Primary)', distanceKm: 0.45, popularRanking: true },
      { name: 'Townsville Primary School', distanceKm: 0.82 },
      { name: 'Kuo Chuan Presbyterian Primary', distanceKm: 1.1 }
    ],
    amenities: [
      { type: 'MRT', name: 'Bishan MRT Interchange', walkMinutes: 6 },
      { type: 'Mall', name: 'Junction 8 Shopping Centre', walkMinutes: 6 },
      { type: 'Park', name: 'Bishan-Ang Mo Kio Park', walkMinutes: 4 },
      { type: 'Hawker', name: 'Bishan North Shopping Mall Hawker', walkMinutes: 3 }
    ],
    images: [balconyImg, livingImg, kitchenImg, heroImg],
    description: 'Rarely available DBSS Natura Loft 4-Room premium apartment with condo-style balcony, unblocked panoramic greenery views towards Bishan-Ang Mo Kio Park. Impeccable Scandinavian renovation with bespoke carpentry, concealed bomb shelter, and premium quartz countertops.',
    keyFeatures: [
      'Catholic High School within 1km balloting priority',
      'Sheltered linkway to bus stop and park connector',
      'Spacious regular layout with dedicated balcony and yard',
      'No ethnic quota restrictions — open to all buyers'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: true,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-02',
    title: 'SkyVille @ Dawson Architectural Sky Suite',
    block: '86',
    streetName: 'Dawson Road',
    town: 'Queenstown',
    region: 'Central',
    postalCode: '141086',
    flatType: '4-Room',
    flatModel: 'Premium Apartment Loft',
    floorAreaSqm: 83,
    floorAreaSqft: 893,
    askingPrice: 920000,
    psf: 1030,
    storeyCategory: 'Sky (21+)',
    floorLevelText: '35th to 38th Floor',
    remainingLeaseYears: 89,
    remainingLeaseMonths: 8,
    builtYear: 2015,
    leaseCommenceDate: 2015,
    mrtStation: 'Queenstown MRT',
    mrtWalkMins: 5,
    mrtLines: ['East-West'],
    facing: 'North-South',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 940000,
    primarySchoolsNearby: [
      { name: 'Queenstown Primary School', distanceKm: 0.52 },
      { name: 'New Town Primary School', distanceKm: 0.95 },
      { name: 'Gan Eng Seng Primary School', distanceKm: 1.3 }
    ],
    amenities: [
      { type: 'MRT', name: 'Queenstown MRT (EW19)', walkMinutes: 5 },
      { type: 'Mall', name: 'Dawson Place Shopping Complex', walkMinutes: 2 },
      { type: 'Hawker', name: 'Mei Ling Market & Food Centre', walkMinutes: 8 },
      { type: 'Park', name: 'Alexandra Canal Linear Park', walkMinutes: 3 }
    ],
    images: [heroImg, livingImg, kitchenImg, balconyImg],
    description: 'Iconic WOHA-designed SkyVille @ Dawson. High floor with breathtaking city skyline views. Direct access to multiple sky gardens on levels 14, 25, and the 47th-floor rooftop observatory. 5-minute sheltered walk to Queenstown MRT.',
    keyFeatures: [
      'Over 89 years of healthy remaining lease',
      'High-ceiling feel with cross-ventilation breezes',
      'Direct link to Alexandra Canal park connector leading to Marina Bay',
      'Designer open-concept chef kitchen with built-in European oven'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: false,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-03',
    title: 'Tampines GreenVerge Spacious 5-Room Flat',
    block: '622B',
    streetName: 'Tampines Avenue 12',
    town: 'Tampines',
    region: 'East',
    postalCode: '522622',
    flatType: '5-Room',
    flatModel: 'Improved',
    floorAreaSqm: 113,
    floorAreaSqft: 1216,
    askingPrice: 768000,
    psf: 631,
    storeyCategory: 'High (11-20)',
    floorLevelText: '12th to 14th Floor',
    remainingLeaseYears: 94,
    remainingLeaseMonths: 2,
    builtYear: 2020,
    leaseCommenceDate: 2020,
    mrtStation: 'Tampines North MRT / Tampines MRT',
    mrtWalkMins: 8,
    mrtLines: ['Downtown', 'East-West'],
    facing: 'North-East',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Well-Kept',
    townMedianPrice: 795000,
    primarySchoolsNearby: [
      { name: 'Poi Ching School', distanceKm: 0.65, popularRanking: true },
      { name: 'St. Hilda’s Primary School', distanceKm: 1.2, popularRanking: true },
      { name: 'Angsana Primary School', distanceKm: 0.85 }
    ],
    amenities: [
      { type: 'Mall', name: 'Our Tampines Hub & Century Square', walkMinutes: 10 },
      { type: 'Supermarket', name: 'Sheng Siong Supermarket Blk 610', walkMinutes: 3 },
      { type: 'Park', name: 'Tampines Eco Green', walkMinutes: 6 },
      { type: 'Hawker', name: 'Tampines Round Market', walkMinutes: 12 }
    ],
    images: [kitchenImg, livingImg, balconyImg, heroImg],
    description: 'Ultra-spacious 113 sqm 5-Room flat freshly MOPed in Tampines GreenVerge. Huge squarish living hall capable of creating a 4th study bedroom. Peaceful greenery orientation away from major roads.',
    keyFeatures: [
      'Huge 113 sqm footprint with 94 years lease balance',
      'Poi Ching School within 1km balloting zone',
      'Point block layout with quiet corner privacy',
      'Eligible for full First-Timer CPF Grants up to $80k'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: true,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-04',
    title: 'Treelodge@Punggol Eco-Waterfront 4-Room',
    block: '305D',
    streetName: 'Punggol Drive',
    town: 'Punggol',
    region: 'North-East',
    postalCode: '824305',
    flatType: '4-Room',
    flatModel: 'Premium Apartment',
    floorAreaSqm: 93,
    floorAreaSqft: 1001,
    askingPrice: 638000,
    psf: 637,
    storeyCategory: 'Mid (05-10)',
    floorLevelText: '8th to 10th Floor',
    remainingLeaseYears: 85,
    remainingLeaseMonths: 10,
    builtYear: 2011,
    leaseCommenceDate: 2011,
    mrtStation: 'Punggol MRT / Damai LRT',
    mrtWalkMins: 4,
    mrtLines: ['North-East'],
    facing: 'North-South',
    cornerUnit: true,
    unblockedView: false,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 660000,
    primarySchoolsNearby: [
      { name: 'Punggol View Primary School', distanceKm: 0.35 },
      { name: 'Oasis Primary School', distanceKm: 0.68 },
      { name: 'Horizon Primary School', distanceKm: 0.9 }
    ],
    amenities: [
      { type: 'MRT', name: 'Punggol MRT & Waterway Point', walkMinutes: 4 },
      { type: 'Mall', name: 'Waterway Point Mall', walkMinutes: 4 },
      { type: 'Park', name: 'Punggol Waterway Park', walkMinutes: 2 },
      { type: 'Supermarket', name: 'NTUC FairPrice Finest 24-hr', walkMinutes: 4 }
    ],
    images: [livingImg, kitchenImg, balconyImg, heroImg],
    description: 'HDB’s first eco-friendly development. Only 4 minutes sheltered stroll to Punggol MRT and Waterway Point. Direct access to Punggol Waterway Park. Modern neutral renovation with custom shoe cabinet and minimalist light fixtures.',
    keyFeatures: [
      '4-minute covered walk directly to Punggol MRT & Waterway Point',
      'Solar panels on block reducing conservancy charges',
      'Dual-flush eco fittings & energy-saving orientation',
      'Move-in condition, minimal renovation capital required'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: false },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: false,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-05',
    title: 'Toa Payoh Central 3-Room Heritage Flat',
    block: '178',
    streetName: 'Toa Payoh Central',
    town: 'Toa Payoh',
    region: 'Central',
    postalCode: '310178',
    flatType: '3-Room',
    flatModel: 'Improved',
    floorAreaSqm: 68,
    floorAreaSqft: 731,
    askingPrice: 488000,
    psf: 667,
    storeyCategory: 'High (11-20)',
    floorLevelText: '14th to 16th Floor',
    remainingLeaseYears: 67,
    remainingLeaseMonths: 1,
    builtYear: 1993,
    leaseCommenceDate: 1993,
    mrtStation: 'Toa Payoh MRT',
    mrtWalkMins: 3,
    mrtLines: ['North-South'],
    facing: 'South-East',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 515000,
    primarySchoolsNearby: [
      { name: 'CHIJ Primary (Toa Payoh)', distanceKm: 0.42, popularRanking: true },
      { name: 'Kheng Cheng School', distanceKm: 0.75 },
      { name: 'Pei Chun Public School', distanceKm: 1.05, popularRanking: true }
    ],
    amenities: [
      { type: 'MRT', name: 'Toa Payoh MRT Interchange', walkMinutes: 3 },
      { type: 'Mall', name: 'HDB Hub & Toa Payoh Mall', walkMinutes: 3 },
      { type: 'Hawker', name: 'Toa Payoh Vista Market & Food Centre', walkMinutes: 2 },
      { type: 'Park', name: 'Toa Payoh Town Park', walkMinutes: 5 }
    ],
    images: [kitchenImg, livingImg, heroImg, balconyImg],
    description: 'Ultra-convenient 3-minute stroll to Toa Payoh MRT and HDB Hub. Extensively transformed 3-Room with an open island kitchen, modern bathroom fittings, and unblocked views over the central town square. Ideal for young professionals or downsizing couples.',
    keyFeatures: [
      '3-minute covered walk to Toa Payoh MRT Station',
      'CHIJ Primary within 1km balloting distance',
      'Over $50,000 spent on complete rewiring & plumbing overhaul in 2022',
      'Low cash outlay, very attractive entry price for central mature town'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 2,
      bathrooms: 2,
      hasBalcony: false,
      hasServiceYard: true,
      hasHouseholdShelter: false
    }
  },
  {
    id: 'hdb-06',
    title: 'The Pinnacle@Duxton Sky High Prestige 4-Room',
    block: '1B',
    streetName: 'Cantonment Road',
    town: 'Bukit Merah',
    region: 'Central',
    postalCode: '085201',
    flatType: '4-Room',
    flatModel: 'Special S1',
    floorAreaSqm: 94,
    floorAreaSqft: 1011,
    askingPrice: 1198000,
    psf: 1184,
    storeyCategory: 'Sky (21+)',
    floorLevelText: '40th to 43rd Floor',
    remainingLeaseYears: 84,
    remainingLeaseMonths: 11,
    builtYear: 2011,
    leaseCommenceDate: 2011,
    mrtStation: 'Outram Park MRT / Tanjong Pagar MRT',
    mrtWalkMins: 4,
    mrtLines: ['East-West', 'North-East', 'Thomson-East Coast'],
    facing: 'North-South',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 1220000,
    primarySchoolsNearby: [
      { name: 'Cantonment Primary School', distanceKm: 0.15, popularRanking: true },
      { name: 'Radin Mas Primary School', distanceKm: 1.6 },
      { name: 'Zhangde Primary School', distanceKm: 1.8 }
    ],
    amenities: [
      { type: 'MRT', name: 'Outram Park Triple Line MRT', walkMinutes: 4 },
      { type: 'MRT', name: 'Tanjong Pagar MRT (CBD)', walkMinutes: 6 },
      { type: 'Hawker', name: 'Tanjong Pagar Plaza Food Centre', walkMinutes: 5 },
      { type: 'Mall', name: '100 AM Mall & Guoco Tower', walkMinutes: 6 }
    ],
    images: [heroImg, balconyImg, livingImg, kitchenImg],
    description: 'The pinnacle of public housing in Singapore. Level 42 offering unobstructed views across the Singapore Straits, Sentosa, and CBD skyline. Direct access to the world’s longest continuous 500-meter sky bridge on Level 50 and Level 26 jogging tracks.',
    keyFeatures: [
      'Triple MRT Line connectivity (East-West, North-East, TEL)',
      'Direct sheltered lift access to Cantonment Primary School',
      'Unsurpassed capital preservation and rental appeal',
      'World-famous 50th-storey skybridge resident privileges'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: false,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-07',
    title: 'Clementi Gateway High Floor 4-Room',
    block: '440B',
    streetName: 'Clementi Avenue 3',
    town: 'Clementi',
    region: 'West',
    postalCode: '122440',
    flatType: '4-Room',
    flatModel: 'Model A',
    floorAreaSqm: 93,
    floorAreaSqft: 1001,
    askingPrice: 838000,
    psf: 837,
    storeyCategory: 'High (11-20)',
    floorLevelText: '18th to 20th Floor',
    remainingLeaseYears: 91,
    remainingLeaseMonths: 5,
    builtYear: 2017,
    leaseCommenceDate: 2017,
    mrtStation: 'Clementi MRT',
    mrtWalkMins: 4,
    mrtLines: ['East-West', 'Cross Island'],
    facing: 'North-South',
    cornerUnit: false,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 860000,
    primarySchoolsNearby: [
      { name: 'Nan Hua Primary School', distanceKm: 0.48, popularRanking: true },
      { name: 'Clementi Primary School', distanceKm: 0.35 },
      { name: 'Pei Tong Primary School', distanceKm: 0.65 }
    ],
    amenities: [
      { type: 'MRT', name: 'Clementi MRT & Bus Interchange', walkMinutes: 4 },
      { type: 'Mall', name: 'The Clementi Mall & 321 Clementi', walkMinutes: 4 },
      { type: 'Hawker', name: 'Clementi 448 Market & Food Centre', walkMinutes: 3 },
      { type: 'Supermarket', name: 'FairPrice Finest Clementi Mall', walkMinutes: 4 }
    ],
    images: [livingImg, kitchenImg, balconyImg, heroImg],
    description: 'Gold standard location in the educational hub of the West. Under 500 meters to prestigious Nan Hua Primary School. Modern minimalist interior with built-in storage solutions and custom kitchen cabinetry.',
    keyFeatures: [
      'Nan Hua Primary School within 1km balloting priority',
      '4-minute direct sheltered walk to Clementi MRT & The Clementi Mall',
      'Over 91 years lease remaining for long-term equity growth',
      'Breezy north-south orientation with unblocked views towards West Coast'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: false,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-08',
    title: 'Bedok Reservoir Waterfront Executive Maisonette',
    block: '714',
    streetName: 'Bedok Reservoir Road',
    town: 'Bedok',
    region: 'East',
    postalCode: '470714',
    flatType: 'Maisonette',
    flatModel: 'Executive Maisonette',
    floorAreaSqm: 147,
    floorAreaSqft: 1582,
    askingPrice: 968000,
    psf: 611,
    storeyCategory: 'Mid (05-10)',
    floorLevelText: '7th to 9th Floor (2-Storey Unit)',
    remainingLeaseYears: 62,
    remainingLeaseMonths: 6,
    builtYear: 1988,
    leaseCommenceDate: 1988,
    mrtStation: 'Bedok North MRT',
    mrtWalkMins: 5,
    mrtLines: ['Downtown'],
    facing: 'North-East',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 990000,
    primarySchoolsNearby: [
      { name: 'Yu Neng Primary School', distanceKm: 0.55, popularRanking: true },
      { name: 'Red Swastika School', distanceKm: 0.78, popularRanking: true },
      { name: 'Damai Primary School', distanceKm: 0.32 }
    ],
    amenities: [
      { type: 'MRT', name: 'Bedok North MRT (DT29)', walkMinutes: 5 },
      { type: 'Park', name: 'Bedok Reservoir Park Watersports', walkMinutes: 3 },
      { type: 'Hawker', name: 'Blk 538 Bedok North Market', walkMinutes: 6 },
      { type: 'Supermarket', name: 'Sheng Siong Supermarket Blk 739A', walkMinutes: 4 }
    ],
    images: [balconyImg, livingImg, kitchenImg, heroImg],
    description: 'Rare double-storey Executive Maisonette with a sprawling 1,582 sqft configuration. Features double-volume living ceiling, 3 massive bedrooms upstairs with a helper’s room/study on the ground level. Direct front-row access to Bedok Reservoir kayaking and jogging tracks.',
    keyFeatures: [
      'Two full levels of landed-style living with internal architectural staircase',
      'Dual top primary schools (Yu Neng & Red Swastika) within 1km',
      '5 minutes walk to Downtown Line connecting directly to Marina Bay',
      'Priced at an incredible $611 psf for jumbo East space'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 4,
      bathrooms: 3,
      hasBalcony: true,
      hasServiceYard: true,
      hasHouseholdShelter: false
    }
  },
  {
    id: 'hdb-09',
    title: 'Woodlands South Rare Executive Apartment',
    block: '588',
    streetName: 'Woodlands Drive 16',
    town: 'Woodlands',
    region: 'North',
    postalCode: '730588',
    flatType: 'Executive',
    flatModel: 'Executive Apartment',
    floorAreaSqm: 142,
    floorAreaSqft: 1528,
    askingPrice: 688000,
    psf: 450,
    storeyCategory: 'High (11-20)',
    floorLevelText: '11th to 12th Floor',
    remainingLeaseYears: 73,
    remainingLeaseMonths: 3,
    builtYear: 1999,
    leaseCommenceDate: 1999,
    mrtStation: 'Woodlands South MRT',
    mrtWalkMins: 4,
    mrtLines: ['Thomson-East Coast'],
    facing: 'North-South',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Well-Kept',
    townMedianPrice: 720000,
    primarySchoolsNearby: [
      { name: 'Innova Primary School', distanceKm: 0.38 },
      { name: 'Woodgrove Primary School', distanceKm: 0.62 },
      { name: 'Si Ling Primary School', distanceKm: 0.85 }
    ],
    amenities: [
      { type: 'MRT', name: 'Woodlands South MRT (TE3)', walkMinutes: 4 },
      { type: 'Mall', name: 'Causeway Point Regional Mall', walkMinutes: 14 },
      { type: 'Supermarket', name: 'Giant Supermarket Vista Point', walkMinutes: 5 },
      { type: 'Park', name: 'Woodlands Waterfront Park', walkMinutes: 18 }
    ],
    images: [livingImg, kitchenImg, balconyImg, heroImg],
    description: 'Enormous 142 sqm Executive Apartment situated directly by the Thomson-East Coast Line. Huge squarish hall with dedicated study room easily converted to a 4th full bedroom. Unbeatable space-to-price ratio under $455 psf.',
    keyFeatures: [
      'Spectacular 142 sqm floorplate at just $450 psf',
      '4-minute walk to Woodlands South TEL MRT station with direct trains to Orchard & Shenton Way',
      'Adjacent to Vista Point amenities and 24-hr eateries',
      'Corner unit with private corridor entrance'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 4,
      bathrooms: 2,
      hasBalcony: true,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-10',
    title: 'Kallang Trivista Riverfront 3-Room Premium',
    block: '8',
    streetName: 'Upper Boon Keng Road',
    town: 'Kallang/Whampoa',
    region: 'Central',
    postalCode: '380008',
    flatType: '3-Room',
    flatModel: 'Premium Apartment',
    floorAreaSqm: 68,
    floorAreaSqft: 731,
    askingPrice: 620000,
    psf: 848,
    storeyCategory: 'High (11-20)',
    floorLevelText: '15th to 17th Floor',
    remainingLeaseYears: 88,
    remainingLeaseMonths: 2,
    builtYear: 2014,
    leaseCommenceDate: 2014,
    mrtStation: 'Kallang MRT',
    mrtWalkMins: 3,
    mrtLines: ['East-West'],
    facing: 'South-East',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 645000,
    primarySchoolsNearby: [
      { name: 'Bendemeer Primary School', distanceKm: 0.88 },
      { name: 'Hong Wen School', distanceKm: 1.4 },
      { name: 'Geylang Methodist Primary', distanceKm: 1.5 }
    ],
    amenities: [
      { type: 'MRT', name: 'Kallang MRT (EW10)', walkMinutes: 3 },
      { type: 'Hawker', name: 'Upper Boon Keng Market & Food Centre', walkMinutes: 2 },
      { type: 'Park', name: 'Kallang River Park Connector', walkMinutes: 1 },
      { type: 'Mall', name: 'Kallang Wave Mall & Sports Hub', walkMinutes: 10 }
    ],
    images: [balconyImg, livingImg, kitchenImg, heroImg],
    description: 'Rare city-fringe 3-Room with immediate riverfront jogging access along Kallang River. 3 minutes sheltered walk to Kallang MRT, only 3 stops to Bugis and 4 stops to Raffles Place. High floor with breezy south-east views.',
    keyFeatures: [
      'Just 3 minutes sheltered walk to Kallang MRT',
      'Scenic Kallang River park connector at doorstep',
      'High 88-year remaining lease with zero HIP upgrading required',
      'Over $65,000 architectural Japandi renovation'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 2,
      bathrooms: 2,
      hasBalcony: false,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-11',
    title: 'Jurong East Central 4-Room Near Westgate & JEM',
    block: '288B',
    streetName: 'Jurong East Street 21',
    town: 'Jurong East',
    region: 'West',
    postalCode: '602288',
    flatType: '4-Room',
    flatModel: 'Model A',
    floorAreaSqm: 92,
    floorAreaSqft: 990,
    askingPrice: 668000,
    psf: 674,
    storeyCategory: 'Mid (05-10)',
    floorLevelText: '8th to 10th Floor',
    remainingLeaseYears: 83,
    remainingLeaseMonths: 7,
    builtYear: 2009,
    leaseCommenceDate: 2009,
    mrtStation: 'Jurong East MRT Interchange',
    mrtWalkMins: 5,
    mrtLines: ['North-South', 'East-West', 'Jurong Region'],
    facing: 'North-South',
    cornerUnit: true,
    unblockedView: false,
    noWestSun: true,
    renovationCondition: 'Well-Kept',
    townMedianPrice: 690000,
    primarySchoolsNearby: [
      { name: 'Yuhua Primary School', distanceKm: 0.42 },
      { name: 'Fuhua Primary School', distanceKm: 0.85 },
      { name: 'Princess Elizabeth Primary', distanceKm: 1.2, popularRanking: true }
    ],
    amenities: [
      { type: 'MRT', name: 'Jurong East MRT & Future JRL', walkMinutes: 5 },
      { type: 'Mall', name: 'JEM, Westgate, IMM Mega Malls', walkMinutes: 5 },
      { type: 'Park', name: 'Jurong Lake Gardens & Science Centre', walkMinutes: 10 },
      { type: 'Supermarket', name: 'Don Don Donki JEM', walkMinutes: 5 }
    ],
    images: [kitchenImg, livingImg, heroImg, balconyImg],
    description: 'Live right in Singapore’s Second CBD (Jurong Lake District). 5 minutes walking distance to 4 interconnected mega malls (JEM, Westgate, IMM, JCube replacement). Quiet inner-facing stack with cross breeze and privacy.',
    keyFeatures: [
      '5 minutes to Jurong East Interchange (NSL, EWL, and upcoming JRL)',
      'Future capital upside from Jurong Innovation District and Lake transformation',
      'Squarish layout without awkward structural pillars',
      'Competitive asking price $22,000 under town median'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: false,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  },
  {
    id: 'hdb-12',
    title: 'Rivervale Crest 5-Room Premium High Floor',
    block: '124A',
    streetName: 'Rivervale Drive',
    town: 'Sengkang',
    region: 'North-East',
    postalCode: '541124',
    flatType: '5-Room',
    flatModel: 'Premium Apartment',
    floorAreaSqm: 110,
    floorAreaSqft: 1184,
    askingPrice: 648000,
    psf: 547,
    storeyCategory: 'High (11-20)',
    floorLevelText: '14th to 16th Floor',
    remainingLeaseYears: 77,
    remainingLeaseMonths: 11,
    builtYear: 2003,
    leaseCommenceDate: 2003,
    mrtStation: 'Bakau LRT / Sengkang MRT',
    mrtWalkMins: 2,
    mrtLines: ['North-East'],
    facing: 'North-South',
    cornerUnit: true,
    unblockedView: true,
    noWestSun: true,
    renovationCondition: 'Fully Renovated',
    townMedianPrice: 670000,
    primarySchoolsNearby: [
      { name: 'Rivervale Primary School', distanceKm: 0.28 },
      { name: 'Nan Chiau Primary School', distanceKm: 1.15, popularRanking: true },
      { name: 'Compassvale Primary School', distanceKm: 0.72 }
    ],
    amenities: [
      { type: 'MRT', name: 'Bakau LRT Station (2 stops to MRT)', walkMinutes: 2 },
      { type: 'Mall', name: 'Rivervale Plaza & NTUC FairPrice', walkMinutes: 3 },
      { type: 'Mall', name: 'Compass One Shopping Mall', walkMinutes: 9 },
      { type: 'Park', name: 'Sengkang Sculpture Park', walkMinutes: 5 }
    ],
    images: [livingImg, kitchenImg, balconyImg, heroImg],
    description: 'High floor, sun-drenched 110 sqm 5-Room with huge squarish living hall and master bedroom walk-in wardrobe. 2 minutes walk to Bakau LRT and Rivervale Plaza with 24-hr wet market, food court, and clinics.',
    keyFeatures: [
      'Huge 110 sqm layout with dedicated study nook',
      'Direct covered linkway to Rivervale Plaza & LRT',
      'Nan Chiau Primary School within accessible distance',
      'Priced at just $547 psf with zero COV risk'
    ],
    eipEligibility: { chinese: true, malay: true, indianOther: true },
    floorPlanLayout: {
      bedrooms: 3,
      bathrooms: 2,
      hasBalcony: true,
      hasServiceYard: true,
      hasHouseholdShelter: true
    }
  }
];

export const POPULAR_SEARCH_PRESETS = [
  { label: 'Bishan 4-Room Near MRT', query: '4-room bishan under 900k near mrt' },
  { label: 'Queenstown High Floor', query: 'queenstown high floor 4 room' },
  { label: 'Spacious 5-Room Tampines', query: '5-room tampines > 110 sqm' },
  { label: 'Affordable Bedok / Toa Payoh 3-Room', query: '3-room under 500k central' },
  { label: 'Rare Executive / Maisonette', query: 'executive maisonette > 140 sqm' },
  { label: 'Punggol Waterfront Living', query: 'punggol 4-room near waterway' }
];
