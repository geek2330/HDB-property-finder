import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, Layers, Key, Check, Compass, MapPin, Building, ExternalLink, X, RotateCcw } from 'lucide-react';
import { HDBProperty, ScoredProperty } from '../types/property';
import { OneMapService, OneMapBasemapStyle, OneMapSearchResultItem } from '../services/oneMapService';

interface OneMapInteractiveProps {
  properties: (HDBProperty | ScoredProperty)[];
  onSelectProperty?: (property: ScoredProperty | HDBProperty) => void;
  selectedPropertyId?: string | null;
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  showSearch?: boolean;
}

export const OneMapInteractive: React.FC<OneMapInteractiveProps> = ({
  properties,
  onSelectProperty,
  selectedPropertyId,
  height = '500px',
  initialCenter = [1.3521, 103.8198],
  initialZoom = 12,
  showSearch = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  const [basemapStyle, setBasemapStyle] = useState<OneMapBasemapStyle>('Default');
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => OneMapService.getApiKey());
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [keySavedMessage, setKeySavedMessage] = useState<boolean>(false);

  // Address search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<OneMapSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
    });

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile layer using OneMap
    const tileUrl = OneMapService.getTileUrl(basemapStyle);
    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: OneMapService.getAttribution(),
    }).addTo(map);

    // Fallback if OneMap tile fails
    tileLayer.on('tileerror', () => {
      // Keep tile layer intact or use fallback
    });

    tileLayerRef.current = tileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when basemapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const newUrl = OneMapService.getTileUrl(basemapStyle);
    tileLayerRef.current.setUrl(newUrl);
  }, [basemapStyle]);

  // Update Markers when properties list changes or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    properties.forEach((prop) => {
      if (!prop.latitude || !prop.longitude) return;

      const isSelected = selectedPropertyId === prop.id;
      const matchScore = (prop as ScoredProperty).matchScore;

      // Custom HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-hdb-marker',
        html: `
          <div style="
            background-color: ${isSelected ? '#0f172a' : '#e11d48'};
            color: #ffffff;
            font-family: ui-sans-serif, system-ui, sans-serif;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25);
            border: 2px solid #ffffff;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transform: translate(-50%, -100%);
            transition: transform 0.15s ease-out;
          ">
            <span>S$${(prop.askingPrice / 1000).toFixed(0)}k</span>
            ${matchScore ? `<span style="background: rgba(255,255,255,0.25); padding: 1px 4px; border-radius: 4px; font-size: 9px;">${matchScore}%</span>` : ''}
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([prop.latitude, prop.longitude], { icon: customIcon });

      // Popup Content
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 font-sans text-xs space-y-2';
      popupHtml.innerHTML = `
        <div style="font-weight: bold; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
          ${prop.title}
        </div>
        <div style="color: #64748b; font-size: 11px;">
          Blk ${prop.block} ${prop.streetName} · ${prop.town}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
          <div>
            <span style="font-size: 14px; font-weight: bold; color: #0f172a;">S$${prop.askingPrice.toLocaleString()}</span>
            <span style="color: #94a3b8; font-size: 10px; margin-left: 4px;">S$${prop.psf} psf</span>
          </div>
          <div style="color: #0284c7; font-weight: 600;">
            ${prop.mrtWalkMins} min walk
          </div>
        </div>
        <button id="view-prop-btn-${prop.id}" style="
          width: 100%;
          margin-top: 6px;
          background: #0f172a;
          color: #ffffff;
          padding: 6px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 11px;
          cursor: pointer;
          border: none;
        ">
          View Property Details
        </button>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-prop-btn-${prop.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectProperty) onSelectProperty(prop);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectProperty) onSelectProperty(prop);
      });

      markersLayerRef.current?.addLayer(marker);

      if (isSelected && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([prop.latitude, prop.longitude], 15, { duration: 1.2 });
        marker.openPopup();
      }
    });
  }, [properties, selectedPropertyId, onSelectProperty]);

  // Handle Search Input with SLA OneMap API
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const results = await OneMapService.searchAddress(searchQuery);
    setIsSearching(false);
    setSearchResults(results);
    setShowDropdown(results.length > 0);
  };

  // Fly to selected search result
  const handleSelectSearchResult = (result: OneMapSearchResultItem) => {
    const lat = parseFloat(result.LATITUDE);
    const lng = parseFloat(result.LONGITUDE);

    if (isNaN(lat) || isNaN(lng) || !mapInstanceRef.current) return;

    setShowDropdown(false);
    setSearchQuery(result.BUILDING !== 'NIL' ? result.BUILDING : result.ADDRESS);

    // Fly to location
    mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.5 });

    // Place temporary marker
    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
    }

    const searchIcon = L.divIcon({
      className: 'custom-search-marker',
      html: `
        <div style="
          background-color: #2563eb;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          transform: translate(-50%, -100%);
        ">
          📍 ${result.BUILDING !== 'NIL' ? result.BUILDING : result.ROAD_NAME}
        </div>
      `,
      iconSize: [0, 0],
    });

    const marker = L.marker([lat, lng], { icon: searchIcon }).addTo(mapInstanceRef.current);
    marker.bindPopup(`<b>${result.ADDRESS}</b><br/>Postal: ${result.POSTAL || 'N/A'}`).openPopup();
    searchMarkerRef.current = marker;
  };

  // Save API key
  const handleSaveApiKey = () => {
    OneMapService.setApiKey(apiKeyInput);
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(OneMapService.getTileUrl(basemapStyle));
    }
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyModal(false);
    }, 1500);
  };

  // Reset to Island View
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(initialCenter, initialZoom, { duration: 1 });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 flex flex-col">
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: SLA OneMap Search Bar */}
        {showSearch ? (
          <div className="relative pointer-events-auto flex-1 max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search OneMap by postal code, block, or street..."
                className="w-full bg-white/95 backdrop-blur-md text-xs text-slate-900 pl-8 pr-16 py-2 rounded-xl border border-slate-200/90 shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </form>

            {/* OneMap Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto z-[1010] p-1 space-y-0.5">
                <div className="flex items-center justify-between px-2.5 py-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>SLA OneMap Geocoder Results ({searchResults.length})</span>
                  <button onClick={() => setShowDropdown(false)} className="hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-lg text-xs transition-colors flex items-start gap-2 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {item.BUILDING !== 'NIL' ? item.BUILDING : item.ADDRESS}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.ROAD_NAME} {item.POSTAL ? `· S(${item.POSTAL})` : ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : <div />}

        {/* Right Action Chips: Basemap & API Key Button */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Basemap Style Selector */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-md flex items-center text-xs">
            {(['Default', 'Grey', 'Night'] as OneMapBasemapStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setBasemapStyle(style)}
                className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
                  basemapStyle === style
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Reset Map View */}
          <button
            onClick={handleResetView}
            title="Reset to whole Singapore"
            className="p-2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* OneMap API Key Dialog Trigger */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`px-2.5 py-1.5 rounded-xl border shadow-md flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer ${
              OneMapService.hasApiKey()
                ? 'bg-emerald-50/95 border-emerald-300 text-emerald-800'
                : 'bg-white/95 border-slate-200/90 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">
              {OneMapService.hasApiKey() ? 'OneMap API Connected' : 'OneMap API Key'}
            </span>
          </button>
        </div>
      </div>

      {/* Actual Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-0" />

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] text-slate-700 flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
          <span>HDB Listing</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
          <span>Selected Flat</span>
        </span>
        <span className="text-slate-400 font-mono">
          {properties.length} Active Pins
        </span>
      </div>

      {/* OneMap API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">SLA OneMap API Integration</h3>
                  <p className="text-[11px] text-slate-500">Official Singapore geospatial services</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                This application renders interactive Singapore basemaps using the <strong>Singapore Land Authority (SLA) OneMap</strong> geospatial server.
              </p>
              <p>
                You can configure a custom <code>VITE_ONEMAP_API_KEY</code> token to authenticate high-frequency address searching, reverse geocoding, and public transit routing.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                OneMap API Key / Token
              </label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste your SLA OneMap token or API key here..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Stored in environment as <code>VITE_ONEMAP_API_KEY</code></span>
                <a
                  href="https://www.onemap.gov.sg/apidocs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline flex items-center gap-1"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {keySavedMessage && (
              <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>OneMap API Key updated successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput('');
                  OneMapService.setApiKey('');
                  setShowKeyModal(false);
                }}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Clear Key
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Save & Apply Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
