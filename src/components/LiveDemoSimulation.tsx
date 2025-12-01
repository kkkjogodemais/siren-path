import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  MapPin, 
  Gauge, 
  Radio, 
  Ambulance, 
  Building2,
  Timer,
  ArrowRight
} from 'lucide-react';
import RealtimeMap from '@/components/routing/RealtimeMap';
import { hospitals, smartTrafficLights, Hospital } from '@/data/sorocabaData';

// Rota realista pelas ruas de Sorocaba - do Centro ao Hospital Regional
const DEMO_ROUTE: [number, number][] = [
  // Início - Centro de Sorocaba (próximo à Praça Coronel Fernando Prestes)
  [-23.5015, -47.4580],
  [-23.5010, -47.4565],
  [-23.5005, -47.4550],
  // Seguindo pela Rua XV de Novembro
  [-23.4995, -47.4535],
  [-23.4985, -47.4520],
  [-23.4975, -47.4510],
  // Virando para Av. General Carneiro
  [-23.4965, -47.4505],
  [-23.4955, -47.4498],
  [-23.4945, -47.4490],
  // Continuando pela Av. Dom Aguirre
  [-23.4938, -47.4485],
  [-23.4930, -47.4478],
  [-23.4925, -47.4470],
  // Passando pelo primeiro semáforo inteligente
  [-23.4920, -47.4465],
  [-23.4915, -47.4460],
  [-23.4912, -47.4455],
  // Virando para Av. Ipanema
  [-23.4920, -47.4450],
  [-23.4930, -47.4445],
  [-23.4940, -47.4440],
  [-23.4950, -47.4435],
  // Seguindo em direção ao sul
  [-23.4965, -47.4430],
  [-23.4980, -47.4425],
  [-23.4995, -47.4420],
  // Passando pelo segundo semáforo
  [-23.5010, -47.4415],
  [-23.5025, -47.4410],
  [-23.5040, -47.4405],
  // Entrando na região do Hospital
  [-23.5055, -47.4400],
  [-23.5070, -47.4395],
  [-23.5085, -47.4392],
  [-23.5100, -47.4390],
  [-23.5115, -47.4388],
  [-23.5130, -47.4387],
  [-23.5145, -47.4388],
  // Chegada ao Hospital Regional de Sorocaba
  [-23.5156, -47.4389],
];

// Dados da simulação
const SIMULATION_CONFIG = {
  totalDistanceKm: 3.2,
  estimatedTimeMinutes: 6.5,
  averageSpeedKmh: 45,
  trafficLightsCount: 4,
  origin: 'Centro - Praça Fernando Prestes',
  destination: 'Hospital Regional de Sorocaba',
};

const LiveDemoSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [trafficLightsCleared, setTrafficLightsCleared] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calcular métricas em tempo real
  const progress = (currentIndex / (DEMO_ROUTE.length - 1)) * 100;
  const distanceTraveled = (SIMULATION_CONFIG.totalDistanceKm * progress / 100);
  const estimatedArrival = SIMULATION_CONFIG.estimatedTimeMinutes - (elapsedSeconds / 60);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Hospital de destino
  const destinationHospital = hospitals.find(h => h.id === 'regional') as Hospital;

  // Resetar simulação
  const resetSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setTrafficLightsCleared(0);
    setCurrentSpeed(0);
    setHasCompleted(false);
  }, []);

  // Iniciar simulação
  const startSimulation = useCallback(() => {
    resetSimulation();
    setIsRunning(true);
    setHasCompleted(false);
  }, [resetSimulation]);

  // Auto-start após 2 segundos
  useEffect(() => {
    const autoStartTimer = setTimeout(() => {
      if (!hasCompleted && !isRunning) {
        startSimulation();
      }
    }, 2000);

    return () => clearTimeout(autoStartTimer);
  }, []);

  // Loop principal da simulação
  useEffect(() => {
    if (!isRunning) return;

    // Timer para cronômetro
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 0.1);
    }, 100);

    // Intervalo de movimento da ambulância (velocidade realista)
    // 500ms por ponto = movimento suave e realista
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        
        // Verificar semáforos passados
        if (next === 12 || next === 22) {
          setTrafficLightsCleared(t => t + 1);
        }
        
        // Simular variação de velocidade
        const baseSpeed = 45;
        const variation = Math.sin(next * 0.3) * 10;
        setCurrentSpeed(Math.round(baseSpeed + variation));
        
        // Verificar conclusão
        if (next >= DEMO_ROUTE.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
          setHasCompleted(true);
          return DEMO_ROUTE.length - 1;
        }
        
        return next;
      });
    }, 400); // 400ms = movimento suave e tempo total ~13s para a demo

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-500/10 text-red-500 border-red-500/20">
            Simulação em Tempo Real
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Veja o Sistema em Ação
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simulação real de uma ambulância traçando rota otimizada pelas ruas de Sorocaba
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-[500px] relative">
              <RealtimeMap
                route={DEMO_ROUTE.slice(0, currentIndex + 1)}
                hospitals={hospitals}
                trafficLights={smartTrafficLights}
                ambulancePosition={DEMO_ROUTE[currentIndex]}
                destinationHospital={destinationHospital}
                showAllHospitals={true}
                showTrafficLights={true}
              />
              
              {/* Cronômetro no mapa */}
              <div className="absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <Timer className="h-5 w-5 text-red-500" />
                  <span className="font-mono text-2xl font-bold text-red-500">
                    {formatTime(elapsedSeconds)}
                  </span>
                </div>
                {isRunning && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">AO VIVO</span>
                  </div>
                )}
              </div>

              {/* Status de conclusão */}
              {hasCompleted && (
                <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm z-[1001] flex items-center justify-center">
                  <Card className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      Paciente Entregue!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Tempo total: {formatTime(elapsedSeconds)}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={resetSimulation} variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Repetir
                      </Button>
                      <Link to="/plataforma">
                        <Button>
                          Acessar Plataforma
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </div>

          {/* Painel de Métricas */}
          <div className="space-y-4">
            {/* Info da Rota */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Ambulance className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold">Chamado de Emergência</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="font-medium text-sm">{SIMULATION_CONFIG.origin}</p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-border" />
                </div>
                
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium text-sm">{SIMULATION_CONFIG.destination}</p>
                </div>
              </div>
            </Card>

            {/* Métricas em Tempo Real */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Métricas em Tempo Real
              </h3>
              
              <div className="space-y-4">
                {/* Progresso */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-muted-foreground">Distância</span>
                    </div>
                    <p className="text-lg font-bold">{distanceTraveled.toFixed(1)} km</p>
                    <p className="text-xs text-muted-foreground">
                      de {SIMULATION_CONFIG.totalDistanceKm} km
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">Velocidade</span>
                    </div>
                    <p className="text-lg font-bold">{currentSpeed} km/h</p>
                    <p className="text-xs text-muted-foreground">atual</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">ETA</span>
                    </div>
                    <p className="text-lg font-bold">
                      {hasCompleted ? '00:00' : `${Math.max(0, estimatedArrival).toFixed(1)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">minutos</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Radio className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">Semáforos</span>
                    </div>
                    <p className="text-lg font-bold">
                      {trafficLightsCleared}/{SIMULATION_CONFIG.trafficLightsCount}
                    </p>
                    <p className="text-xs text-muted-foreground">liberados</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Controles */}
            <Card className="p-4">
              <div className="flex gap-2">
                <Button 
                  onClick={startSimulation}
                  disabled={isRunning}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {hasCompleted ? 'Repetir' : 'Iniciar'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={resetSimulation}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/plataforma">
                  <Button variant="link" className="text-primary">
                    Acessar Plataforma Completa
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSimulation;
