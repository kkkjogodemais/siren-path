import { useEffect, useRef, useState } from 'react';
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
  const hospitalMarkersRef = useRef<L.Marker[]>([]);
  const trafficLightMarkersRef = useRef<L.Marker[]>([]);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const hasSetInitialBoundsRef = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Inicializar mapa uma única vez
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true
    }).setView([-23.5015, -47.4526], 14);

    mapRef.current = map;

    // Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    setIsMapReady(true);
    onMapReady?.();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Atualizar hospitais - apenas quando lista de hospitais muda
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Limpar marcadores anteriores
    hospitalMarkersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    hospitalMarkersRef.current = [];

    if (!showAllHospitals) return;

    hospitals.forEach(hospital => {
      const hospitalIcon = L.divIcon({
        html: `<div style="
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

      marker.addTo(mapRef.current!);
      hospitalMarkersRef.current.push(marker);
    });
  }, [hospitals, isMapReady, showAllHospitals]);

  // Atualizar semáforos - apenas quando lista muda
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Limpar marcadores anteriores
    trafficLightMarkersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    trafficLightMarkersRef.current = [];

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

      marker.addTo(mapRef.current!);
      trafficLightMarkersRef.current.push(marker);
    });
  }, [trafficLights, isMapReady, showTrafficLights]);

  // Atualizar rota - sem reajustar zoom a cada update
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Remover rota anterior
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (route.length === 0) return;

    // Criar nova rota
    routeLayerRef.current = L.polyline(route, {
      color: '#ef4444',
      weight: 5,
      opacity: 0.8,
      smoothFactor: 1,
      dashArray: '10, 5'
    }).addTo(mapRef.current);

    // Ajustar zoom apenas na primeira vez
    if (!hasSetInitialBoundsRef.current && route.length > 1) {
      mapRef.current.fitBounds(routeLayerRef.current.getBounds(), {
        padding: [50, 50],
        maxZoom: 15
      });
      hasSetInitialBoundsRef.current = true;
    }
  }, [route, isMapReady]);

  // Atualizar posição da ambulância de forma suave
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    if (!ambulancePosition) {
      // Remover ambulância se não há posição
      if (ambulanceMarkerRef.current) {
        mapRef.current.removeLayer(ambulanceMarkerRef.current);
        ambulanceMarkerRef.current = null;
      }
      return;
    }

    if (ambulanceMarkerRef.current) {
      // Apenas atualizar posição sem recriar marker
      ambulanceMarkerRef.current.setLatLng(ambulancePosition);
    } else {
      // Criar novo marker
      const ambulanceIcon = L.divIcon({
        html: `<div style="
          font-size: 32px;
          text-align: center;
          line-height: 1;
          filter: drop-shadow(0 2px 6px rgba(239, 68, 68, 0.5));
        ">🚑</div>`,
        className: 'custom-ambulance-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

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
    if (!mapRef.current || !isMapReady) return;

    // Remover destino anterior
    if (destinationMarkerRef.current) {
      mapRef.current.removeLayer(destinationMarkerRef.current);
      destinationMarkerRef.current = null;
    }

    if (!destinationHospital) return;

    const destIcon = L.divIcon({
      html: `<div style="
        font-size: 36px;
        text-align: center;
        line-height: 1;
        filter: drop-shadow(0 2px 8px rgba(34, 197, 94, 0.6));
      ">🏥</div>`,
      className: 'destination-hospital-icon',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    destinationMarkerRef.current = L.marker(destinationHospital.coordinates, {
      icon: destIcon,
      zIndexOffset: 999
    }).addTo(mapRef.current);

    destinationMarkerRef.current.bindPopup(`
      <div style="min-width: 200px;">
        <strong style="color: #22c55e;">🎯 DESTINO</strong>
        <div style="margin-top: 8px;">
          <strong>${destinationHospital.name}</strong>
          <p style="font-size: 12px; margin-top: 4px;">${destinationHospital.address}</p>
        </div>
      </div>
    `);
  }, [destinationHospital, isMapReady]);

  // Reset do flag quando a rota é resetada
  useEffect(() => {
    if (route.length === 0) {
      hasSetInitialBoundsRef.current = false;
    }
  }, [route.length]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '500px', zIndex: 1 }}
    />
  );
};

export default RealtimeMap;
