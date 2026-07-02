import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Compass, MapPin, ExternalLink, Navigation } from 'lucide-react';
import './PHMapPanel.css';

import type { AccentType } from './AccentModal';

interface PHMapPanelProps {
  sheets: any[];
  selectedItem: any;
  searchQuery: string;
  onSelectSheet: (sheetNo: string) => void;
  accent: AccentType;
}

const ACCENT_COLORS = {
  'raycast-red': '#ff3b30',
  'cit-gold': '#ffc72c',
  'cit-maroon': '#b31010',
  'emerald-cyber': '#10b981',
};

const BASE_LAYERS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
    subdomains: 'abcd',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    subdomains: '',
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
    subdomains: 'abc',
  }
};

export const PHMapPanel: React.FC<PHMapPanelProps> = ({
  sheets,
  selectedItem,
  searchQuery,
  onSelectSheet,
  accent,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const tileLayersRef = useRef<{ [key: string]: any }>({});
  const layersMapRef = useRef<Map<string, any>>(new Map());
  const gpsMarkerRef = useRef<any>(null);
  const [hoveredSheet, setHoveredSheet] = useState<any>(null);
  const [selectedSheetData, setSelectedSheetData] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sync selectedSheetData inside render when selectedItem changes
  const [prevSelectedItem, setPrevSelectedItem] = useState<any>(null);
  if (selectedItem !== prevSelectedItem) {
    setPrevSelectedItem(selectedItem);
    if (!selectedItem || selectedItem.category !== 'map') {
      setSelectedSheetData(null);
    } else {
      setSelectedSheetData(selectedItem.rawItem || selectedItem);
    }
  }

  // New HUD states
  const [statusFilter, setStatusFilter] = useState<'all' | 'owned' | 'scan'>('all');
  const [baseLayer, setBaseLayer] = useState<'dark' | 'satellite' | 'topo'>('dark');
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [compassRotation, setCompassRotation] = useState(0);

  const activeColor = ACCENT_COLORS[accent] || '#ff3b30';

  // Dynamic fitBounds padding options based on window width to keep selected sheets in the right clear zone
  const getFitBoundsOptions = React.useCallback(() => {
    const isDesktop = window.innerWidth > 1100;
    if (isDesktop) {
      const leftPadding = Math.round(window.innerWidth * 0.52);
      return {
        paddingTopLeft: [leftPadding, 120] as [number, number],
        paddingBottomRight: [80, 80] as [number, number],
        maxZoom: 9,
        animate: true,
        duration: 0.8,
      };
    }
    return {
      padding: [50, 50] as [number, number],
      maxZoom: 9,
      animate: true,
      duration: 0.8,
    };
  }, []);

  // Helper to re-apply the filter-based style to a single sheet layer
  const applyLayerFilterStyle = React.useCallback((sheet: any, rectLayer: any) => {
    const query = searchQuery.trim().toLowerCase();
    const isSelected = selectedItem && selectedItem.sheet_no === sheet.sheet_no;

    if (isSelected) {
      rectLayer.setStyle({
        color: activeColor,
        weight: 2.5,
        fillColor: activeColor,
        fillOpacity: 0.35,
      });
      rectLayer.bringToFront();
      return;
    }

    const matchesSearch = !query || 
      sheet.sheet_name.toLowerCase().includes(query) ||
      sheet.sheet_no.toLowerCase().includes(query);

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'owned' && sheet.library_owns === 'Yes') ||
      (statusFilter === 'scan' && sheet.scan && sheet.scan !== 'NONE');

    if (matchesSearch && matchesStatus) {
      rectLayer.setStyle({
        color: activeColor,
        weight: 1.2,
        fillColor: activeColor,
        fillOpacity: 0.15,
      });
    } else {
      rectLayer.setStyle({
        color: '#2a2a2e',
        weight: 0.4,
        fillColor: '#000000',
        fillOpacity: 0.01,
      });
    }
  }, [searchQuery, selectedItem, activeColor, statusFilter]);

  // 3. Update styles when searchQuery, filter, or accent theme changes
  const updateStyles = React.useCallback(() => {
    if (layersMapRef.current.size === 0) return;
    
    sheets.forEach((sheet) => {
      const rectLayer = layersMapRef.current.get(sheet.sheet_no);
      if (rectLayer) {
        applyLayerFilterStyle(sheet, rectLayer);
      }
    });
  }, [sheets, applyLayerFilterStyle]);

  // Memoize map sheet statistics
  const stats = useMemo(() => {
    const total = sheets.length;
    const owned = sheets.filter((s) => s.library_owns === 'Yes').length;
    const scanOnly = sheets.filter((s) => s.scan && s.scan !== 'NONE').length;
    const ownedPercent = total > 0 ? Math.round((owned / total) * 100) : 0;
    const scanPercent = total > 0 ? Math.round((scanOnly / total) * 100) : 0;
    return { total, owned, scanOnly, ownedPercent, scanPercent };
  }, [sheets]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current || mapRef.current) return;

    const isDesktop = window.innerWidth > 1100;
    const initialCenter: [number, number] = isDesktop ? [12.5, 117.2] : [12.0, 122.0];
    const initialZoom = isDesktop ? 6 : 5;

    // Initial center on the Philippines (shifted right on desktop)
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
      maxBounds: [
        [3.0, 110.0],
        [22.0, 130.0],
      ],
      maxBoundsViscosity: 0.8,
    });

    mapRef.current = map;

    // Create Tile Layer Instances
    tileLayersRef.current.dark = L.tileLayer(BASE_LAYERS.dark.url, {
      attribution: BASE_LAYERS.dark.attribution,
      subdomains: BASE_LAYERS.dark.subdomains,
      maxZoom: 20,
    });

    tileLayersRef.current.satellite = L.tileLayer(BASE_LAYERS.satellite.url, {
      attribution: BASE_LAYERS.satellite.attribution,
      maxZoom: 19,
    });

    tileLayersRef.current.topo = L.tileLayer(BASE_LAYERS.topo.url, {
      attribution: BASE_LAYERS.topo.attribution,
      subdomains: BASE_LAYERS.topo.subdomains,
      maxZoom: 17,
    });

    // Add initial base tile layer
    tileLayersRef.current[baseLayer].addTo(map);

    // Make map container focusable for keyboard controls
    map.getContainer().setAttribute('tabindex', '0');
    map.keyboard.enable();

    // Custom Zoom Control at the top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add HUD Event Listeners
    map.on('mousemove', (e: any) => {
      setMouseCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    map.on('mouseout', () => {
      setMouseCoords(null);
    });

    map.on('move', () => {
      const center = map.getCenter();
      const rot = Math.round((center.lat * 12 + center.lng * 12) % 360);
      setCompassRotation(rot);
    });

    setMapLoaded(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (gpsMarkerRef.current) {
        gpsMarkerRef.current.remove();
        gpsMarkerRef.current = null;
      }
    };
  }, [baseLayer, mapLoaded]);

  // Handle base layer changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Remove all layers
    Object.values(tileLayersRef.current).forEach((layer: any) => {
      if (layer) layer.remove();
    });

    // Add selected layer
    const activeTile = tileLayersRef.current[baseLayer];
    if (activeTile) {
      activeTile.addTo(mapRef.current);
    }
  }, [baseLayer, mapLoaded]);

  // Listen for Ctrl+M to focus map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (mapRef.current) {
          mapRef.current.getContainer().focus();
          window.dispatchEvent(new CustomEvent('trigger-toast', {
            detail: { message: "Map console focused! Pan with Arrows, Zoom with +/-. Press ESC to exit." }
          }));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapLoaded]);

  // Listen for ESC on map container to focus search back
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const mapElement = mapRef.current.getContainer();
    if (!mapElement) return;

    const handleMapKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('focus-search-input'));
      }
    };

    mapElement.addEventListener('keydown', handleMapKeyDown);
    return () => mapElement.removeEventListener('keydown', handleMapKeyDown);
  }, [mapLoaded]);

  // 2. Render Sheet Rectangles once sheets are loaded
  useEffect(() => {
    const L = (window as any).L;
    if (!mapLoaded || !mapRef.current || sheets.length === 0) return;

    // Clear any existing rectangle layers
    layersMapRef.current.forEach((layer) => {
      layer.remove();
    });
    layersMapRef.current.clear();

    const normalStyle = {
      color: '#5d5d62',
      weight: 0.8,
      fillColor: activeColor,
      fillOpacity: 0.05,
      className: 'map-sheet-rect',
    };

    sheets.forEach((sheet) => {
      const { bounds, sheet_no } = sheet;
      
      const rectBounds = [
        [bounds.min_lat, bounds.min_lon],
        [bounds.max_lat, bounds.max_lon]
      ];

      const rect = L.rectangle(rectBounds, normalStyle).addTo(mapRef.current);

      // Event handlers
      rect.on('mouseover', () => {
        setHoveredSheet(sheet);
        rect.setStyle({
          color: activeColor,
          weight: 2,
          fillOpacity: 0.25,
        });
      });

      rect.on('mouseout', () => {
        setHoveredSheet(null);
        applyLayerFilterStyle(sheet, rect);
      });

      rect.on('click', () => {
        onSelectSheet(sheet_no);
        mapRef.current.fitBounds(rectBounds, getFitBoundsOptions());
      });

      layersMapRef.current.set(sheet_no, rect);
    });

    updateStyles();
  }, [mapLoaded, sheets, activeColor, getFitBoundsOptions, applyLayerFilterStyle, updateStyles, onSelectSheet]);

  useEffect(() => {
    updateStyles();
  }, [updateStyles]);

  // 4. Center map when selectedItem changes
  useEffect(() => {
    if (!mapRef.current || !selectedItem || selectedItem.category !== 'map') {
      return;
    }

    const sheet = selectedItem.rawItem || selectedItem;
    if (sheet && sheet.bounds) {
      const rectBounds = [
        [sheet.bounds.min_lat, sheet.bounds.min_lon],
        [sheet.bounds.max_lat, sheet.bounds.max_lon]
      ];
      
      mapRef.current.fitBounds(rectBounds, getFitBoundsOptions());
    }
  }, [selectedItem, getFitBoundsOptions]);

  // Reset View shortcut
  const handleResetView = () => {
    if (mapRef.current) {
      const isDesktop = window.innerWidth > 1100;
      const initialCenter: [number, number] = isDesktop ? [12.5, 117.2] : [12.0, 122.0];
      const initialZoom = isDesktop ? 6 : 5;
      mapRef.current.setView(initialCenter, initialZoom);
    }
  };

  // Find user's location, place marker, and select enclosing sheet
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      window.dispatchEvent(new CustomEvent('trigger-toast', {
        detail: { message: "Geolocation is not supported by your browser." }
      }));
      return;
    }

    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: "Acquiring satellite lock..." }
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const L = (window as any).L;
        if (!L || !mapRef.current) return;

        // Custom pulsing dot icon
        const locateIcon = L.divIcon({
          className: 'custom-gps-marker',
          html: '<div class="gps-pulse-ring"></div><div class="gps-pulse-dot"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        // Update GPS Marker position
        if (gpsMarkerRef.current) {
          gpsMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          gpsMarkerRef.current = L.marker([latitude, longitude], { icon: locateIcon }).addTo(mapRef.current);
        }

        // Find matching sheet bounds
        const matchingSheet = sheets.find((sheet) => {
          const { bounds } = sheet;
          return bounds &&
            latitude >= bounds.min_lat &&
            latitude <= bounds.max_lat &&
            longitude >= bounds.min_lon &&
            longitude <= bounds.max_lon;
        });

        if (matchingSheet) {
          window.dispatchEvent(new CustomEvent('trigger-toast', {
            detail: { message: `Located! Inside Sheet ${matchingSheet.sheet_no} (${matchingSheet.sheet_name})` }
          }));
          onSelectSheet(matchingSheet.sheet_no);
        } else {
          window.dispatchEvent(new CustomEvent('trigger-toast', {
            detail: { message: `Located at ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (outside Series 733 index bounds)` }
          }));
          mapRef.current.setView([latitude, longitude], 10);
        }
      },
      (error) => {
        let msg = "Failed to retrieve location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location request denied by user.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location details unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out.";
        }
        window.dispatchEvent(new CustomEvent('trigger-toast', {
          detail: { message: msg }
        }));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="ph-map-panel-container" onClick={(e) => e.stopPropagation()}>
      {/* Leaflet Map Box */}
      <div className="map-wrapper">
        <div ref={mapContainerRef} className="leaflet-map-element" />

        {/* Floating Reset View Control */}
        <button className="map-floating-reset-btn" onClick={handleResetView} title="Reset Map View">
          <Compass size={16} />
        </button>

        {/* Floating Geolocation Control */}
        <button className="map-floating-gps-btn" onClick={handleLocateMe} title="Find My Location">
          <Navigation size={15} />
        </button>

        {/* Floating Detail Overlay cards inside map */}
        {hoveredSheet && (
          <div className="map-hover-card font-mono">
            <MapPin size={12} style={{ color: activeColor }} />
            <span className="hover-sheet-no">{hoveredSheet.sheet_no}</span>
            <span className="hover-sheet-name">{hoveredSheet.sheet_name}</span>
          </div>
        )}

        {/* Selected Sheet Card */}
        {selectedSheetData && (
          <div className="map-selection-card">
            <div className="selection-card-header">
              <span className="selection-card-title">Selected Sheet</span>
              <span className={`status-badge ${selectedSheetData.library_owns === 'Yes' ? 'owned' : 'unowned'}`}>
                {selectedSheetData.library_owns === 'Yes' ? 'LIBRARY HAS COPY' : 'NOT OWNED'}
              </span>
            </div>
            <div className="selection-card-name">
              Sheet {selectedSheetData.sheet_no} — {selectedSheetData.sheet_name}
            </div>
            <div className="selection-card-details font-mono">
              <div>Location: {selectedSheetData.library_location || 'NONE'}</div>
              {selectedSheetData.call_number && <div>Call #: {selectedSheetData.call_number}</div>}
            </div>
            {selectedSheetData.scan && selectedSheetData.scan !== 'NONE' && (
              <a 
                href={selectedSheetData.scan} 
                target="_blank" 
                rel="noreferrer" 
                className="selection-card-action-btn"
                style={{ '--accent-color': activeColor } as React.CSSProperties}
              >
                <ExternalLink size={12} />
                <span>Open NAMRIA Scan Page</span>
              </a>
            )}
          </div>
        )}

        {/* 1. Coordinates Readout & Compass Dial (HUD Bottom-Left) */}
        <div className="map-bottom-left-hud">
          <div className="map-compass-dial" style={{ transform: `rotate(${compassRotation}deg)` }}>
            <svg viewBox="0 0 100 100" className="compass-svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--text-dimmed)" strokeWidth="1.5" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="var(--text-dimmed)" strokeWidth="0.75" strokeDasharray="3 3" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="var(--text-dimmed)" strokeWidth="0.75" strokeDasharray="3 3" />
              {/* Arrow pointer */}
              <polygon points="50,15 45,50 50,45 55,50" fill={activeColor} />
              <polygon points="50,85 45,50 50,55 55,50" fill="var(--text-muted)" />
              {/* Cardinal directions */}
              <text x="50" y="12" textAnchor="middle" fontSize="10" fill={activeColor} fontWeight="bold">N</text>
              <text x="50" y="93" textAnchor="middle" fontSize="10" fill="var(--text-muted)">S</text>
              <text x="92" y="53" textAnchor="middle" fontSize="10" fill="var(--text-muted)">E</text>
              <text x="8" y="53" textAnchor="middle" fontSize="10" fill="var(--text-muted)">W</text>
            </svg>
          </div>
          <div className="map-coordinates-hud font-mono">
            {mouseCoords ? (
              <>
                <span>{Math.abs(mouseCoords.lat).toFixed(4)}° {mouseCoords.lat >= 0 ? 'N' : 'S'}</span>
                <span className="hud-coords-divider">|</span>
                <span>{Math.abs(mouseCoords.lng).toFixed(4)}° {mouseCoords.lng >= 0 ? 'E' : 'W'}</span>
              </>
            ) : (
              <span>12.5000° N | 117.2000° E</span>
            )}
          </div>
        </div>

        {/* 2. Interactive Legend, Filter, Base Layer & Coverage Stats Panel (HUD Top-Right) */}
        <div className="map-hud-legend">
          <div className="hud-legend-title">Philippines Map Index</div>
          <div className="hud-legend-subtitle">Series 733 · 1:50,000 Grid</div>
          
          <div className="hud-legend-items">
            <button 
              className={`hud-legend-item ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <span className="legend-indicator-dot" style={{ backgroundColor: activeColor }}></span>
              <span className="legend-label">All Sheets</span>
              <span className="legend-count font-mono">{stats.total}</span>
            </button>
            
            <button 
              className={`hud-legend-item ${statusFilter === 'owned' ? 'active' : ''}`}
              onClick={() => setStatusFilter('owned')}
            >
              <span className="legend-indicator-dot" style={{ backgroundColor: '#10b981' }}></span>
              <span className="legend-label">Owned in Library</span>
              <span className="legend-count font-mono">{stats.owned}</span>
            </button>
            
            <button 
              className={`hud-legend-item ${statusFilter === 'scan' ? 'active' : ''}`}
              onClick={() => setStatusFilter('scan')}
            >
              <span className="legend-indicator-dot" style={{ backgroundColor: '#eab308' }}></span>
              <span className="legend-label">Digital Scans</span>
              <span className="legend-count font-mono">{stats.scanOnly}</span>
            </button>
          </div>

          <div className="hud-legend-divider"></div>

          {/* Base Layer Switcher */}
          <div className="hud-legend-title" style={{ fontSize: '9px', marginBottom: '4px' }}>Base Map Layer</div>
          <div className="base-layer-toggles">
            <button 
              className={`base-layer-btn ${baseLayer === 'dark' ? 'active' : ''}`}
              onClick={() => setBaseLayer('dark')}
            >
              Dark
            </button>
            <button 
              className={`base-layer-btn ${baseLayer === 'satellite' ? 'active' : ''}`}
              onClick={() => setBaseLayer('satellite')}
            >
              Satellite
            </button>
            <button 
              className={`base-layer-btn ${baseLayer === 'topo' ? 'active' : ''}`}
              onClick={() => setBaseLayer('topo')}
            >
              Topo
            </button>
          </div>

          <div className="hud-legend-divider"></div>
          
          <div className="hud-stats-section">
            <div className="hud-stat-row">
              <span className="hud-stat-label">Library Holdings</span>
              <span className="hud-stat-value font-mono">{stats.ownedPercent}%</span>
            </div>
            <div className="hud-stat-progress-bar">
              <div className="hud-stat-progress-fill" style={{ width: `${stats.ownedPercent}%`, backgroundColor: '#10b981' }}></div>
            </div>
            
            <div className="hud-stat-row" style={{ marginTop: '10px' }}>
              <span className="hud-stat-label">Scanned Coverage</span>
              <span className="hud-stat-value font-mono">{stats.scanPercent}%</span>
            </div>
            <div className="hud-stat-progress-bar">
              <div className="hud-stat-progress-fill" style={{ width: `${stats.scanPercent}%`, backgroundColor: '#eab308' }}></div>
            </div>
          </div>
        </div>

        {!mapLoaded && (
          <div className="map-loading-overlay">
            <Compass size={32} className="spin-animate" />
            <span style={{ marginTop: 8 }} className="font-mono">Loading Philippine Map Engine...</span>
          </div>
        )}
      </div>
    </div>
  );
};
