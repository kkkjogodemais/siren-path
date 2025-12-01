// Serviço de Simulação de Tráfego Realista para Sorocaba
// Simula padrões de congestionamento baseados em dados estatísticos reais

export interface TrafficSegment {
  id: string;
  name: string;
  coordinates: [number, number];
  baseSpeed: number; // km/h em condições ideais
  congestionFactor: number; // 0-1 (0 = livre, 1 = congestionado)
  incidents: TrafficIncident[];
}

export interface TrafficIncident {
  type: 'accident' | 'construction' | 'event' | 'weather';
  severity: 'low' | 'medium' | 'high';
  description: string;
  delay: number; // minutos adicionais
}

export interface TrafficData {
  timestamp: Date;
  overallCongestion: number; // 0-100
  congestionLevel: 'low' | 'medium' | 'high' | 'critical';
  segments: TrafficSegment[];
  averageSpeed: number;
  incidents: TrafficIncident[];
  weatherCondition: 'clear' | 'rain' | 'heavy_rain' | 'fog';
  isRushHour: boolean;
  dayType: 'weekday' | 'weekend' | 'holiday';
}

// Padrões de tráfego por hora do dia (baseado em dados típicos de cidades brasileiras)
const HOURLY_CONGESTION_PATTERN: Record<number, number> = {
  0: 0.05, 1: 0.03, 2: 0.02, 3: 0.02, 4: 0.05, 5: 0.15,
  6: 0.35, 7: 0.70, 8: 0.85, 9: 0.65, 10: 0.45, 11: 0.50,
  12: 0.55, 13: 0.50, 14: 0.45, 15: 0.50, 16: 0.60, 17: 0.80,
  18: 0.90, 19: 0.75, 20: 0.50, 21: 0.35, 22: 0.20, 23: 0.10
};

// Fator de ajuste por dia da semana
const DAY_OF_WEEK_FACTOR: Record<number, number> = {
  0: 0.4,  // Domingo
  1: 1.0,  // Segunda
  2: 0.95, // Terça
  3: 0.95, // Quarta
  4: 1.0,  // Quinta
  5: 1.1,  // Sexta (mais congestionado)
  6: 0.6   // Sábado
};

// Segmentos de ruas principais de Sorocaba com coordenadas reais
const MAIN_STREET_SEGMENTS: TrafficSegment[] = [
  {
    id: 'av-dom-aguirre',
    name: 'Av. Dom Aguirre',
    coordinates: [-23.4958, -47.4525],
    baseSpeed: 50,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-general-carneiro',
    name: 'Av. General Carneiro',
    coordinates: [-23.4912, -47.4478],
    baseSpeed: 45,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-ipanema',
    name: 'Av. Ipanema',
    coordinates: [-23.5001, -47.4498],
    baseSpeed: 50,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-antonio-carlos-comitre',
    name: 'Av. Antônio Carlos Comitre',
    coordinates: [-23.4845, -47.4392],
    baseSpeed: 60,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-independencia',
    name: 'Av. Independência',
    coordinates: [-23.5078, -47.4334],
    baseSpeed: 55,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-sao-paulo',
    name: 'Av. São Paulo',
    coordinates: [-23.4789, -47.4556],
    baseSpeed: 45,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-washington-luiz',
    name: 'Av. Washington Luiz',
    coordinates: [-23.5123, -47.4567],
    baseSpeed: 50,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-pereira-da-silva',
    name: 'Av. Pereira da Silva',
    coordinates: [-23.4867, -47.4678],
    baseSpeed: 45,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'r-xv-novembro',
    name: 'R. XV de Novembro (Centro)',
    coordinates: [-23.4965, -47.4512],
    baseSpeed: 30,
    congestionFactor: 0,
    incidents: []
  },
  {
    id: 'av-itavuvu',
    name: 'Av. Itavuvu',
    coordinates: [-23.4734, -47.4423],
    baseSpeed: 55,
    congestionFactor: 0,
    incidents: []
  }
];

// Tipos de incidentes possíveis
const POSSIBLE_INCIDENTS: Omit<TrafficIncident, 'delay'>[] = [
  { type: 'accident', severity: 'low', description: 'Colisão leve na via' },
  { type: 'accident', severity: 'medium', description: 'Acidente com vítimas' },
  { type: 'accident', severity: 'high', description: 'Engavetamento múltiplo' },
  { type: 'construction', severity: 'low', description: 'Manutenção de via' },
  { type: 'construction', severity: 'medium', description: 'Obras na pista' },
  { type: 'event', severity: 'low', description: 'Evento local' },
  { type: 'event', severity: 'medium', description: 'Manifestação/Protesto' },
  { type: 'weather', severity: 'low', description: 'Chuva leve' },
  { type: 'weather', severity: 'medium', description: 'Chuva forte' },
  { type: 'weather', severity: 'high', description: 'Alagamento' }
];

// Gera um número aleatório com distribuição gaussiana
function gaussianRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z * stdDev;
}

// Calcula o nível de congestionamento
function calculateCongestionLevel(congestion: number): 'low' | 'medium' | 'high' | 'critical' {
  if (congestion < 25) return 'low';
  if (congestion < 50) return 'medium';
  if (congestion < 75) return 'high';
  return 'critical';
}

// Determina condição climática (simulada)
function getWeatherCondition(): 'clear' | 'rain' | 'heavy_rain' | 'fog' {
  const rand = Math.random();
  if (rand < 0.7) return 'clear';
  if (rand < 0.85) return 'rain';
  if (rand < 0.95) return 'heavy_rain';
  return 'fog';
}

// Fator de impacto do clima no tráfego
function getWeatherImpact(weather: 'clear' | 'rain' | 'heavy_rain' | 'fog'): number {
  switch (weather) {
    case 'clear': return 1.0;
    case 'rain': return 1.3;
    case 'heavy_rain': return 1.6;
    case 'fog': return 1.4;
  }
}

// Gera incidentes aleatórios
function generateRandomIncidents(): TrafficIncident[] {
  const incidents: TrafficIncident[] = [];
  const incidentProbability = 0.15; // 15% de chance de ter incidentes
  
  if (Math.random() < incidentProbability) {
    const numIncidents = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numIncidents; i++) {
      const baseIncident = POSSIBLE_INCIDENTS[Math.floor(Math.random() * POSSIBLE_INCIDENTS.length)];
      const delayMap = { low: 2, medium: 5, high: 10 };
      incidents.push({
        ...baseIncident,
        delay: delayMap[baseIncident.severity] + Math.floor(Math.random() * 5)
      });
    }
  }
  
  return incidents;
}

// Verifica se é feriado (simplificado - apenas alguns feriados brasileiros)
function isHoliday(date: Date): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const holidays = [
    { month: 1, day: 1 },   // Ano Novo
    { month: 4, day: 21 },  // Tiradentes
    { month: 5, day: 1 },   // Dia do Trabalho
    { month: 9, day: 7 },   // Independência
    { month: 10, day: 12 }, // Nossa Senhora
    { month: 11, day: 2 },  // Finados
    { month: 11, day: 15 }, // Proclamação República
    { month: 12, day: 25 }, // Natal
  ];
  
  return holidays.some(h => h.month === month && h.day === day);
}

// Função principal: obter dados de tráfego em tempo real (simulado)
export function getRealtimeTrafficData(customDate?: Date): TrafficData {
  const now = customDate || new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  
  // Determinar tipo do dia
  const holiday = isHoliday(now);
  const dayType = holiday ? 'holiday' : (dayOfWeek === 0 || dayOfWeek === 6 ? 'weekend' : 'weekday');
  
  // Condição climática
  const weatherCondition = getWeatherCondition();
  const weatherImpact = getWeatherImpact(weatherCondition);
  
  // Calcular congestionamento base
  const hourlyFactor = HOURLY_CONGESTION_PATTERN[hour];
  const dayFactor = holiday ? 0.3 : DAY_OF_WEEK_FACTOR[dayOfWeek];
  
  // Adicionar variação aleatória
  const randomVariation = gaussianRandom(0, 0.1);
  
  // Calcular congestionamento geral (0-100)
  let baseCongestion = hourlyFactor * dayFactor * weatherImpact * 100;
  baseCongestion = Math.max(0, Math.min(100, baseCongestion + randomVariation * 30));
  
  // Gerar incidentes
  const incidents = generateRandomIncidents();
  
  // Adicionar impacto de incidentes
  const incidentImpact = incidents.reduce((acc, inc) => {
    const impactMap = { low: 5, medium: 15, high: 30 };
    return acc + impactMap[inc.severity];
  }, 0);
  
  const overallCongestion = Math.min(100, baseCongestion + incidentImpact);
  
  // Gerar dados dos segmentos
  const segments: TrafficSegment[] = MAIN_STREET_SEGMENTS.map(segment => {
    // Cada segmento tem variação individual
    const segmentVariation = gaussianRandom(0, 0.15);
    const segmentCongestion = Math.max(0, Math.min(1, 
      (overallCongestion / 100) + segmentVariation
    ));
    
    // Alguns segmentos recebem incidentes
    const segmentIncidents = Math.random() < 0.1 ? 
      [incidents[Math.floor(Math.random() * Math.max(1, incidents.length))]] : 
      [];
    
    return {
      ...segment,
      congestionFactor: segmentCongestion,
      incidents: segmentIncidents.filter(Boolean)
    };
  });
  
  // Calcular velocidade média
  const avgCongestionFactor = segments.reduce((acc, s) => acc + s.congestionFactor, 0) / segments.length;
  const averageSpeed = Math.round(50 * (1 - avgCongestionFactor * 0.7));
  
  // Determinar se é horário de pico
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  
  return {
    timestamp: now,
    overallCongestion: Math.round(overallCongestion),
    congestionLevel: calculateCongestionLevel(overallCongestion),
    segments,
    averageSpeed,
    incidents,
    weatherCondition,
    isRushHour,
    dayType
  };
}

// Calcula tempo estimado com base nos dados de tráfego
export function calculateRouteTimeWithTraffic(
  distanceKm: number,
  trafficData: TrafficData,
  isPriorityVehicle: boolean = true
): { 
  estimatedMinutes: number; 
  baseMinutes: number; 
  delayMinutes: number;
  effectiveSpeed: number;
} {
  const baseSpeed = isPriorityVehicle ? 60 : 40; // km/h
  const baseMinutes = (distanceKm / baseSpeed) * 60;
  
  // Fator de congestionamento
  const congestionFactor = trafficData.overallCongestion / 100;
  
  // Veículo prioritário sofre menos impacto
  const effectiveCongestionFactor = isPriorityVehicle 
    ? congestionFactor * 0.3 
    : congestionFactor * 0.8;
  
  // Delay por incidentes
  const incidentDelay = trafficData.incidents.reduce((acc, inc) => acc + inc.delay, 0);
  const effectiveIncidentDelay = isPriorityVehicle ? incidentDelay * 0.2 : incidentDelay;
  
  // Fator climático
  const weatherFactor = getWeatherImpact(trafficData.weatherCondition);
  const weatherPenalty = isPriorityVehicle ? (weatherFactor - 1) * 0.5 : weatherFactor - 1;
  
  // Calcular tempo total
  const delayMinutes = baseMinutes * effectiveCongestionFactor + 
                       effectiveIncidentDelay + 
                       baseMinutes * weatherPenalty;
  
  const estimatedMinutes = baseMinutes + delayMinutes;
  const effectiveSpeed = (distanceKm / estimatedMinutes) * 60;
  
  return {
    estimatedMinutes: Math.round(estimatedMinutes * 10) / 10,
    baseMinutes: Math.round(baseMinutes * 10) / 10,
    delayMinutes: Math.round(delayMinutes * 10) / 10,
    effectiveSpeed: Math.round(effectiveSpeed)
  };
}

// Obter cor do nível de congestionamento
export function getCongestionColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (level) {
    case 'low': return '#22c55e';      // Verde
    case 'medium': return '#eab308';   // Amarelo
    case 'high': return '#f97316';     // Laranja
    case 'critical': return '#ef4444'; // Vermelho
  }
}

// Formatar condição climática para exibição
export function formatWeatherCondition(weather: 'clear' | 'rain' | 'heavy_rain' | 'fog'): string {
  switch (weather) {
    case 'clear': return 'Céu Limpo ☀️';
    case 'rain': return 'Chuva Leve 🌧️';
    case 'heavy_rain': return 'Chuva Forte ⛈️';
    case 'fog': return 'Neblina 🌫️';
  }
}

// Serviço de atualização em tempo real (hook)
export class TrafficSimulationService {
  private listeners: ((data: TrafficData) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private currentData: TrafficData;

  constructor() {
    this.currentData = getRealtimeTrafficData();
  }

  subscribe(callback: (data: TrafficData) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentData);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  start(intervalMs: number = 5000): void {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      this.currentData = getRealtimeTrafficData();
      this.listeners.forEach(l => l(this.currentData));
    }, intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getCurrentData(): TrafficData {
    return this.currentData;
  }

  // Simula um pico de tráfego (útil para demos)
  simulateTrafficSpike(): void {
    const spikedData: TrafficData = {
      ...this.currentData,
      overallCongestion: Math.min(100, this.currentData.overallCongestion + 30),
      congestionLevel: 'high',
      incidents: [
        {
          type: 'accident',
          severity: 'medium',
          description: 'Acidente na via principal',
          delay: 8
        }
      ]
    };
    this.currentData = spikedData;
    this.listeners.forEach(l => l(spikedData));
  }
}

// Singleton do serviço
export const trafficService = new TrafficSimulationService();
