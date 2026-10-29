'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { Coordinates } from '../types/incident';

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  priorityScore?: number;
  status?: string;
  category?: string;
}

interface LeafletMapProps {
  center?: Coordinates;
  zoom?: number;
  pins?: MapPin[];
  interactivePinPlacement?: boolean;
  onLocationSelect?: (coords: Coordinates) => void;
  heightClass?: string;
}

export default function LeafletMap({
  center = { lat: 28.6139, lng: 77.209 }, // New Delhi Central
  zoom = 13,
  pins = [],
  interactivePinPlacement = false,
  onLocationSelect,
  heightClass = 'h-[360px]'
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const selectedMarkerRef = useRef<any>(null);
  const prevCenterRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;

    // Dynamically load Leaflet on the client side to avoid SSR window errors
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icon assets from unpkg CDN
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          scrollWheelZoom: true,
        });

        // 100% Free OpenStreetMap tile server (No API keys or watermarks)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        prevCenterRef.current = { lat: center.lat, lng: center.lng };

        // If interactive placement is enabled, add a default placement marker
        if (interactivePinPlacement) {
          const defaultIcon = L.divIcon({
            className: 'custom-selected-pin',
            html: `
              <div style="background-color: #896648; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); cursor: grab;">
                📍
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          selectedMarkerRef.current = L.marker([center.lat, center.lng], {
            icon: defaultIcon,
            draggable: true,
            zIndexOffset: 1000
          }).addTo(map);

          selectedMarkerRef.current.on('dragend', (e: any) => {
            const { lat, lng } = e.target.getLatLng();
            const roundedLat = Number(lat.toFixed(5));
            const roundedLng = Number(lng.toFixed(5));
            prevCenterRef.current = { lat: roundedLat, lng: roundedLng };
            if (onLocationSelect) {
              onLocationSelect({ lat: roundedLat, lng: roundedLng });
            }
          });

          map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            const roundedLat = Number(lat.toFixed(5));
            const roundedLng = Number(lng.toFixed(5));
            prevCenterRef.current = { lat: roundedLat, lng: roundedLng };
            if (onLocationSelect) {
              onLocationSelect({ lat: roundedLat, lng: roundedLng });
            }

            if (selectedMarkerRef.current) {
              selectedMarkerRef.current.setLatLng([lat, lng]);
            }
          });
        }
      }

      // Update map center and placement marker ONLY when center actually changes significantly
      if (mapInstanceRef.current) {
        const prev = prevCenterRef.current;
        const hasCenterChanged =
          !prev ||
          Math.abs(prev.lat - center.lat) > 0.0001 ||
          Math.abs(prev.lng - center.lng) > 0.0001;

        if (hasCenterChanged) {
          prevCenterRef.current = { lat: center.lat, lng: center.lng };
          // Preserve the user's manual zoom level if they zoomed in
          const currentMapZoom = mapInstanceRef.current.getZoom();
          const targetZoom = currentMapZoom && currentMapZoom > zoom ? currentMapZoom : zoom;
          mapInstanceRef.current.setView([center.lat, center.lng], targetZoom, { animate: true });
        }

        if (selectedMarkerRef.current) {
          selectedMarkerRef.current.setLatLng([center.lat, center.lng]);
        }
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 150);
      }

      // Render pins
      if (markersLayerRef.current && mapInstanceRef.current) {
        markersLayerRef.current.clearLayers();

        pins.forEach((pin) => {
          const isHighPriority = (pin.priorityScore ?? 0) >= 80;
          const pinColor = isHighPriority ? '#C2410C' : '#896648';

          const icon = L.divIcon({
            className: 'civic-marker-pin',
            html: `
              <div style="background-color: ${pinColor}; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                <span>${isHighPriority ? '⚠️' : '📍'}</span>
                <span>${pin.priorityScore ? pin.priorityScore : ''}</span>
              </div>
            `,
            iconSize: [46, 26],
            iconAnchor: [23, 13],
          });

          const marker = L.marker([pin.lat, pin.lng], { icon });
          marker.bindPopup(`
            <div style="font-family: system-ui; padding: 3px 5px; max-width: 220px;">
              <strong style="color: #211B17; font-size: 12px; display: block; margin-bottom: 2px;">${pin.title}</strong>
              <div style="color: #554940; font-size: 11px;">Priority: <span style="font-weight: bold; color: ${pinColor};">${pin.priorityScore ?? 'N/A'}/100</span></div>
              <div style="color: #6F4F36; font-size: 10px; margin-top: 4px; font-weight: 600;">Status: ${pin.status ?? 'ACTIVE'}</div>
            </div>
          `);
          markersLayerRef.current.addLayer(marker);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [center, zoom, pins, interactivePinPlacement, onLocationSelect]);

  return (
    <div className={`w-full ${heightClass} rounded-2xl border border-[#C7AF99] overflow-hidden relative shadow-xs bg-[#E8D9CB]`}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      {interactivePinPlacement && (
        <div className="absolute bottom-2 left-2 z-20 bg-[#F5EDE4]/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[#211B17] border border-[#C7AF99] shadow-xs pointer-events-none">
          Click map or drag the pin to set incident location
        </div>
      )}
    </div>
  );
}
