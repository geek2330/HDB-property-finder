/**
 * Singapore Land Authority (SLA) OneMap API Service
 * Official Documentation: https://www.onemap.gov.sg/apidocs/
 */

export interface OneMapSearchResultItem {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapSearchResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapSearchResultItem[];
}

export type OneMapBasemapStyle = 'Default' | 'Grey' | 'Night' | 'Original';

export class OneMapService {
  private static apiKey: string = (import.meta.env.VITE_ONEMAP_API_KEY as string) || '';

  /**
   * Sets or overrides the OneMap API Key at runtime
   */
  public static setApiKey(key: string): void {
    this.apiKey = key.trim();
  }

  /**
   * Retrieves the currently active OneMap API Key
   */
  public static getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Returns true if a custom OneMap API key is provided
   */
  public static hasApiKey(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Returns the official SLA OneMap tile URL template for Leaflet
   */
  public static getTileUrl(style: OneMapBasemapStyle = 'Default'): string {
    // SLA OneMap Tile server template
    // When API Key/Token is present, it can be passed in query or Authorization header
    if (this.apiKey) {
      return `https://www.onemap.gov.sg/maps/tiles/${style}/{z}/{x}/{y}.png?token=${encodeURIComponent(this.apiKey)}`;
    }
    return `https://www.onemap.gov.sg/maps/tiles/${style}/{z}/{x}/{y}.png`;
  }

  /**
   * Fallback OpenStreetMap standard tile URL if OneMap tiles are offline
   */
  public static getFallbackTileUrl(): string {
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }

  /**
   * Official OneMap attribution HTML
   */
  public static getAttribution(): string {
    return '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om.png" style="height:14px;width:auto;vertical-align:middle;margin-right:4px;" alt="OneMap" /> &copy; <a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a> | OneMap';
  }

  /**
   * Performs an address or postal code search using SLA OneMap Search API
   */
  public static async searchAddress(searchVal: string): Promise<OneMapSearchResultItem[]> {
    if (!searchVal.trim()) return [];

    try {
      const url = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
      url.searchParams.append('searchVal', searchVal);
      url.searchParams.append('returnGeom', 'Y');
      url.searchParams.append('getAddrDetails', 'Y');
      url.searchParams.append('pageNum', '1');

      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        throw new Error(`OneMap API error: ${response.statusText}`);
      }

      const data: OneMapSearchResponse = await response.json();
      return data.results || [];
    } catch (err) {
      console.warn('OneMap API address search query failed:', err);
      return [];
    }
  }

  /**
   * Returns planning area or town information for given coordinates via OneMap API
   */
  public static async getPlanningArea(lat: number, lng: number): Promise<string | null> {
    try {
      const url = new URL('https://www.onemap.gov.sg/api/public/popquery/getPlanningarea');
      url.searchParams.append('latitude', lat.toString());
      url.searchParams.append('longitude', lng.toString());

      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) return null;
      const data = await response.json();
      return data?.[0]?.pln_area_n || null;
    } catch {
      return null;
    }
  }
}
