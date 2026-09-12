'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMapType, LayerGroup } from 'leaflet';
import { LandParcel } from '@/lib/types';
import { formatNPR } from '@/lib/utils/area';
import { Layers } from 'lucide-react';

interface LeafletMapProps {
  parcels: LandParcel[];
  selectedParcelId?: string | null;
  onParcelSelect?: (parcel: LandParcel) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

type LayerKey = 'parcels' | 'floodZones' | 'roads' | 'rivers' | 'facilities';

export default function LeafletMap({
  parcels,
  selectedParcelId,
  onParcelSelect,
  center = [28.0, 84.5], // Nepal center
  zoom = 7,
  height = '100%',
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapType | null>(null);
  const layersRef = useRef<{
    parcels: LayerGroup | null;
    floodZones: LayerGroup | null;
    roads: LayerGroup | null;
    rivers: LayerGroup | null;
    facilities: LayerGroup | null;
  }>({
    parcels: null,
    floodZones: null,
    roads: null,
    rivers: null,
    facilities: null,
  });

  const [activeLayers, setActiveLayers] = useState<Record<LayerKey, boolean>>({
    parcels: true,
    floodZones: true,
    roads: true,
    rivers: true,
    facilities: false,
  });

  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      // Fix default marker icon URLs for webpack/Next.js
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Standard Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Fictional Land Data: BhuInfo Nepal',
        maxZoom: 19,
      }).addTo(map);

      // Initialize Layer Groups
      const parcelGroup = L.layerGroup().addTo(map);
      const floodGroup = L.layerGroup().addTo(map);
      const roadGroup = L.layerGroup().addTo(map);
      const riverGroup = L.layerGroup().addTo(map);
      const facilityGroup = L.layerGroup();

      layersRef.current = {
        parcels: parcelGroup,
        floodZones: floodGroup,
        roads: roadGroup,
        rivers: riverGroup,
        facilities: facilityGroup,
      };

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update layers & parcels whenever data or layer toggles change
  useEffect(() => {
    async function updateLayers() {
      if (!mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;
      const { parcels: pGroup, floodZones: fGroup, roads: rGroup, rivers: rivGroup, facilities: facGroup } = layersRef.current;

      if (!pGroup || !fGroup || !rGroup || !rivGroup || !facGroup) return;

      // Clear existing layers
      pGroup.clearLayers();
      fGroup.clearLayers();
      rGroup.clearLayers();
      rivGroup.clearLayers();
      facGroup.clearLayers();

      // Render Parcels
      parcels.forEach((p) => {
        const isSelected = p.id === selectedParcelId;

        // Color based on ownership & flood risk
        let fillColor = '#10B981'; // green for private / safe
        if (p.ownershipType === 'Guthi') fillColor = '#F59E0B'; // amber
        else if (p.ownershipType === 'Government') fillColor = '#3B82F6'; // blue
        else if (p.ownershipType === 'Institutional' || p.ownershipType === 'Organization') fillColor = '#8B5CF6'; // purple
        else if (p.ownershipType === 'Unknown') fillColor = '#EF4444'; // red

        // Draw parcel simulated polygon (GIS boundary box)
        const latOffset = 0.0025;
        const lngOffset = 0.003;
        const bounds: [[number, number], [number, number]] = [
          [p.latitude - latOffset, p.longitude - lngOffset],
          [p.latitude + latOffset, p.longitude + lngOffset],
        ];

        const polygon = L.rectangle(bounds, {
          color: isSelected ? '#047857' : fillColor,
          weight: isSelected ? 3 : 2,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.6 : 0.35,
        });

        const warningNotice = ['Guthi', 'Government', 'Institutional', 'Organization', 'Unknown'].includes(p.ownershipType)
          ? `<div style="margin-top:6px;padding:4px 8px;background:#FEF3C7;color:#92400E;border-radius:4px;font-size:11px;font-weight:600;">⚠️ Ownership requires legal verification</div>`
          : '';

        const priceText = p.listingPrice
          ? `<div style="font-weight:bold;color:#047857;margin-top:4px;">Listed: ${formatNPR(p.listingPrice)}</div>`
          : p.priceEstimate?.available
          ? `<div style="color:#2563EB;margin-top:4px;font-size:12px;">Est: ${formatNPR(p.priceEstimate.estimatedTotal)}</div>`
          : `<div style="color:#64748B;font-size:11px;margin-top:4px;">Price estimate unavailable</div>`;

        const popupContent = `
          <div style="font-family:sans-serif;min-width:200px;">
            <div style="font-size:11px;color:#64748b;font-family:monospace;">Kitta: <strong>${p.kittaNumber}</strong></div>
            <div style="font-size:14px;font-weight:bold;color:#0f172a;margin-top:2px;">${p.municipality}, ${p.district}</div>
            <div style="font-size:12px;color:#334155;margin-top:3px;">
              ${p.area} ${p.areaUnit} • <strong>${p.landUse}</strong> • <em>${p.ownershipType}</em>
            </div>
            ${warningNotice}
            <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
              <span style="font-size:11px;padding:2px 6px;border-radius:999px;background:#e2e8f0;font-weight:bold;">
                Risk: ${p.riskScore?.overall ?? 50}/100
              </span>
              <span style="font-size:11px;color:#64748b;">Flood: ${p.floodRisk}</span>
            </div>
            ${priceText}
            <div style="margin-top:8px;border-top:1px solid #e2e8f0;padding-top:6px;">
              <a href="/land/${p.id}" style="color:#059669;font-weight:600;font-size:12px;text-decoration:none;">View Full Land Details &rarr;</a>
            </div>
          </div>
        `;

        polygon.bindPopup(popupContent);

        polygon.on('click', () => {
          onParcelSelect?.(p);
        });

        pGroup.addLayer(polygon);

        // Marker center point with icon
        const marker = L.circleMarker([p.latitude, p.longitude], {
          radius: isSelected ? 8 : 5,
          color: '#ffffff',
          weight: 2,
          fillColor: fillColor,
          fillOpacity: 1,
        });
        marker.bindPopup(popupContent);
        marker.on('click', () => onParcelSelect?.(p));
        pGroup.addLayer(marker);

        // Simulated GIS Layer: Flood risk buffer if high
        if (['High', 'Very High', 'Moderate'].includes(p.floodRisk)) {
          const floodColor = p.floodRisk === 'Very High' ? '#DC2626' : p.floodRisk === 'High' ? '#EA580C' : '#FBBF24';
          const floodCircle = L.circle([p.latitude, p.longitude], {
            radius: p.floodRisk === 'Very High' ? 600 : p.floodRisk === 'High' ? 400 : 250,
            color: floodColor,
            weight: 1,
            fillColor: floodColor,
            fillOpacity: 0.12,
            dashArray: '4, 4',
          });
          floodCircle.bindTooltip(`Flood Hazard Zone (${p.floodRisk})`, { permanent: false });
          fGroup.addLayer(floodCircle);
        }

        // Simulated GIS Layer: Road Access Line
        if (p.roadType !== 'None') {
          const roadColor = p.roadType === 'Highway' ? '#E11D48' : p.roadType === 'Blacktopped' ? '#334155' : '#D97706';
          const roadLine = L.polyline(
            [
              [p.latitude - 0.004, p.longitude - 0.005],
              [p.latitude, p.longitude - 0.003],
              [p.latitude + 0.004, p.longitude + 0.005],
            ],
            {
              color: roadColor,
              weight: p.roadType === 'Highway' ? 4 : 2,
              opacity: 0.7,
            }
          );
          roadLine.bindTooltip(`Road: ${p.roadType} (${p.roadWidth} ft)`, { permanent: false });
          rGroup.addLayer(roadLine);
        }

        // Simulated GIS Layer: Nearby River
        if (p.riverDistance < 1000) {
          const riverLine = L.polyline(
            [
              [p.latitude + 0.006, p.longitude - 0.008],
              [p.latitude + 0.001, p.longitude - 0.006],
              [p.latitude - 0.007, p.longitude - 0.004],
            ],
            {
              color: '#0284C7',
              weight: 3,
              opacity: 0.8,
            }
          );
          riverLine.bindTooltip(`River Stream (Dist: ${p.riverDistance}m)`, { permanent: false });
          rivGroup.addLayer(riverLine);
        }

        // Simulated GIS Layer: Nearby Facilities Markers
        p.nearbyFacilities.forEach((fac) => {
          const facLat = p.latitude + (Math.random() - 0.5) * 0.01;
          const facLng = p.longitude + (Math.random() - 0.5) * 0.01;
          const facMarker = L.circleMarker([facLat, facLng], {
            radius: 4,
            color: '#1E293B',
            weight: 1,
            fillColor: '#6366F1',
            fillOpacity: 0.9,
          });
          facMarker.bindPopup(`<strong>${fac.name}</strong><br/>${fac.type} (${fac.distanceLabel})`);
          facGroup.addLayer(facMarker);
        });
      });

      // Manage group visibility
      if (activeLayers.parcels) {
        if (!map.hasLayer(pGroup)) map.addLayer(pGroup);
      } else {
        if (map.hasLayer(pGroup)) map.removeLayer(pGroup);
      }

      if (activeLayers.floodZones) {
        if (!map.hasLayer(fGroup)) map.addLayer(fGroup);
      } else {
        if (map.hasLayer(fGroup)) map.removeLayer(fGroup);
      }

      if (activeLayers.roads) {
        if (!map.hasLayer(rGroup)) map.addLayer(rGroup);
      } else {
        if (map.hasLayer(rGroup)) map.removeLayer(rGroup);
      }

      if (activeLayers.rivers) {
        if (!map.hasLayer(rivGroup)) map.addLayer(rivGroup);
      } else {
        if (map.hasLayer(rivGroup)) map.removeLayer(rivGroup);
      }

      if (activeLayers.facilities) {
        if (!map.hasLayer(facGroup)) map.addLayer(facGroup);
      } else {
        if (map.hasLayer(facGroup)) map.removeLayer(facGroup);
      }
    }

    updateLayers();
  }, [parcels, activeLayers, selectedParcelId, onParcelSelect]);

  // Zoom to selected parcel if changed
  useEffect(() => {
    if (!selectedParcelId || !mapInstanceRef.current) return;
    const target = parcels.find((p) => p.id === selectedParcelId);
    if (target) {
      mapInstanceRef.current.setView([target.latitude, target.longitude], 14, { animate: true });
    }
  }, [selectedParcelId, parcels]);

  const layerConfigs: Array<{ key: LayerKey; label: string; color: string }> = [
    { key: 'parcels', label: 'Land Parcels (GeoJSON)', color: '#10B981' },
    { key: 'floodZones', label: 'Flood Hazard Buffers', color: '#EA580C' },
    { key: 'roads', label: 'Road Networks', color: '#334155' },
    { key: 'rivers', label: 'Rivers & Waterbodies', color: '#0284C7' },
    { key: 'facilities', label: 'Nearby Facilities', color: '#6366F1' },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200" style={{ height }}>
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Layer Controls Floating Button & Dropdown */}
      <div className="absolute top-3 right-3 z-[1000]">
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Toggle GIS Layers"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          GIS Layers
        </button>

        {showLayerPanel && (
          <div className="mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-3 text-xs space-y-2">
            <div className="font-bold text-slate-800 border-b pb-1.5 flex items-center justify-between">
              <span>Map Layers</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
            </div>
            {layerConfigs.map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={activeLayers[key]}
                  onChange={(e) =>
                    setActiveLayers((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-400"
                />
                <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="truncate">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Legend Badge Bottom Left */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-sm text-[11px] text-slate-600 space-y-1 hidden sm:block">
        <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">Ownership Category</div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Private</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Guthi</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />Gov</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" />Inst</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Unknown</span>
        </div>
      </div>
    </div>
  );
}
