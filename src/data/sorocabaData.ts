// Dados reais de Sorocaba - Hospitais, Semáforos Inteligentes e Bairros

export interface Hospital {
  id: string;
  name: string;
  type: 'public' | 'private' | 'upa';
  coordinates: [number, number];
  address: string;
  phone: string;
  beds: number;
  emergencyCapacity: 'high' | 'medium' | 'low';
}

export interface SmartTrafficLight {
  id: string;
  coordinates: [number, number];
  intersection: string;
  status: 'green' | 'red' | 'yellow';
  connectedToSystem: boolean;
  averageWaitTime: number; // seconds
}

export interface Ambulance {
  id: string;
  name: string;
  type: 'basic' | 'advanced' | 'uti';
  status: 'available' | 'en-route' | 'at-scene' | 'returning';
  currentPosition: [number, number];
  destination?: [number, number];
}

// Hospitais reais de Sorocaba
export const hospitals: Hospital[] = [
  {
    id: 'gpaci',
    name: 'Hospital GPACI',
    type: 'private',
    coordinates: [-23.4876, -47.4291],
    address: 'R. Aparecida, 249 - Centro',
    phone: '(15) 3211-1500',
    beds: 120,
    emergencyCapacity: 'high'
  },
  {
    id: 'santa-lucinda',
    name: 'Hospital Santa Lucinda',
    type: 'private',
    coordinates: [-23.4952, -47.4583],
    address: 'R. Voluntários de São Paulo, 3780',
    phone: '(15) 2101-9000',
    beds: 180,
    emergencyCapacity: 'high'
  },
  {
    id: 'modelo',
    name: 'Hospital Modelo',
    type: 'public',
    coordinates: [-23.5012, -47.4478],
    address: 'Av. Comendador Pereira Inácio, 564',
    phone: '(15) 3233-3000',
    beds: 200,
    emergencyCapacity: 'high'
  },
  {
    id: 'upa-zona-norte',
    name: 'UPA Zona Norte',
    type: 'upa',
    coordinates: [-23.4723, -47.4612],
    address: 'Av. São Paulo, 1500 - Jd. Santa Rosália',
    phone: '(15) 3229-8000',
    beds: 40,
    emergencyCapacity: 'medium'
  },
  {
    id: 'upa-zona-leste',
    name: 'UPA Zona Leste',
    type: 'upa',
    coordinates: [-23.5089, -47.4198],
    address: 'R. Cel. Nogueira Padilha, 1350',
    phone: '(15) 3229-8100',
    beds: 35,
    emergencyCapacity: 'medium'
  },
  {
    id: 'saude-sorocabana',
    name: 'Hospital Saúde Sorocabana',
    type: 'private',
    coordinates: [-23.4998, -47.4521],
    address: 'R. Dr. Álvaro Soares, 91',
    phone: '(15) 3332-4400',
    beds: 90,
    emergencyCapacity: 'medium'
  },
  {
    id: 'evangélico',
    name: 'Hospital Evangélico',
    type: 'private',
    coordinates: [-23.4934, -47.4467],
    address: 'R. Dr. Souza Pereira, 100',
    phone: '(15) 3227-8000',
    beds: 85,
    emergencyCapacity: 'medium'
  },
  {
    id: 'regional',
    name: 'Hospital Regional de Sorocaba',
    type: 'public',
    coordinates: [-23.5156, -47.4389],
    address: 'Av. Comendador Pereira Inácio, 900',
    phone: '(15) 3238-8000',
    beds: 300,
    emergencyCapacity: 'high'
  }
];

// Semáforos inteligentes em principais cruzamentos
export const smartTrafficLights: SmartTrafficLight[] = [
  {
    id: 'stl-1',
    coordinates: [-23.4958, -47.4525],
    intersection: 'Av. Dom Aguirre x R. XV de Novembro',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 45
  },
  {
    id: 'stl-2',
    coordinates: [-23.4912, -47.4478],
    intersection: 'Av. General Carneiro x R. Padre Luiz',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 38
  },
  {
    id: 'stl-3',
    coordinates: [-23.5001, -47.4498],
    intersection: 'Av. Ipanema x R. São Paulo',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 52
  },
  {
    id: 'stl-4',
    coordinates: [-23.4845, -47.4392],
    intersection: 'Av. Antônio Carlos Comitre x R. Itapeva',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 40
  },
  {
    id: 'stl-5',
    coordinates: [-23.5078, -47.4334],
    intersection: 'Av. Independência x R. Cel. Nogueira Padilha',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 48
  },
  {
    id: 'stl-6',
    coordinates: [-23.4789, -47.4556],
    intersection: 'Av. São Paulo x R. Comendador Oetterer',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 35
  },
  {
    id: 'stl-7',
    coordinates: [-23.5123, -47.4567],
    intersection: 'Av. Washington Luiz x R. Barão de Tatuí',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 42
  },
  {
    id: 'stl-8',
    coordinates: [-23.4867, -47.4678],
    intersection: 'Av. Pereira da Silva x R. Teodoro Kaiser',
    status: 'green',
    connectedToSystem: true,
    averageWaitTime: 50
  }
];

// Bairros de Sorocaba com coordenadas centrais
export const neighborhoods = [
  { name: 'Centro', coordinates: [-23.4958, -47.4524] as [number, number] },
  { name: 'Jardim Vera Cruz', coordinates: [-23.5180, -47.4680] as [number, number] },
  { name: 'Vila Hortência', coordinates: [-23.4876, -47.4623] as [number, number] },
  { name: 'Jardim Santa Rosália', coordinates: [-23.4712, -47.4589] as [number, number] },
  { name: 'Jardim Gonçalves', coordinates: [-23.5012, -47.4398] as [number, number] },
  { name: 'Jardim América', coordinates: [-23.4834, -47.4312] as [number, number] },
  { name: 'Vila Barão', coordinates: [-23.5089, -47.4567] as [number, number] },
  { name: 'Jardim Faculdade', coordinates: [-23.4756, -47.4478] as [number, number] },
  { name: 'Jardim Ipanema', coordinates: [-23.5034, -47.4512] as [number, number] },
  { name: 'Jardim Simus', coordinates: [-23.5145, -47.4234] as [number, number] },
];

// Função para calcular distância usando Haversine
export const calculateHaversineDistance = (
  coord1: [number, number],
  coord2: [number, number]
): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Função para calcular tempo estimado baseado em distância e tráfego
export const calculateEstimatedTime = (
  distance: number,
  congestionLevel: 'low' | 'medium' | 'high',
  isPriorityVehicle: boolean = true
): number => {
  // Velocidade média em km/h
  const baseSpeed = isPriorityVehicle ? 50 : 35;
  
  // Fator de congestionamento
  const congestionFactor = {
    low: 1.0,
    medium: 1.4,
    high: 2.0
  }[congestionLevel];
  
  // Se veículo prioritário, reduz impacto do congestionamento
  const effectiveFactor = isPriorityVehicle 
    ? 1 + (congestionFactor - 1) * 0.3 
    : congestionFactor;
  
  // Tempo em minutos
  return (distance / baseSpeed) * 60 * effectiveFactor;
};

// Função para gerar rota realista entre dois pontos
export const generateRealisticRoute = (
  start: [number, number],
  end: [number, number],
  numPoints: number = 20
): [number, number][] => {
  const route: [number, number][] = [start];
  
  const latDiff = end[0] - start[0];
  const lonDiff = end[1] - start[1];
  
  for (let i = 1; i < numPoints - 1; i++) {
    const progress = i / (numPoints - 1);
    
    // Adiciona variação para simular ruas reais
    const variation = Math.sin(progress * Math.PI * 3) * 0.002;
    const lateralVariation = Math.cos(progress * Math.PI * 2) * 0.001;
    
    const lat = start[0] + latDiff * progress + variation;
    const lon = start[1] + lonDiff * progress + lateralVariation;
    
    route.push([lat, lon]);
  }
  
  route.push(end);
  return route;
};

// Função para encontrar hospital mais próximo
export const findNearestHospital = (
  position: [number, number],
  requiredCapacity?: 'high' | 'medium' | 'low'
): Hospital => {
  let nearestHospital = hospitals[0];
  let minDistance = Infinity;
  
  hospitals.forEach(hospital => {
    if (requiredCapacity && hospital.emergencyCapacity !== requiredCapacity) {
      // Se capacidade alta é necessária, aceita apenas hospitais com alta capacidade
      if (requiredCapacity === 'high' && hospital.emergencyCapacity !== 'high') {
        return;
      }
    }
    
    const distance = calculateHaversineDistance(position, hospital.coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      nearestHospital = hospital;
    }
  });
  
  return nearestHospital;
};

// Função para obter semáforos na rota
export const getTrafficLightsOnRoute = (
  route: [number, number][],
  maxDistance: number = 0.15 // km
): SmartTrafficLight[] => {
  const lightsOnRoute: SmartTrafficLight[] = [];
  
  smartTrafficLights.forEach(light => {
    for (const point of route) {
      const distance = calculateHaversineDistance(point, light.coordinates);
      if (distance < maxDistance) {
        lightsOnRoute.push(light);
        break;
      }
    }
  });
  
  return lightsOnRoute;
};
