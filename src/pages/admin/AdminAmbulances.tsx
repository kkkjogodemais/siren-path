import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ambulance, Search, Fuel, Wrench, MapPin, User } from 'lucide-react';
import { ambulanceStatuses, AmbulanceStatus, getStatusLabel } from '@/data/adminData';

const AdminAmbulances = () => {
  const [ambulances] = useState<AmbulanceStatus[]>(ambulanceStatuses);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAmbulances = ambulances.filter(amb =>
    amb.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amb.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: AmbulanceStatus['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'en_route': return 'bg-blue-500';
      case 'at_scene': return 'bg-yellow-500';
      case 'returning': return 'bg-purple-500';
      case 'maintenance': return 'bg-red-500';
    }
  };

  const getTypeLabel = (type: AmbulanceStatus['type']) => {
    switch (type) {
      case 'basic': return 'Básica';
      case 'advanced': return 'Avançada';
      case 'uti': return 'UTI Móvel';
    }
  };

  const getFuelColor = (level: number) => {
    if (level >= 70) return 'text-green-500';
    if (level >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <Helmet>
        <title>Ambulâncias | Admin EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Ambulance className="h-8 w-8" />
            Frota de Ambulâncias
          </h1>
          <p className="text-muted-foreground">
            Monitore e gerencie a frota de ambulâncias
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {ambulances.filter(a => a.status === 'available').length}
                </p>
                <p className="text-sm text-muted-foreground">Disponíveis</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {ambulances.filter(a => a.status === 'en_route').length}
                </p>
                <p className="text-sm text-muted-foreground">Em Rota</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {ambulances.filter(a => a.status === 'at_scene').length}
                </p>
                <p className="text-sm text-muted-foreground">No Local</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {ambulances.filter(a => a.status === 'returning').length}
                </p>
                <p className="text-sm text-muted-foreground">Retornando</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {ambulances.filter(a => a.status === 'maintenance').length}
                </p>
                <p className="text-sm text-muted-foreground">Manutenção</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ambulâncias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {filteredAmbulances.length} veículos
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Combustível</TableHead>
                <TableHead>Próxima Manutenção</TableHead>
                <TableHead>Última Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAmbulances.map((amb) => (
                <TableRow key={amb.id}>
                  <TableCell className="font-mono font-bold">
                    {amb.plate}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(amb.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(amb.status)}>
                      {getStatusLabel(amb.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {amb.driver}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 w-24">
                      <div className="flex items-center justify-between">
                        <Fuel className={`h-4 w-4 ${getFuelColor(amb.fuelLevel)}`} />
                        <span className={`text-sm font-semibold ${getFuelColor(amb.fuelLevel)}`}>
                          {amb.fuelLevel}%
                        </span>
                      </div>
                      <Progress value={amb.fuelLevel} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={
                      new Date(amb.nextMaintenance) <= new Date() ? 'text-red-500 font-semibold' :
                      new Date(amb.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'text-yellow-500' :
                      ''
                    }>
                      {new Date(amb.nextMaintenance).toLocaleDateString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(amb.lastUpdate).toLocaleString('pt-BR')}
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

export default AdminAmbulances;
