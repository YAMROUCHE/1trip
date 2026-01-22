import { useEffect, useRef } from 'react';
import { DESTINATION_CENTERS } from '../../data/destinations';
import { TYPE_COLORS } from '../../styles/colors';

export default function MapView({ destination, pois, selectedPOI, onSelectPOI }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadLeaflet = () => {
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!window.L || !mapRef.current) return;

      const center = DESTINATION_CENTERS[destination];
      if (!center) return;

      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      const map = window.L.map(mapRef.current).setView([center.lat, center.lng], center.zoom);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      mapInstance.current = map;
      updateMarkers();
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [destination]);

  useEffect(() => {
    updateMarkers();
  }, [pois, selectedPOI]);

  const updateMarkers = () => {
    if (!mapInstance.current || !window.L) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    pois.forEach((poi) => {
      if (!poi.lat || !poi.lng) return;

      const colors = TYPE_COLORS[poi.type] || { border: '#6366f1' };
      const isSelected = selectedPOI?.id === poi.id;
      const size = isSelected ? 28 : 22;

      const icon = window.L.divIcon({
        className: '',
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background: ${colors.border};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ${isSelected ? 'transform: scale(1.2);' : ''}
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = window.L.marker([poi.lat, poi.lng], { icon })
        .addTo(mapInstance.current)
        .on('click', () => onSelectPOI(poi));

      markersRef.current.push(marker);
    });
  };

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#e2e8f0',
      }}
    />
  );
}
