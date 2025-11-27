import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital, SmartTrafficLight } from '@/data/sorocabaData';

interface RealtimeMapProps {
  route: [number, number][];
  hospitals: Hospital[];
  trafficLights: SmartTrafficLight[];
  ambulancePosition: [number, number] | null;
  destinationHospital: Hospital | null;
  showAllHospitals?: boolean;
  showTrafficLights?: boolean;
  onMapReady?: () => void;
}

const RealtimeMap = ({
  route,
  hospitals,
  trafficLights,
  ambulancePosition,
  destinationHospital,
  showAllHospitals = true,
  showTrafficLights = true,
  onMapReady
}: RealtimeMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([-23.4958, -47.4524], 14);

    mapRef.current = map;

    // Tile layer com estilo mais detalhado
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Criar layer group para marcadores
    markersLayerRef.current = L.layerGroup().addTo(map);

    setIsMapReady(true);
    onMapReady?.();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapReady]);

  // Atualizar hospitais no mapa
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !isMapReady) return;
    if (!showAllHospitals) return;

    hospitals.forEach(hospital => {
      const hospitalIcon = L.divIcon({
        html: `<div class="hospital-marker ${hospital.type}" style="
          font-size: 24px;
          text-align: center;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          cursor: pointer;
        ">${hospital.type === 'upa' ? '🏥' : '🏨'}</div>`,
        className: 'custom-hospital-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker(hospital.coordinates, { icon: hospitalIcon });
      
      const capacityColor = {
        high: '#22c55e',
        medium: '#eab308',
        low: '#ef4444'
      }[hospital.emergencyCapacity];

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <strong style="font-size: 14px;">${hospital.name}</strong>
          <div style="margin-top: 8px; font-size: 12px;">
            <p><strong>Tipo:</strong> ${hospital.type === 'upa' ? 'UPA' : hospital.type === 'public' ? 'Público' : 'Privado'}</p>
            <p><strong>Endereço:</strong> ${hospital.address}</p>
            <p><strong>Telefone:</strong> ${hospital.phone}</p>
            <p><strong>Leitos:</strong> ${hospital.beds}</p>
            <p>
              <strong>Capacidade:</strong> 
              <span style="color: ${capacityColor}; font-weight: bold;">
                ${hospital.emergencyCapacity === 'high' ? 'Alta' : hospital.emergencyCapacity === 'medium' ? 'Média' : 'Baixa'}
              </span>
            </p>
          </div>
        </div>
      `);

      marker.addTo(markersLayerRef.current!);
    });
  }, [hospitals, isMapReady, showAllHospitals]);

  // Atualizar semáforos inteligentes no mapa
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !isMapReady) return;
    if (!showTrafficLights) return;

    trafficLights.forEach(light => {
      const lightIcon = L.divIcon({
        html: `<div style="
          width: 12px;
          height: 12px;
          background: ${light.connectedToSystem ? '#22c55e' : '#6b7280'};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 8px ${light.connectedToSystem ? '#22c55e' : '#6b7280'};
          animation: ${light.connectedToSystem ? 'pulse 2s infinite' : 'none'};
        "></div>`,
        className: 'traffic-light-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker(light.coordinates, { icon: lightIcon });
      
      marker.bindPopup(`
        <div style="min-width: 180px;">
          <strong style="font-size: 13px;">🚦 Semáforo Inteligente</strong>
          <div style="margin-top: 8px; font-size: 12px;">
            <p><strong>Cruzamento:</strong> ${light.intersection}</p>
            <p><strong>Status:</strong> ${light.connectedToSystem ? '✅ Conectado' : '❌ Offline'}</p>
            <p><strong>Tempo médio:</strong> ${light.averageWaitTime}s</p>
          </div>
        </div>
      `);

      marker.addTo(markersLayerRef.current!);
    });
  }, [trafficLights, isMapReady, showTrafficLights]);

  // Atualizar rota no mapa
  useEffect(() => {
    if (!mapRef.current || !isMapReady || route.length === 0) return;

    // Remover rota anterior
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
    }

    // Criar nova rota com animação
    routeLayerRef.current = L.polyline(route, {
      color: '#ef4444',
      weight: 5,
      opacity: 0.8,
      smoothFactor: 1,
      dashArray: '10, 5',
      className: 'animated-route'
    }).addTo(mapRef.current);

    // Ajustar zoom para mostrar rota completa
    mapRef.current.fitBounds(routeLayerRef.current.getBounds(), {
      padding: [50, 50]
    });
  }, [route, isMapReady]);

  // Atualizar posição da ambulância
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !ambulancePosition) return;

    const ambulanceIcon = L.divIcon({
      html: `<div style="
        font-size: 32px;
        text-align: center;
        line-height: 1;
        filter: drop-shadow(0 2px 6px rgba(239, 68, 68, 0.5));
        animation: ambulance-pulse 1s infinite;
      ">🚑</div>`,
      className: 'custom-ambulance-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    if (ambulanceMarkerRef.current) {
      // Animar movimento suave
      ambulanceMarkerRef.current.setLatLng(ambulancePosition);
    } else {
      ambulanceMarkerRef.current = L.marker(ambulancePosition, { 
        icon: ambulanceIcon,
        zIndexOffset: 1000
      }).addTo(mapRef.current);

      ambulanceMarkerRef.current.bindPopup(`
        <div style="min-width: 150px;">
          <strong>🚑 Ambulância SAMU</strong>
          <div style="margin-top: 8px; font-size: 12px;">
            <p><strong>Status:</strong> Em trânsito</p>
            <p><strong>Prioridade:</strong> Alta</p>
          </div>
        </div>
      `);
    }
  }, [ambulancePosition, isMapReady]);

  // Destacar hospital de destino
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !destinationHospital) return;

    const destIcon = L.divIcon({
      html: `<div style="
        font-size: 36px;
        text-align: center;
        line-height: 1;
        filter: drop-shadow(0 2px 8px rgba(34, 197, 94, 0.6));
        animation: destination-pulse 1.5s infinite;
      ">🏥</div>`,
      className: 'destination-hospital-icon',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
    });

    const destMarker = L.marker(destinationHospital.coordinates, {
      icon: destIcon,
      zIndexOffset: 999
    }).addTo(mapRef.current);

    destMarker.bindPopup(`
      <div style="min-width: 200px;">
        <strong style="color: #22c55e;">🎯 DESTINO</strong>
        <div style="margin-top: 8px;">
          <strong>${destinationHospital.name}</strong>
          <p style="font-size: 12px; margin-top: 4px;">${destinationHospital.address}</p>
        </div>
      </div>
    `).openPopup();

    return () => {
      mapRef.current?.removeLayer(destMarker);
    };
  }, [destinationHospital, isMapReady]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '600px' }}
    />
  );
};

export default RealtimeMap;
