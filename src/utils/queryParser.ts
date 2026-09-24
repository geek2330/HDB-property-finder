import { FlatType, SingaporeRegion, StoreyCategory } from '../types/property';

export interface ParsedQueryFilters {
  towns?: string[];
  regions?: SingaporeRegion[];
  flatTypes?: FlatType[];
  minPrice?: number;
  maxPrice?: number;
  minAreaSqm?: number;
  maxMrtDistanceMins?: number;
  minLeaseYears?: number;
  storeyCategories?: StoreyCategory[];
  cornerUnitOnly?: boolean;
  unblockedViewOnly?: boolean;
  detectedCriteria: { label: string; icon: string }[];
}

const KNOWN_TOWNS: Record<string, { town: string; region: SingaporeRegion }> = {
  'bishan': { town: 'Bishan', region: 'Central' },
  'queenstown': { town: 'Queenstown', region: 'Central' },
  'tampines': { town: 'Tampines', region: 'East' },
  'punggol': { town: 'Punggol', region: 'North-East' },
  'toa payoh': { town: 'Toa Payoh', region: 'Central' },
  'bukit merah': { town: 'Bukit Merah', region: 'Central' },
  'tiong bahru': { town: 'Bukit Merah', region: 'Central' },
  'duxton': { town: 'Bukit Merah', region: 'Central' },
  'clementi': { town: 'Clementi', region: 'West' },
  'bedok': { town: 'Bedok', region: 'East' },
  'woodlands': { town: 'Woodlands', region: 'North' },
  'kallang': { town: 'Kallang/Whampoa', region: 'Central' },
  'whampoa': { town: 'Kallang/Whampoa', region: 'Central' },
  'jurong east': { town: 'Jurong East', region: 'West' },
  'jurong': { town: 'Jurong East', region: 'West' },
  'sengkang': { town: 'Sengkang', region: 'North-East' },
};

export function parseNaturalQuery(query: string): ParsedQueryFilters {
  const normalized = query.toLowerCase().trim();
  if (!normalized) {
    return { detectedCriteria: [] };
  }

  const detected: { label: string; icon: string }[] = [];
  const result: ParsedQueryFilters = {
    detectedCriteria: detected
  };

  // 1. Detect Towns & Regions
  for (const [key, meta] of Object.entries(KNOWN_TOWNS)) {
    if (normalized.includes(key)) {
      if (!result.towns) result.towns = [];
      if (!result.towns.includes(meta.town)) {
        result.towns.push(meta.town);
        detected.push({ label: `Town: ${meta.town}`, icon: 'map-pin' });
      }
    }
  }

  // Detect Region names
  if (normalized.includes('central') && !result.regions) {
    result.regions = ['Central'];
    detected.push({ label: 'Central Region', icon: 'compass' });
  } else if (normalized.includes('east') && !normalized.includes('north-east') && !normalized.includes('jurong east') && !result.regions) {
    result.regions = ['East'];
    detected.push({ label: 'East Region', icon: 'compass' });
  } else if (normalized.includes('north-east') || normalized.includes('northeast')) {
    result.regions = ['North-East'];
    detected.push({ label: 'North-East Region', icon: 'compass' });
  } else if (normalized.includes('west') && !result.regions && !normalized.includes('no west sun')) {
    result.regions = ['West'];
    detected.push({ label: 'West Region', icon: 'compass' });
  } else if (normalized.includes('north') && !normalized.includes('north-east') && !normalized.includes('north-south')) {
    result.regions = ['North'];
    detected.push({ label: 'North Region', icon: 'compass' });
  }

  // 2. Detect Flat Types
  const flatTypesDetected: FlatType[] = [];
  if (/\b(2[\s-]?room|2rm)\b/i.test(normalized)) {
    flatTypesDetected.push('2-Room');
  }
  if (/\b(3[\s-]?room|3rm)\b/i.test(normalized)) {
    flatTypesDetected.push('3-Room');
  }
  if (/\b(4[\s-]?room|4rm)\b/i.test(normalized)) {
    flatTypesDetected.push('4-Room');
  }
  if (/\b(5[\s-]?room|5rm)\b/i.test(normalized)) {
    flatTypesDetected.push('5-Room');
  }
  if (/\b(executive|ea|em)\b/i.test(normalized)) {
    flatTypesDetected.push('Executive');
  }
  if (/\b(maisonette)\b/i.test(normalized)) {
    flatTypesDetected.push('Maisonette');
  }

  if (flatTypesDetected.length > 0) {
    result.flatTypes = flatTypesDetected;
    detected.push({ label: flatTypesDetected.join(', '), icon: 'home' });
  }

  // 3. Detect Price Thresholds
  // Match "under 800k", "< 750k", "below $900,000", "max 700k"
  const maxPriceMatch = normalized.match(/(?:under|below|max|<|less than|\$)\s*(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/i);
  if (maxPriceMatch) {
    let val = parseFloat(maxPriceMatch[1]);
    const unit = maxPriceMatch[2]?.toLowerCase();
    if (unit === 'm' || unit === 'million' || val < 10) {
      val = val * 1000000;
    } else if (unit === 'k' || unit === 'thousand' || (val >= 100 && val <= 2000)) {
      val = val * 1000;
    }
    if (val >= 300000 && val <= 2500000) {
      result.maxPrice = val;
      detected.push({ label: `Max S$${(val / 1000).toLocaleString()}k`, icon: 'dollar-sign' });
    }
  }

  // 4. Detect Floor Area
  // e.g. "> 100 sqm", ">110sqm", "> 1000 sqft", "spacious", "large"
  const areaMatch = normalized.match(/(?:>|above|at least|over|min)\s*(\d{2,4})\s*(sqm|sqft)?/i);
  if (areaMatch) {
    const num = parseInt(areaMatch[1], 10);
    const unit = areaMatch[2]?.toLowerCase();
    if (unit === 'sqft') {
      result.minAreaSqm = Math.round(num / 10.764);
      detected.push({ label: `Min ${num} sqft (~${result.minAreaSqm} sqm)`, icon: 'maximize' });
    } else {
      result.minAreaSqm = num;
      detected.push({ label: `Min ${num} sqm`, icon: 'maximize' });
    }
  } else if (normalized.includes('spacious') || normalized.includes('large unit') || normalized.includes('jumbo')) {
    result.minAreaSqm = 105;
    detected.push({ label: 'Spacious (>105 sqm)', icon: 'maximize' });
  }

  // 5. Detect MRT Walking Time
  if (normalized.includes('near mrt') || normalized.includes('next to mrt') || normalized.includes('walk to mrt')) {
    result.maxMrtDistanceMins = 6;
    detected.push({ label: 'MRT < 6 mins', icon: 'train' });
  } else if (normalized.includes('5 mins') || normalized.includes('5min')) {
    result.maxMrtDistanceMins = 5;
    detected.push({ label: 'MRT < 5 mins', icon: 'train' });
  }

  // 6. Detect Floor Level
  if (normalized.includes('high floor') || normalized.includes('top floor')) {
    result.storeyCategories = ['High (11-20)', 'Sky (21+)'];
    detected.push({ label: 'High / Sky Floor', icon: 'layers' });
  } else if (normalized.includes('sky floor') || normalized.includes('penthouse')) {
    result.storeyCategories = ['Sky (21+)'];
    detected.push({ label: 'Sky Floor (21+)', icon: 'layers' });
  }

  // 7. Detect Views & Features
  if (normalized.includes('unblocked') || normalized.includes('greenery view') || normalized.includes('park view')) {
    result.unblockedViewOnly = true;
    detected.push({ label: 'Unblocked View', icon: 'eye' });
  }
  if (normalized.includes('corner') || normalized.includes('privacy')) {
    result.cornerUnitOnly = true;
    detected.push({ label: 'Corner Unit', icon: 'shield' });
  }

  // 8. Detect Lease
  if (normalized.includes('long lease') || normalized.includes('fresh lease') || normalized.includes('new flat') || normalized.includes('high lease')) {
    result.minLeaseYears = 85;
    detected.push({ label: 'Lease >85 yrs', icon: 'calendar' });
  }

  return result;
}
