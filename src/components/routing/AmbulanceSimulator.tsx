import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Navigation, 
  Clock, 
  MapPin, 
  Activity,
  Gauge,
  Radio,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import RealtimeMap from './RealtimeMap';
import TrafficPanel from './TrafficPanel';
import { useTrafficData } from '@/hooks/useTrafficData';
import { calculateRouteTimeWithTraffic } from '@/services/trafficSimulationService';
import {
  hospitals,
  smartTrafficLights,
  neighborhoods,
  Hospital,
  calculateHaversineDistance,
  generateRealisticRoute,
  getTrafficLightsOnRoute
} from '@/data/sorocabaData';

interface RouteMetrics {
  distance: number;
  distanceTraveled: number;
  estimatedTime: number;
  currentTime: number;
  trafficLightsCleared: number;
  totalTrafficLights: number;
  congestionLevel: 'low' | 'medium' | 'high';
  currentSpeed: number;
  averageSpeed: number;
  progress: number;
}

// Função para calcular velocidade realista baseada no contexto
const getRealisticAmbulanceSpeed = (
  segmentIndex: number, 
  totalSegments: number,
  congestionLevel: 'low' | 'medium' | 'high',
  isNearTrafficLight: boolean
): number => {
  // Velocidade base para ambulância em emergência: 50-80 km/h
  let baseSpeed = 55;
  
  // Ajuste por congestionamento
  const congestionFactor = {
    low: 1.2,      // Pode ir mais rápido em tráfego leve
    medium: 0.9,   // Reduz um pouco
    high: 0.7      // Reduz significativamente
  };
  baseSpeed *= congestionFactor[congestionLevel];
  
  // Início da rota - acelera gradualmente (0-15% do trajeto)
  if (segmentIndex < totalSegments * 0.15) {
    baseSpeed *= 0.6 + (segmentIndex / (totalSegments * 0.15)) * 0.4;
  }
  
  // Final da rota - desacelera para parar (últimos 10%)
  if (segmentIndex > totalSegments * 0.9) {
    const remaining = (totalSegments - segmentIndex) / (totalSegments * 0.1);
    baseSpeed *= 0.4 + remaining * 0.6;
  }
  
  // Perto de semáforo - desacelera e depois acelera
  if (isNearTrafficLight) {
    baseSpeed *= 0.7;
  }
  
  // Variação aleatória realista (+/- 10%)
  const variation = 0.9 + Math.random() * 0.2;
  baseSpeed *= variation;
  
  // Limites: mínimo 25 km/h, máximo 90 km/h
  return Math.max(25, Math.min(90, baseSpeed));
};

// Calcula o tempo em ms para percorrer um segmento
const calculateSegmentTime = (distanceKm: number, speedKmh: number): number => {
  // tempo (h) = distância (km) / velocidade (km/h)
  // tempo (ms) = tempo (h) * 3600 * 1000
  const timeHours = distanceKm / speedKmh;
  return timeHours * 3600 * 1000;
};

const AmbulanceSimulator = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [route, setRoute] = useState<[number, number][]>([]);
  const [ambulancePosition, setAmbulancePosition] = useState<[number, number] | null>(null);
  const [destinationHospital, setDestinationHospital] = useState<Hospital | null>(null);
  const [routeMetrics, setRouteMetrics] = useState<RouteMetrics | null>(null);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [trafficLightsOnRoute, setTrafficLightsOnRoute] = useState(smartTrafficLights);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Refs para simulação realista
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const simulatedTimeRef = useRef<number>(0); // Tempo simulado em segundos
  const totalDistanceTraveledRef = useRef<number>(0);

  // Hook de dados de tráfego em tempo real
  const { trafficData, isLoading: isTrafficLoading, lastUpdate, refreshData, simulateSpike } = useTrafficData({
    autoUpdate: true,
    updateInterval: 5000
  });

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  }, []);

  // Converte nível de congestionamento do traffic service para o formato local
  const getCongestionLevelFromTraffic = (): 'low' | 'medium' | 'high' => {
    if (trafficData.congestionLevel === 'critical') return 'high';
    return trafficData.congestionLevel as 'low' | 'medium' | 'high';
  };

  const startSimulation = useCallback(() => {
    if (!selectedOrigin || !selectedDestination) {
      addLog('⚠️ Selecione origem e destino');
      return;
    }

    const originNeighborhood = neighborhoods.find(n => n.name === selectedOrigin);
    const destHospital = hospitals.find(h => h.id === selectedDestination);

    if (!originNeighborhood || !destHospital) return;

    // Gerar rota
    const newRoute = generateRealisticRoute(
      originNeighborhood.coordinates,
      destHospital.coordinates,
      30
    );

    setRoute(newRoute);
    setDestinationHospital(destHospital);
    setAmbulancePosition(newRoute[0]);
    setCurrentRouteIndex(0);

    // Calcular métricas usando dados de tráfego em tempo real
    const distance = newRoute.reduce((total, point, i) => {
      if (i === 0) return 0;
      return total + calculateHaversineDistance(newRoute[i - 1], point);
    }, 0);

    const congestionLevel = getCongestionLevelFromTraffic();
    const routeTime = calculateRouteTimeWithTraffic(distance, trafficData, true);
    const lightsOnRoute = getTrafficLightsOnRoute(newRoute);

    setTrafficLightsOnRoute(lightsOnRoute);
    setRouteMetrics({
      distance: Number(distance.toFixed(2)),
      distanceTraveled: 0,
      estimatedTime: Math.round(routeTime.estimatedMinutes),
      currentTime: 0,
      trafficLightsCleared: 0,
      totalTrafficLights: lightsOnRoute.length,
      congestionLevel,
      currentSpeed: 0,
      averageSpeed: routeTime.effectiveSpeed,
      progress: 0
    });

    simulatedTimeRef.current = 0;
    totalDistanceTraveledRef.current = 0;
    setIsSimulating(true);
    setIsPaused(false);

    addLog(`🚨 CHAMADO RECEBIDO - ${selectedOrigin}`);
    addLog(`🏥 Destino: ${destHospital.name}`);
    addLog(`📍 Distância: ${distance.toFixed(2)} km`);
    addLog(`⏱️ Tempo estimado: ${Math.round(routeTime.estimatedMinutes)} min`);
    addLog(`🚗 Tráfego: ${trafficData.congestionLevel} (${trafficData.overallCongestion}%)`);
    
    if (trafficData.incidents.length > 0) {
      addLog(`⚠️ ${trafficData.incidents.length} incidente(s) na região`);
    }
  }, [selectedOrigin, selectedDestination, addLog, trafficData]);

  const pauseSimulation = () => {
    setIsPaused(!isPaused);
    addLog(isPaused ? '▶️ Simulação retomada' : '⏸️ Simulação pausada');
  };

  const resetSimulation = () => {
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }
    setIsSimulating(false);
    setIsPaused(false);
    setRoute([]);
    setAmbulancePosition(null);
    setDestinationHospital(null);
    setRouteMetrics(null);
    setCurrentRouteIndex(0);
    simulatedTimeRef.current = 0;
    totalDistanceTraveledRef.current = 0;
    setLogs([]);
    addLog('🔄 Simulação reiniciada');
  };

  // Função para agendar o próximo movimento com timing realista
  const scheduleNextMove = useCallback((fromIndex: number, currentRoute: [number, number][], congestion: 'low' | 'medium' | 'high') => {
    if (fromIndex >= currentRoute.length - 1) {
      setIsSimulating(false);
      addLog('✅ CHEGADA AO DESTINO');
      addLog(`🏥 Paciente entregue em ${destinationHospital?.name}`);
      return;
    }

    // Calcular distância do segmento atual
    const segmentDistance = calculateHaversineDistance(currentRoute[fromIndex], currentRoute[fromIndex + 1]);
    
    // Verificar se está perto de um semáforo
    const isNearTrafficLight = trafficLightsOnRoute.some(light => 
      calculateHaversineDistance(currentRoute[fromIndex], light.coordinates) < 0.15
    );
    
    // Calcular velocidade realista para este segmento
    const currentSpeed = getRealisticAmbulanceSpeed(
      fromIndex, 
      currentRoute.length, 
      congestion,
      isNearTrafficLight
    );
    
    // Calcular tempo para percorrer este segmento (em ms)
    // Aplicamos o fator de simulationSpeed para acelerar/desacelerar
    const segmentTimeMs = calculateSegmentTime(segmentDistance, currentSpeed) / simulationSpeed;
    
    // Atualizar tempo simulado (tempo real que levaria sem aceleração)
    const realSegmentTimeSeconds = (segmentDistance / currentSpeed) * 3600;
    
    simulationTimeoutRef.current = setTimeout(() => {
      if (isPaused) return;
      
      const nextIndex = fromIndex + 1;
      
      // Atualizar refs de tempo e distância
      simulatedTimeRef.current += realSegmentTimeSeconds;
      totalDistanceTraveledRef.current += segmentDistance;
      
      // Atualizar estado
      setCurrentRouteIndex(nextIndex);
      setAmbulancePosition(currentRoute[nextIndex]);
      
      // Calcular progresso
      const progress = (nextIndex / (currentRoute.length - 1)) * 100;
      
      // Verificar semáforos passados
      const clearedLights = trafficLightsOnRoute.filter(light => {
        for (let i = 0; i <= nextIndex; i++) {
          if (calculateHaversineDistance(currentRoute[i], light.coordinates) < 0.1) {
            return true;
          }
        }
        return false;
      }).length;
      
      // Calcular velocidade média real
      const avgSpeed = simulatedTimeRef.current > 0 
        ? (totalDistanceTraveledRef.current / (simulatedTimeRef.current / 3600))
        : 0;
      
      // Atualizar métricas
      setRouteMetrics(prev => prev ? {
        ...prev,
        distanceTraveled: Number(totalDistanceTraveledRef.current.toFixed(2)),
        currentTime: Math.round(simulatedTimeRef.current / 60 * 10) / 10,
        progress: Math.round(progress),
        trafficLightsCleared: clearedLights,
        currentSpeed: Math.round(currentSpeed),
        averageSpeed: Math.round(avgSpeed)
      } : null);
      
      // Logs de progresso
      if (nextIndex % 5 === 0 && nextIndex > 0) {
        addLog(`📍 Progresso: ${Math.round(progress)}% | Vel: ${Math.round(currentSpeed)} km/h`);
      }
      
      // Agendar próximo movimento
      scheduleNextMove(nextIndex, currentRoute, congestion);
    }, Math.max(50, segmentTimeMs)); // Mínimo de 50ms para garantir renderização
  }, [isPaused, simulationSpeed, trafficLightsOnRoute, destinationHospital, addLog]);

  // Iniciar loop de simulação quando isSimulating muda
  useEffect(() => {
    if (!isSimulating || isPaused || route.length === 0) {
      return;
    }

    const congestion = routeMetrics?.congestionLevel || 'medium';
    scheduleNextMove(currentRouteIndex, route, congestion);

    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
    };
  }, [isSimulating, isPaused]);

  const getCongestionBadgeClass = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Layout Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
        {/* Mapa Principal */}
        <div className="xl:col-span-2 lg:col-span-2">
          <Card className="overflow-hidden h-[650px] relative">
            <RealtimeMap
              route={route}
              hospitals={hospitals}
              trafficLights={trafficLightsOnRoute}
              ambulancePosition={ambulancePosition}
              destinationHospital={destinationHospital}
            />
            
            {/* Overlay de Status */}
            {isSimulating && routeMetrics && (
              <div className="absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-semibold">Ambulância em trânsito</span>
                </div>
                <Progress value={routeMetrics.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {routeMetrics.progress}% concluído
                </p>
              </div>
            )}

            {/* Indicador de Tráfego no Mapa */}
            <div className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ 
                    backgroundColor: trafficData.congestionLevel === 'low' ? '#22c55e' :
                                     trafficData.congestionLevel === 'medium' ? '#eab308' :
                                     trafficData.congestionLevel === 'high' ? '#f97316' : '#ef4444'
                  }}
                />
                <span className="text-xs font-medium">
                  Tráfego: {trafficData.overallCongestion}%
                </span>
              </div>
            </div>

            {/* Legenda */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
              <p className="text-xs font-semibold mb-2">Legenda</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span>🚑</span><span>Ambulância</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏥</span><span>UPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏨</span><span>Hospital</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Semáforo Inteligente</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Painel de Controle */}
        <div className="space-y-4">
          {/* Configuração */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Configurar Rota
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Origem (Localização da Emergência)
                </label>
                <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods.map(n => (
                      <SelectItem key={n.name} value={n.name}>
                        {n.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Destino (Hospital)
                </label>
                <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map(h => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Velocidade da Simulação
                </label>
                <Select 
                  value={simulationSpeed.toString()} 
                  onValueChange={(v) => setSimulationSpeed(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x (Lento)</SelectItem>
                    <SelectItem value="1">1x (Normal)</SelectItem>
                    <SelectItem value="2">2x (Rápido)</SelectItem>
                    <SelectItem value="4">4x (Muito Rápido)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={startSimulation} 
                  disabled={isSimulating || !selectedOrigin || !selectedDestination}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={pauseSimulation}
                  disabled={!isSimulating}
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Métricas em Tempo Real */}
          {routeMetrics && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Métricas em Tempo Real
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Distância Total
                  </span>
                  <span className="font-semibold">{routeMetrics.distance} km</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Percorrido
                  </span>
                  <span className="font-semibold">{routeMetrics.distanceTraveled} km</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Tempo Estimado
                  </span>
                  <span className="font-semibold">{routeMetrics.estimatedTime} min</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Tempo Atual
                  </span>
                  <span className="font-semibold">{routeMetrics.currentTime} min</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-green-500" /> Velocidade Atual
                  </span>
                  <span className="font-semibold text-green-500">{routeMetrics.currentSpeed} km/h</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Gauge className="h-4 w-4" /> Velocidade Média
                  </span>
                  <span className="font-semibold">{routeMetrics.averageSpeed} km/h</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Radio className="h-4 w-4" /> Semáforos
                  </span>
                  <span className="font-semibold">
                    {routeMetrics.trafficLightsCleared}/{routeMetrics.totalTrafficLights}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Congestionamento
                  </span>
                  <Badge className={getCongestionBadgeClass(routeMetrics.congestionLevel)}>
                    {routeMetrics.congestionLevel === 'low' ? 'Baixo' : 
                     routeMetrics.congestionLevel === 'medium' ? 'Médio' : 'Alto'}
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="font-semibold">{routeMetrics.progress}%</span>
                  </div>
                  <Progress value={routeMetrics.progress} className="h-2" />
                </div>
              </div>
            </Card>
          )}

          {/* Log de Eventos */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Log de Eventos
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto text-xs font-mono">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">Aguardando início...</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className="text-muted-foreground">{log}</p>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Painel de Tráfego em Tempo Real */}
        <div className="xl:col-span-1 lg:col-span-3 xl:order-none lg:order-first">
          <TrafficPanel
            trafficData={trafficData}
            isLoading={isTrafficLoading}
            lastUpdate={lastUpdate}
            onRefresh={refreshData}
            onSimulateSpike={simulateSpike}
          />
        </div>
      </div>
    </div>
  );
};

export default AmbulanceSimulator;
