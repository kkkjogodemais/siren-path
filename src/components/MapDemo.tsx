import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Clock, Activity } from 'lucide-react';

// São Paulo coordinates
const SAO_PAULO_CENTER: [number, number] = [-46.6333, -23.5505];

const MapDemo = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    time: number;
    congestionLevel: 'low' | 'medium' | 'high';
  } | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // ADICIONE SEU TOKEN PÚBLICO DO MAPBOX AQUI
    // Obtenha gratuitamente em: https://account.mapbox.com/access-tokens/
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'SEU_TOKEN_AQUI';
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: SAO_PAULO_CENTER,
        zoom: 12,
        pitch: 45,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add route simulation on load
      map.current.on('load', () => {
        simulateRoute();
      });
    } catch (error) {
      console.error('Mapbox initialization error:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  const simulateRoute = () => {
    setIsCalculating(true);
    
    // Simulate route calculation
    setTimeout(() => {
      setRouteInfo({
        distance: 4.2,
        time: 8,
        congestionLevel: 'low'
      });
      setIsCalculating(false);

      if (map.current) {
        // Add sample route line
        const route: [number, number][] = [
          [-46.6500, -23.5505],
          [-46.6400, -23.5450],
          [-46.6333, -23.5400],
          [-46.6250, -23.5380],
        ];

        if (!map.current.getSource('route')) {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            }
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#10b981',
              'line-width': 6,
              'line-opacity': 0.8
            }
          });

          // Add start and end markers
          new mapboxgl.Marker({ color: '#dc2626' })
            .setLngLat(route[0])
            .setPopup(new mapboxgl.Popup().setHTML('<strong>Ambulância</strong>'))
            .addTo(map.current);

          new mapboxgl.Marker({ color: '#10b981' })
            .setLngLat(route[route.length - 1])
            .setPopup(new mapboxgl.Popup().setHTML('<strong>Hospital</strong>'))
            .addTo(map.current);
        }
      }
    }, 1500);
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
            <Badge className="mb-4">Demonstração Interativa</Badge>
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
                <div ref={mapContainer} className="absolute inset-0" />
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
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aguardando cálculo de rota</p>
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
