import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Building2,
  TrafficCone,
  Ambulance,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import {
  adminUsers,
  ambulanceStatuses,
  trafficLightStatuses,
  hospitalInfos,
  complaints,
  systemProblems,
  slaRecords,
  getStatusLabel
} from '@/data/adminData';

const AdminDashboard = () => {
  // Estatísticas calculadas
  const activeUsers = adminUsers.filter(u => u.status === 'active').length;
  const availableAmbulances = ambulanceStatuses.filter(a => a.status === 'available').length;
  const operationalLights = trafficLightStatuses.filter(t => t.status === 'operational').length;
  const operationalHospitals = hospitalInfos.filter(h => h.status === 'operational').length;
  const openComplaints = complaints.filter(c => c.status === 'open' || c.status === 'in_progress').length;
  const activeProblems = systemProblems.filter(p => p.status !== 'resolved').length;

  const avgSlaCompliance = slaRecords.reduce((acc, s) => acc + s.compliance, 0) / slaRecords.length;

  return (
    <>
      <Helmet>
        <title>Dashboard Admin | EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema EmergênciaRoutes
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ambulâncias Disponíveis</p>
                <p className="text-3xl font-bold">{availableAmbulances}/{ambulanceStatuses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Ambulance className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <Progress value={(availableAmbulances / ambulanceStatuses.length) * 100} className="mt-3 h-2" />
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Semáforos Online</p>
                <p className="text-3xl font-bold">{operationalLights}/{trafficLightStatuses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrafficCone className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <Progress value={(operationalLights / trafficLightStatuses.length) * 100} className="mt-3 h-2" />
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hospitais Operacionais</p>
                <p className="text-3xl font-bold">{operationalHospitals}/{hospitalInfos.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <Progress value={(operationalHospitals / hospitalInfos.length) * 100} className="mt-3 h-2" />
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conformidade SLA</p>
                <p className="text-3xl font-bold">{avgSlaCompliance.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <Progress value={avgSlaCompliance} className="mt-3 h-2" />
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Problemas Ativos</h3>
              <Badge variant="destructive" className="ml-auto">{activeProblems}</Badge>
            </div>
            <div className="space-y-2">
              {systemProblems.filter(p => p.status !== 'resolved').slice(0, 3).map(problem => (
                <div key={problem.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-sm truncate flex-1">{problem.description}</span>
                  <Badge variant="outline" className="text-xs ml-2">
                    {getStatusLabel(problem.status)}
                  </Badge>
                </div>
              ))}
              {activeProblems === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum problema ativo
                </p>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Reclamações Pendentes</h3>
              <Badge variant="secondary" className="ml-auto">{openComplaints}</Badge>
            </div>
            <div className="space-y-2">
              {complaints.filter(c => c.status === 'open' || c.status === 'in_progress').slice(0, 3).map(complaint => (
                <div key={complaint.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-sm truncate flex-1">{complaint.description}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ml-2 ${
                      complaint.priority === 'critical' ? 'border-red-500 text-red-500' :
                      complaint.priority === 'high' ? 'border-orange-500 text-orange-500' :
                      ''
                    }`}
                  >
                    {complaint.priority}
                  </Badge>
                </div>
              ))}
              {openComplaints === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma reclamação pendente
                </p>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Usuários Ativos</h3>
              <Badge variant="outline" className="ml-auto">{activeUsers}</Badge>
            </div>
            <div className="space-y-2">
              {adminUsers.filter(u => u.status === 'active').slice(0, 3).map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* SLA Overview */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Indicadores de SLA - Janeiro 2024
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {slaRecords.map(sla => (
              <div key={sla.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {sla.type === 'response_time' ? 'Tempo de Resposta' :
                     sla.type === 'arrival_time' ? 'Tempo de Chegada' : 'Tempo Total'}
                  </span>
                  <div className="flex items-center gap-1">
                    {sla.compliance >= 90 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${
                      sla.compliance >= 90 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {sla.compliance}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={sla.compliance} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Atual: {sla.current} min</span>
                  <span>Meta: {sla.target} min</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Ambulance Status Grid */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Ambulance className="h-5 w-5 text-primary" />
            Status das Ambulâncias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ambulanceStatuses.map(amb => (
              <div 
                key={amb.id} 
                className={`p-4 rounded-lg border ${
                  amb.status === 'available' ? 'border-green-500/30 bg-green-500/5' :
                  amb.status === 'en_route' ? 'border-blue-500/30 bg-blue-500/5' :
                  amb.status === 'at_scene' ? 'border-yellow-500/30 bg-yellow-500/5' :
                  amb.status === 'returning' ? 'border-purple-500/30 bg-purple-500/5' :
                  'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{amb.plate}</span>
                  <Badge variant="outline" className="text-xs">
                    {amb.type.toUpperCase()}
                  </Badge>
                </div>
                <Badge className={`w-full justify-center ${
                  amb.status === 'available' ? 'bg-green-500' :
                  amb.status === 'en_route' ? 'bg-blue-500' :
                  amb.status === 'at_scene' ? 'bg-yellow-500' :
                  amb.status === 'returning' ? 'bg-purple-500' :
                  'bg-red-500'
                }`}>
                  {getStatusLabel(amb.status)}
                </Badge>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>Motorista: {amb.driver}</p>
                  <p>Combustível: {amb.fuelLevel}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
