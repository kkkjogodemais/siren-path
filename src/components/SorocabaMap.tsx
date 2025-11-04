import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SorocabaMapProps {
  route: [number, number][];
}

const SorocabaMap = ({ route }: SorocabaMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inicializar mapa
    const map = L.map(mapContainerRef.current).setView([-23.5015, -47.4526], 13);
    mapRef.current = map;

    // Adicionar tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Criar ícone customizado de ambulância
    const ambulanceIcon = L.divIcon({
      html: '<div style="font-size: 32px; text-align: center; line-height: 1;">🚑</div>',
      className: 'custom-ambulance-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Criar ícone de hospital
    const hospitalIcon = L.divIcon({
      html: '<div style="font-size: 32px; text-align: center; line-height: 1;">🏥</div>',
      className: 'custom-hospital-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || route.length === 0) return;

    const map = mapRef.current;

    // Limpar camadas anteriores (exceto a camada de tiles)
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Criar ícones customizados
    const ambulanceIcon = L.divIcon({
      html: '<div style="font-size: 32px; text-align: center; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🚑</div>',
      className: 'custom-ambulance-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const hospitalIcon = L.divIcon({
      html: '<div style="font-size: 32px; text-align: center; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🏥</div>',
      className: 'custom-hospital-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Desenhar linha da rota
    const polyline = L.polyline(route, {
      color: '#10b981',
      weight: 6,
      opacity: 0.8,
      smoothFactor: 1,
    }).addTo(map);

    // Adicionar marcador de ambulância (início)
    L.marker(route[0], { icon: ambulanceIcon })
      .addTo(map)
      .bindPopup('<strong>🚑 Ambulância</strong><br/>Jardim Vera Cruz');

    // Adicionar marcador de hospital (fim)
    L.marker(route[route.length - 1], { icon: hospitalIcon })
      .addTo(map)
      .bindPopup('<strong>🏥 Hospital</strong><br/>Região Central');

    // Ajustar zoom para mostrar toda a rota
    map.fitBounds(polyline.getBounds(), {
      padding: [50, 50],
    });
  }, [route]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
};

export default SorocabaMap;
