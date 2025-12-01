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
import { Building2, Search, Phone, MapPin, Clock, Bed } from 'lucide-react';
import { hospitalInfos, HospitalInfo, getStatusLabel } from '@/data/adminData';

const AdminHospitals = () => {
  const [hospitals] = useState<HospitalInfo[]>(hospitalInfos);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: HospitalInfo['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'limited': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
    }
  };

  const getTypeLabel = (type: HospitalInfo['type']) => {
    switch (type) {
      case 'public': return 'Público';
      case 'private': return 'Privado';
      case 'upa': return 'UPA';
    }
  };

  const getCapacityColor = (hospital: HospitalInfo) => {
    const occupancy = ((hospital.beds - hospital.availableBeds) / hospital.beds) * 100;
    if (occupancy >= 90) return 'text-red-500';
    if (occupancy >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <>
      <Helmet>
        <title>Hospitais | Admin EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            Gerenciamento de Hospitais
          </h1>
          <p className="text-muted-foreground">
            Monitore e gerencie as unidades de saúde
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {hospitals.filter(h => h.status === 'operational').length}
                </p>
                <p className="text-sm text-muted-foreground">Operacionais</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {hospitals.filter(h => h.status === 'limited').length}
                </p>
                <p className="text-sm text-muted-foreground">Limitados</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bed className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {hospitals.reduce((acc, h) => acc + h.availableBeds, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Leitos Disponíveis</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(hospitals.reduce((acc, h) => acc + h.waitTime, 0) / hospitals.length)}
                </p>
                <p className="text-sm text-muted-foreground">Tempo Médio Espera (min)</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar hospitais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {filteredHospitals.length} unidades
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ocupação</TableHead>
                <TableHead>Tempo Espera</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Última Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHospitals.map((hospital) => (
                <TableRow key={hospital.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{hospital.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {hospital.address}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(hospital.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(hospital.status)}>
                      {getStatusLabel(hospital.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={getCapacityColor(hospital)}>
                          {hospital.beds - hospital.availableBeds}/{hospital.beds}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(((hospital.beds - hospital.availableBeds) / hospital.beds) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={((hospital.beds - hospital.availableBeds) / hospital.beds) * 100} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={hospital.waitTime > 40 ? 'text-red-500' : hospital.waitTime > 25 ? 'text-yellow-500' : ''}>
                        {hospital.waitTime} min
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {hospital.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(hospital.lastUpdate).toLocaleTimeString('pt-BR')}
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

export default AdminHospitals;
