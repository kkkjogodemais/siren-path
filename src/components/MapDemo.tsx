import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Clock, Activity, MapPin, Map } from 'lucide-react';

const MapDemo = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    time: number;
    congestionLevel: 'low' | 'medium' | 'high';
  } | null>(null);

  useEffect(() => {
    simulateRoute();
  }, []);

  const simulateRoute = () => {
    setIsCalculating(true);
    setRouteInfo(null);
    
    setTimeout(() => {
      const congestionLevel: 'low' | 'medium' | 'high' = Math.random() > 0.7 ? 'medium' : 'low';
      
      setRouteInfo({
        distance: 4.2,
        time: 8,
        congestionLevel
      });
      setIsCalculating(false);
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
          <div className="text-center mb-12">
            <Badge className="mb-4">Demonstração Interativa - Sorocaba/SP</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Plataforma de Roteamento em Tempo Real
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visualize como nosso algoritmo calcula a rota mais rápida considerando previsões de tráfego
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="overflow-hidden h-[500px] relative bg-gradient-to-br from-muted/50 to-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Map className="h-24 w-24 mx-auto text-muted-foreground/50" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Mapa Interativo</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        A visualização do mapa de Sorocaba com rota da ambulância será integrada em breve.<br/>
                        OpenStreetMap gratuito será usado.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 z-10 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Sorocaba, São Paulo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Mapa gratuito - OpenStreetMap</p>
                </div>
              </Card>
            </div>

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
