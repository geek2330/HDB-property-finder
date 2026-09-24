import { HDBProperty, PropertyFilters, ScoredProperty } from '../types/property';
import { parseNaturalQuery } from './queryParser';

export function filterAndScoreProperties(
  properties: HDBProperty[],
  filters: PropertyFilters
): ScoredProperty[] {
  // Check if natural query provided and parse it
  const parsed = filters.query ? parseNaturalQuery(filters.query) : null;

  // Compute effective filter constraints: user explicit filters take priority unless query specifies
  const effectiveTowns = filters.towns.length > 0
    ? filters.towns
    : (parsed?.towns && parsed.towns.length > 0 ? parsed.towns : []);

  const effectiveRegions = filters.regions.length > 0
    ? filters.regions
    : (parsed?.regions && parsed.regions.length > 0 ? parsed.regions : []);

  const effectiveFlatTypes = filters.flatTypes.length > 0
    ? filters.flatTypes
    : (parsed?.flatTypes && parsed.flatTypes.length > 0 ? parsed.flatTypes : []);

  const effectiveMaxPrice = filters.maxPrice < 1500000
    ? filters.maxPrice
    : (parsed?.maxPrice ?? filters.maxPrice);

  const effectiveMinPrice = filters.minPrice > 300000
    ? filters.minPrice
    : (parsed?.minPrice ?? filters.minPrice);

  const effectiveMinArea = filters.minAreaSqm > 40
    ? filters.minAreaSqm
    : (parsed?.minAreaSqm ?? filters.minAreaSqm);

  const effectiveMaxMrt = filters.maxMrtDistanceMins < 20
    ? filters.maxMrtDistanceMins
    : (parsed?.maxMrtDistanceMins ?? filters.maxMrtDistanceMins);

  const effectiveMinLease = filters.minLeaseYears > 50
    ? filters.minLeaseYears
    : (parsed?.minLeaseYears ?? filters.minLeaseYears);

  const effectiveStorey = filters.storeyCategories.length > 0
    ? filters.storeyCategories
    : (parsed?.storeyCategories ?? []);

  const effectiveCorner = filters.cornerUnitOnly || (parsed?.cornerUnitOnly ?? false);
  const effectiveUnblocked = filters.unblockedViewOnly || (parsed?.unblockedViewOnly ?? false);
  const effectiveNoWestSun = filters.noWestSunOnly;

  // Filter pass
  const matched = properties.filter((prop) => {
    // Town filter
    if (effectiveTowns.length > 0 && !effectiveTowns.includes(prop.town)) {
      return false;
    }

    // Region filter
    if (effectiveRegions.length > 0 && !effectiveRegions.includes(prop.region)) {
      return false;
    }

    // Flat Type filter
    if (effectiveFlatTypes.length > 0 && !effectiveFlatTypes.includes(prop.flatType)) {
      return false;
    }

    // Price filter
    if (prop.askingPrice < effectiveMinPrice || prop.askingPrice > effectiveMaxPrice) {
      return false;
    }

    // Area filter (sqm)
    if (prop.floorAreaSqm < effectiveMinArea || prop.floorAreaSqm > filters.maxAreaSqm) {
      return false;
    }

    // MRT Walk distance
    if (prop.mrtWalkMins > effectiveMaxMrt) {
      return false;
    }

    // Remaining Lease
    if (prop.remainingLeaseYears < effectiveMinLease) {
      return false;
    }

    // Storey Category
    if (effectiveStorey.length > 0 && !effectiveStorey.includes(prop.storeyCategory)) {
      return false;
    }

    // Renovation condition
    if (filters.renovationCondition && filters.renovationCondition !== 'all') {
      if (prop.renovationCondition !== filters.renovationCondition) {
        return false;
      }
    }

    // Feature flags
    if (effectiveCorner && !prop.cornerUnit) return false;
    if (effectiveUnblocked && !prop.unblockedView) return false;
    if (effectiveNoWestSun && !prop.noWestSun) return false;

    // Direct text fallback query search if query was not entirely parsed into facets
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const searchableText = `${prop.title} ${prop.town} ${prop.streetName} ${prop.flatType} ${prop.flatModel} ${prop.mrtStation} ${prop.description} ${prop.keyFeatures.join(' ')}`.toLowerCase();
      // If none of the parsed facets matched and words don't match, check substring
      const terms = q.split(/\s+/).filter((t) => t.length > 2 && !['room', 'flat', 'near', 'with', 'under', 'from'].includes(t));
      if (terms.length > 0 && !terms.some((t) => searchableText.includes(t))) {
        // give benefit of doubt if parsed matched anything
        if (!parsed || parsed.detectedCriteria.length === 0) {
          return false;
        }
      }
    }

    return true;
  });

  // Recommendation Scoring Pass
  const scored: ScoredProperty[] = matched.map((prop) => {
    let score = 50; // base score
    const matchReasons: string[] = [];

    // 1. Price Value vs Town Median
    const priceDiff = prop.townMedianPrice - prop.askingPrice;
    if (priceDiff > 0) {
      score += 20;
      matchReasons.push(`S$${Math.round(priceDiff / 1000)}k below town median price`);
    } else if (priceDiff === 0) {
      score += 10;
    } else {
      score += 5; // slight discount for premium tier
    }

    // 2. Transit & MRT proximity
    if (prop.mrtWalkMins <= 4) {
      score += 18;
      matchReasons.push(`${prop.mrtWalkMins}-min walk to ${prop.mrtStation}`);
    } else if (prop.mrtWalkMins <= 6) {
      score += 14;
      matchReasons.push(`${prop.mrtWalkMins}-min stroll to ${prop.mrtStation}`);
    } else if (prop.mrtWalkMins <= 8) {
      score += 8;
    }

    // 3. Lease Health
    if (prop.remainingLeaseYears >= 88) {
      score += 15;
      matchReasons.push(`High remaining lease of ${prop.remainingLeaseYears} years`);
    } else if (prop.remainingLeaseYears >= 75) {
      score += 10;
    }

    // 4. Space & Layout
    if (prop.floorAreaSqm >= 110) {
      score += 12;
      matchReasons.push(`Generous ${prop.floorAreaSqm} sqm (${prop.floorAreaSqft} sqft) footprint`);
    } else if (prop.floorAreaSqm >= 93) {
      score += 8;
    }

    // 5. Views & Privacy
    if (prop.unblockedView) {
      score += 6;
      if (matchReasons.length < 3) {
        matchReasons.push('Unblocked panoramic greenery/city view');
      }
    }
    if (prop.cornerUnit) {
      score += 4;
      if (matchReasons.length < 3) {
        matchReasons.push('Corner stack offering maximum privacy');
      }
    }

    // 6. Popular Schools within 1km
    const topSchool = prop.primarySchoolsNearby.find((s) => s.popularRanking && s.distanceKm <= 1.0);
    if (topSchool) {
      score += 8;
      if (matchReasons.length < 3) {
        matchReasons.push(`${topSchool.name} within 1km`);
      }
    }

    // Fallback match reasons if fewer than 2
    if (matchReasons.length === 0) {
      matchReasons.push('Optimal balance of price and location');
      matchReasons.push(`${prop.renovationCondition} with squarish layout`);
    } else if (matchReasons.length === 1) {
      matchReasons.push(`${prop.renovationCondition} move-in ready condition`);
    }

    // Clamp score between 65 and 99
    const normalizedScore = Math.min(99, Math.max(68, score));

    return {
      ...prop,
      matchScore: normalizedScore,
      matchReasons: matchReasons.slice(0, 3)
    };
  });

  // Sort pass
  return scored.sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.askingPrice - b.askingPrice;
      case 'price-desc':
        return b.askingPrice - a.askingPrice;
      case 'area-desc':
        return b.floorAreaSqm - a.floorAreaSqm;
      case 'psf-asc':
        return a.psf - b.psf;
      case 'lease-desc':
        return b.remainingLeaseYears - a.remainingLeaseYears;
      case 'mrt-asc':
        return a.mrtWalkMins - b.mrtWalkMins;
      case 'recommended':
      default:
        return b.matchScore - a.matchScore;
    }
  });
}
