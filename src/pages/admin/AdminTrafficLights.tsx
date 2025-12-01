import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrafficCone, Search, RefreshCw, Wifi, WifiOff, AlertTriangle, Activity } from 'lucide-react';
import { trafficLightStatuses, TrafficLightStatus, getStatusLabel } from '@/data/adminData';
import { toast } from 'sonner';

const AdminTrafficLights = () => {
  const [lights, setLights] = useState<TrafficLightStatus[]>(trafficLightStatuses);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLights = lights.filter(light =>
    light.intersection.toLowerCase().includes(searchTerm.toLowerCase()) ||
    light.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: TrafficLightStatus['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
    }
  };

  const getStatusIcon = (status: TrafficLightStatus['status']) => {
    switch (status) {
      case 'operational': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const syncLight = (lightId: string) => {
    setLights(lights.map(light => 
      light.id === lightId 
        ? { ...light, lastSync: new Date().toISOString(), status: 'operational' as const }
        : light
    ));
    toast.success(`Semáforo ${lightId} sincronizado`);
  };

  const syncAll = () => {
    setLights(lights.map(light => ({
      ...light,
      lastSync: new Date().toISOString(),
      status: light.status === 'offline' ? 'degraded' as const : 'operational' as const
    })));
    toast.success('Todos os semáforos sincronizados');
  };

  return (
    <>
      <Helmet>
        <title>Semáforos | Admin EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrafficCone className="h-8 w-8" />
              Semáforos Inteligentes
            </h1>
            <p className="text-muted-foreground">
              Monitore e gerencie os semáforos conectados
            </p>
          </div>
          <Button onClick={syncAll}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar Todos
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Wifi className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {lights.filter(l => l.status === 'operational').length}
                </p>
                <p className="text-sm text-muted-foreground">Operacionais</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {lights.filter(l => l.status === 'degraded').length}
                </p>
                <p className="text-sm text-muted-foreground">Degradados</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <WifiOff className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {lights.filter(l => l.status === 'offline').length}
                </p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {lights.reduce((acc, l) => acc + l.activationsToday, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Ativações Hoje</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar semáforos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {filteredLights.length} semáforos
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cruzamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tempo Resposta</TableHead>
                <TableHead>Ativações Hoje</TableHead>
                <TableHead>Falhas Hoje</TableHead>
                <TableHead>Última Sincronização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLights.map((light) => (
                <TableRow key={light.id}>
                  <TableCell className="font-mono font-semibold">
                    {light.id.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(light.status)}
                      <span>{light.intersection}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(light.status)}>
                      {getStatusLabel(light.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={
                      light.responseTime === 0 ? 'text-muted-foreground' :
                      light.responseTime > 1000 ? 'text-red-500 font-semibold' :
                      light.responseTime > 100 ? 'text-yellow-500' :
                      'text-green-500'
                    }>
                      {light.responseTime === 0 ? '-' : `${light.responseTime}ms`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{light.activationsToday}</span>
                  </TableCell>
                  <TableCell>
                    <span className={light.failuresToday > 0 ? 'text-red-500 font-semibold' : ''}>
                      {light.failuresToday}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(light.lastSync).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => syncLight(light.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
};

export default AdminTrafficLights;
