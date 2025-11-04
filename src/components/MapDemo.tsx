import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Clock, Activity, MapPin } from 'lucide-react';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Sorocaba center coordinates
const SOROCABA_CENTER: [number, number] = [-23.5015, -47.4526];

// Simulate a route in Sorocaba (from a neighborhood to a hospital)
const createRouteInSorocaba = (): [number, number][] => {
  return [
    [-23.5180, -47.4680], // Ambulância - Região do Jardim Vera Cruz
    [-23.5140, -47.4620],
    [-23.5100, -47.4580],
    [-23.5060, -47.4540],
    [-23.5020, -47.4500],
    [-23.4980, -47.4460],
    [-23.4950, -47.4420], // Hospital - Região Central
  ];
};

// Component to fit bounds when route changes
const MapBounds = ({ route }: { route: [number, number][] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  
  return null;
};

const MapDemo = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    time: number;
    congestionLevel: 'low' | 'medium' | 'high';
  } | null>(null);

  useEffect(() => {
    // Simulate initial route calculation
    simulateRoute();
  }, []);

  const simulateRoute = () => {
    setIsCalculating(true);
    setRoute([]);
    setRouteInfo(null);
    
    // Simulate route calculation delay
    setTimeout(() => {
      const newRoute = createRouteInSorocaba();
      setRoute(newRoute);
      
      // Calculate approximate distance (simplified)
      const distance = calculateDistance(newRoute);
      const congestionLevel: 'low' | 'medium' | 'high' = Math.random() > 0.7 ? 'medium' : 'low';
      const baseTime = (distance / 40) * 60; // 40 km/h average
      const adjustedTime = congestionLevel === 'medium' ? baseTime * 1.3 : baseTime;
      
      setRouteInfo({
        distance: Number(distance.toFixed(1)),
        time: Math.round(adjustedTime),
        congestionLevel
      });
      setIsCalculating(false);
    }, 1500);
  };

  const calculateDistance = (coords: [number, number][]): number => {
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const [lat1, lon1] = coords[i];
      const [lat2, lon2] = coords[i + 1];
      
      // Haversine formula (simplified)
      const R = 6371; // Earth radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }
    return total;
  };

  const getCongestionColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-accent';
      case 'medium': return 'bg-warning';
      case 'high': return 'bg-destructive';
    }
  };

  const getCongestionText = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
    }
  };

  return (
    <section id="platform-demo" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4">Demonstração Interativa - Sorocaba/SP</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Plataforma de Roteamento em Tempo Real
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visualize como nosso algoritmo calcula a rota mais rápida considerando previsões de tráfego
            </p>
          </div>

          {/* Map and controls */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Map */}
            <div className="md:col-span-2">
              <Card className="overflow-hidden h-[500px] relative">
                <MapContainer
                  center={SOROCABA_CENTER}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {route.length > 0 && <MapBounds route={route} />}
                  
                  {route.length > 0 && (
                    <Polyline
                      positions={route}
                      color="#10b981"
                      weight={6}
                      opacity={0.8}
                    />
                  )}
                  
                  {route.length > 0 && (
                    <Marker position={route[0]} icon={ambulanceIcon}>
                      <Popup>
                        <strong>🚑 Ambulância</strong>
                        <br />
                        Jardim Vera Cruz
                      </Popup>
                    </Marker>
                  )}
                  
                  {route.length > 0 && (
                    <Marker position={route[route.length - 1]} icon={hospitalIcon}>
                      <Popup>
                        <strong>🏥 Hospital</strong>
                        <br />
                        Região Central
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
                
                {/* Info badge */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Sorocaba, São Paulo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Mapa gratuito - OpenStreetMap</p>
                </div>
              </Card>
            </div>

            {/* Controls and info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Informações da Rota
                </h3>
                
                {routeInfo ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Distância</span>
                      <span className="font-semibold">{routeInfo.distance} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tempo Estimado</span>
                      <span className="font-semibold flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {routeInfo.time} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Congestionamento</span>
                      <Badge className={getCongestionColor(routeInfo.congestionLevel)}>
                        {getCongestionText(routeInfo.congestionLevel)}
                      </Badge>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Origem: Jardim Vera Cruz</p>
                        <p>• Destino: Hospital Central</p>
                        <p>• Algoritmo: Dijkstra + ML</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50 animate-pulse" />
                    <p>Calculando rota...</p>
                  </div>
                )}

                <Button 
                  className="w-full mt-6" 
                  onClick={simulateRoute}
                  disabled={isCalculating}
                >
                  {isCalculating ? 'Calculando...' : 'Recalcular Rota'}
                </Button>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h4 className="font-semibold mb-3 text-sm">Recursos da Plataforma</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>Previsão ML de congestionamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>Atualização em tempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>Integração com APIs públicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>Suporte a múltiplas ambulâncias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>100% gratuito - OpenStreetMap</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapDemo;
