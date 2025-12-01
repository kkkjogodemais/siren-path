// Dados administrativos para o painel de controle

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface SLARecord {
  id: string;
  type: 'response_time' | 'arrival_time' | 'total_time';
  target: number; // minutos
  current: number; // minutos
  compliance: number; // porcentagem
  period: string;
}

export interface Complaint {
  id: string;
  date: string;
  type: 'delay' | 'service' | 'equipment' | 'other';
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  resolution?: string;
}

export interface SystemProblem {
  id: string;
  date: string;
  system: 'routing' | 'traffic_lights' | 'communication' | 'database' | 'api';
  description: string;
  impact: 'none' | 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'fixing' | 'resolved';
  resolvedAt?: string;
}

export interface AmbulanceStatus {
  id: string;
  plate: string;
  type: 'basic' | 'advanced' | 'uti';
  status: 'available' | 'en_route' | 'at_scene' | 'returning' | 'maintenance';
  driver: string;
  lastPosition: [number, number];
  lastUpdate: string;
  fuelLevel: number;
  nextMaintenance: string;
}

export interface TrafficLightStatus {
  id: string;
  intersection: string;
  status: 'operational' | 'degraded' | 'offline';
  lastSync: string;
  responseTime: number; // ms
  activationsToday: number;
  failuresToday: number;
}

export interface HospitalInfo {
  id: string;
  name: string;
  type: 'public' | 'private' | 'upa';
  address: string;
  phone: string;
  beds: number;
  availableBeds: number;
  emergencyCapacity: 'high' | 'medium' | 'low';
  status: 'operational' | 'limited' | 'closed';
  waitTime: number; // minutos
  lastUpdate: string;
}

export interface SystemConfig {
  key: string;
  label: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[];
  description: string;
}

// Dados de exemplo
export const adminUsers: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Carlos Silva',
    email: 'carlos.silva@emergencia.gov.br',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00',
    createdAt: '2023-06-01'
  },
  {
    id: 'user-2',
    name: 'Maria Santos',
    email: 'maria.santos@emergencia.gov.br',
    role: 'operator',
    status: 'active',
    lastLogin: '2024-01-15T08:15:00',
    createdAt: '2023-08-15'
  },
  {
    id: 'user-3',
    name: 'João Oliveira',
    email: 'joao.oliveira@emergencia.gov.br',
    role: 'operator',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00',
    createdAt: '2023-09-20'
  },
  {
    id: 'user-4',
    name: 'Ana Costa',
    email: 'ana.costa@emergencia.gov.br',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2024-01-10T11:00:00',
    createdAt: '2023-10-05'
  }
];

export const slaRecords: SLARecord[] = [
  {
    id: 'sla-1',
    type: 'response_time',
    target: 2,
    current: 1.8,
    compliance: 94.5,
    period: 'Janeiro 2024'
  },
  {
    id: 'sla-2',
    type: 'arrival_time',
    target: 8,
    current: 7.2,
    compliance: 91.2,
    period: 'Janeiro 2024'
  },
  {
    id: 'sla-3',
    type: 'total_time',
    target: 15,
    current: 13.5,
    compliance: 88.7,
    period: 'Janeiro 2024'
  }
];

export const complaints: Complaint[] = [
  {
    id: 'comp-1',
    date: '2024-01-15T09:30:00',
    type: 'delay',
    description: 'Ambulância demorou mais de 20 minutos para chegar',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Maria Santos'
  },
  {
    id: 'comp-2',
    date: '2024-01-14T14:20:00',
    type: 'service',
    description: 'Atendimento inadequado durante o transporte',
    status: 'open',
    priority: 'medium'
  },
  {
    id: 'comp-3',
    date: '2024-01-13T11:45:00',
    type: 'equipment',
    description: 'Equipamento de oxigênio com defeito',
    status: 'resolved',
    priority: 'critical',
    assignedTo: 'João Oliveira',
    resolution: 'Equipamento substituído e ambulância liberada'
  },
  {
    id: 'comp-4',
    date: '2024-01-12T08:00:00',
    type: 'other',
    description: 'Dificuldade em contatar a central',
    status: 'closed',
    priority: 'low',
    resolution: 'Problema de telecomunicação resolvido'
  }
];

export const systemProblems: SystemProblem[] = [
  {
    id: 'prob-1',
    date: '2024-01-15T07:00:00',
    system: 'traffic_lights',
    description: 'Semáforo STL-3 não responde ao sistema',
    impact: 'medium',
    status: 'fixing'
  },
  {
    id: 'prob-2',
    date: '2024-01-14T22:30:00',
    system: 'communication',
    description: 'Latência alta na comunicação com ambulâncias',
    impact: 'low',
    status: 'resolved',
    resolvedAt: '2024-01-15T02:15:00'
  },
  {
    id: 'prob-3',
    date: '2024-01-13T15:00:00',
    system: 'routing',
    description: 'Algoritmo de roteamento com cálculos inconsistentes',
    impact: 'high',
    status: 'resolved',
    resolvedAt: '2024-01-13T18:45:00'
  }
];

export const ambulanceStatuses: AmbulanceStatus[] = [
  {
    id: 'amb-1',
    plate: 'ABC-1234',
    type: 'advanced',
    status: 'available',
    driver: 'Pedro Lima',
    lastPosition: [-23.4958, -47.4525],
    lastUpdate: '2024-01-15T10:30:00',
    fuelLevel: 85,
    nextMaintenance: '2024-02-01'
  },
  {
    id: 'amb-2',
    plate: 'DEF-5678',
    type: 'uti',
    status: 'en_route',
    driver: 'Roberto Alves',
    lastPosition: [-23.4876, -47.4291],
    lastUpdate: '2024-01-15T10:28:00',
    fuelLevel: 72,
    nextMaintenance: '2024-01-25'
  },
  {
    id: 'amb-3',
    plate: 'GHI-9012',
    type: 'basic',
    status: 'at_scene',
    driver: 'Fernando Costa',
    lastPosition: [-23.5012, -47.4478],
    lastUpdate: '2024-01-15T10:25:00',
    fuelLevel: 45,
    nextMaintenance: '2024-01-20'
  },
  {
    id: 'amb-4',
    plate: 'JKL-3456',
    type: 'advanced',
    status: 'maintenance',
    driver: '-',
    lastPosition: [-23.4952, -47.4583],
    lastUpdate: '2024-01-14T18:00:00',
    fuelLevel: 100,
    nextMaintenance: '2024-01-15'
  },
  {
    id: 'amb-5',
    plate: 'MNO-7890',
    type: 'basic',
    status: 'returning',
    driver: 'Lucas Mendes',
    lastPosition: [-23.5089, -47.4198],
    lastUpdate: '2024-01-15T10:32:00',
    fuelLevel: 60,
    nextMaintenance: '2024-02-10'
  }
];

export const trafficLightStatuses: TrafficLightStatus[] = [
  {
    id: 'stl-1',
    intersection: 'Av. Dom Aguirre x R. XV de Novembro',
    status: 'operational',
    lastSync: '2024-01-15T10:34:00',
    responseTime: 45,
    activationsToday: 23,
    failuresToday: 0
  },
  {
    id: 'stl-2',
    intersection: 'Av. General Carneiro x R. Padre Luiz',
    status: 'operational',
    lastSync: '2024-01-15T10:34:00',
    responseTime: 52,
    activationsToday: 18,
    failuresToday: 1
  },
  {
    id: 'stl-3',
    intersection: 'Av. Ipanema x R. São Paulo',
    status: 'degraded',
    lastSync: '2024-01-15T08:15:00',
    responseTime: 1250,
    activationsToday: 5,
    failuresToday: 12
  },
  {
    id: 'stl-4',
    intersection: 'Av. Antônio Carlos Comitre x R. Itapeva',
    status: 'operational',
    lastSync: '2024-01-15T10:34:00',
    responseTime: 38,
    activationsToday: 31,
    failuresToday: 0
  },
  {
    id: 'stl-5',
    intersection: 'Av. Independência x R. Cel. Nogueira Padilha',
    status: 'operational',
    lastSync: '2024-01-15T10:34:00',
    responseTime: 41,
    activationsToday: 27,
    failuresToday: 0
  },
  {
    id: 'stl-6',
    intersection: 'Av. São Paulo x R. Comendador Oetterer',
    status: 'offline',
    lastSync: '2024-01-14T23:45:00',
    responseTime: 0,
    activationsToday: 0,
    failuresToday: 0
  },
  {
    id: 'stl-7',
    intersection: 'Av. Washington Luiz x R. Barão de Tatuí',
    status: 'operational',
    lastSync: '2024-01-15T10:34:00',
    responseTime: 48,
    activationsToday: 15,
    failuresToday: 0
  },
  {
    id: 'stl-8',
    intersection: 'Av. Pereira da Silva x R. Teodoro Kaiser',
    status: 'operational',
    lastSync: '2024-01-15T10:34:00',
    responseTime: 55,
    activationsToday: 19,
    failuresToday: 2
  }
];

export const hospitalInfos: HospitalInfo[] = [
  {
    id: 'gpaci',
    name: 'Hospital GPACI',
    type: 'private',
    address: 'R. Aparecida, 249 - Centro',
    phone: '(15) 3211-1500',
    beds: 120,
    availableBeds: 23,
    emergencyCapacity: 'high',
    status: 'operational',
    waitTime: 25,
    lastUpdate: '2024-01-15T10:30:00'
  },
  {
    id: 'santa-lucinda',
    name: 'Hospital Santa Lucinda',
    type: 'private',
    address: 'R. Voluntários de São Paulo, 3780',
    phone: '(15) 2101-9000',
    beds: 180,
    availableBeds: 45,
    emergencyCapacity: 'high',
    status: 'operational',
    waitTime: 15,
    lastUpdate: '2024-01-15T10:28:00'
  },
  {
    id: 'modelo',
    name: 'Hospital Modelo',
    type: 'public',
    address: 'Av. Comendador Pereira Inácio, 564',
    phone: '(15) 3233-3000',
    beds: 200,
    availableBeds: 12,
    emergencyCapacity: 'high',
    status: 'limited',
    waitTime: 45,
    lastUpdate: '2024-01-15T10:25:00'
  },
  {
    id: 'upa-zona-norte',
    name: 'UPA Zona Norte',
    type: 'upa',
    address: 'Av. São Paulo, 1500 - Jd. Santa Rosália',
    phone: '(15) 3229-8000',
    beds: 40,
    availableBeds: 8,
    emergencyCapacity: 'medium',
    status: 'operational',
    waitTime: 30,
    lastUpdate: '2024-01-15T10:32:00'
  },
  {
    id: 'upa-zona-leste',
    name: 'UPA Zona Leste',
    type: 'upa',
    address: 'R. Cel. Nogueira Padilha, 1350',
    phone: '(15) 3229-8100',
    beds: 35,
    availableBeds: 5,
    emergencyCapacity: 'medium',
    status: 'limited',
    waitTime: 55,
    lastUpdate: '2024-01-15T10:29:00'
  },
  {
    id: 'regional',
    name: 'Hospital Regional de Sorocaba',
    type: 'public',
    address: 'Av. Comendador Pereira Inácio, 900',
    phone: '(15) 3238-8000',
    beds: 300,
    availableBeds: 67,
    emergencyCapacity: 'high',
    status: 'operational',
    waitTime: 20,
    lastUpdate: '2024-01-15T10:33:00'
  }
];

export const systemConfigs: SystemConfig[] = [
  {
    key: 'max_response_time',
    label: 'Tempo Máximo de Resposta (min)',
    value: 2,
    type: 'number',
    description: 'Tempo máximo para resposta inicial ao chamado'
  },
  {
    key: 'max_arrival_time',
    label: 'Tempo Máximo de Chegada (min)',
    value: 8,
    type: 'number',
    description: 'Tempo máximo para a ambulância chegar ao local'
  },
  {
    key: 'traffic_light_timeout',
    label: 'Timeout Semáforo (ms)',
    value: 5000,
    type: 'number',
    description: 'Tempo máximo de espera por resposta do semáforo'
  },
  {
    key: 'auto_route_recalc',
    label: 'Recálculo Automático de Rota',
    value: true,
    type: 'boolean',
    description: 'Recalcular rota automaticamente em caso de congestionamento'
  },
  {
    key: 'priority_algorithm',
    label: 'Algoritmo de Prioridade',
    value: 'dijkstra_ml',
    type: 'select',
    options: ['dijkstra', 'astar', 'dijkstra_ml', 'astar_ml'],
    description: 'Algoritmo utilizado para cálculo de rotas'
  },
  {
    key: 'notification_email',
    label: 'Email para Notificações',
    value: 'admin@emergencia.gov.br',
    type: 'string',
    description: 'Email para receber alertas críticos do sistema'
  },
  {
    key: 'maintenance_mode',
    label: 'Modo Manutenção',
    value: false,
    type: 'boolean',
    description: 'Ativar modo de manutenção do sistema'
  }
];

// Funções utilitárias
export const getSLATypeLabel = (type: SLARecord['type']): string => {
  const labels = {
    response_time: 'Tempo de Resposta',
    arrival_time: 'Tempo de Chegada',
    total_time: 'Tempo Total'
  };
  return labels[type];
};

export const getComplaintTypeLabel = (type: Complaint['type']): string => {
  const labels = {
    delay: 'Atraso',
    service: 'Atendimento',
    equipment: 'Equipamento',
    other: 'Outros'
  };
  return labels[type];
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    open: 'Aberto',
    in_progress: 'Em Andamento',
    resolved: 'Resolvido',
    closed: 'Fechado',
    detected: 'Detectado',
    investigating: 'Investigando',
    fixing: 'Corrigindo',
    available: 'Disponível',
    en_route: 'Em Rota',
    at_scene: 'No Local',
    returning: 'Retornando',
    maintenance: 'Manutenção',
    operational: 'Operacional',
    degraded: 'Degradado',
    offline: 'Offline',
    limited: 'Limitado',
    active: 'Ativo',
    inactive: 'Inativo'
  };
  return labels[status] || status;
};

export const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    critical: 'Crítica'
  };
  return labels[priority] || priority;
};

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    operator: 'Operador',
    viewer: 'Visualizador'
  };
  return labels[role] || role;
};
