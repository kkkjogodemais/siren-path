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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileWarning, Search, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { systemProblems, SystemProblem, getStatusLabel } from '@/data/adminData';
import { toast } from 'sonner';

const AdminProblems = () => {
  const [problems, setProblems] = useState<SystemProblem[]>(systemProblems);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProblems = problems.filter(problem =>
    problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.system.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateProblemStatus = (problemId: string, newStatus: SystemProblem['status']) => {
    setProblems(problems.map(p => 
      p.id === problemId 
        ? { 
            ...p, 
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : p.resolvedAt
          }
        : p
    ));
    toast.success('Status do problema atualizado');
  };

  const getStatusBadgeClass = (status: SystemProblem['status']) => {
    switch (status) {
      case 'detected': return 'bg-red-500';
      case 'investigating': return 'bg-orange-500';
      case 'fixing': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
    }
  };

  const getImpactBadgeClass = (impact: SystemProblem['impact']) => {
    switch (impact) {
      case 'none': return 'border-gray-500 text-gray-500';
      case 'low': return 'border-green-500 text-green-500';
      case 'medium': return 'border-yellow-500 text-yellow-500';
      case 'high': return 'border-orange-500 text-orange-500';
      case 'critical': return 'border-red-500 text-red-500';
    }
  };

  const getSystemLabel = (system: SystemProblem['system']) => {
    const labels = {
      routing: 'Roteamento',
      traffic_lights: 'Semáforos',
      communication: 'Comunicação',
      database: 'Banco de Dados',
      api: 'API'
    };
    return labels[system];
  };

  const getImpactLabel = (impact: SystemProblem['impact']) => {
    const labels = {
      none: 'Nenhum',
      low: 'Baixo',
      medium: 'Médio',
      high: 'Alto',
      critical: 'Crítico'
    };
    return labels[impact];
  };

  return (
    <>
      <Helmet>
        <title>Problemas | Admin EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileWarning className="h-8 w-8" />
            Problemas do Sistema
          </h1>
          <p className="text-muted-foreground">
            Monitore e resolva problemas técnicos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {problems.filter(p => p.status === 'detected').length}
                </p>
                <p className="text-sm text-muted-foreground">Detectados</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {problems.filter(p => p.status === 'investigating').length}
                </p>
                <p className="text-sm text-muted-foreground">Investigando</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {problems.filter(p => p.status === 'fixing').length}
                </p>
                <p className="text-sm text-muted-foreground">Corrigindo</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {problems.filter(p => p.status === 'resolved').length}
                </p>
                <p className="text-sm text-muted-foreground">Resolvidos</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar problemas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {filteredProblems.length} problemas
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Sistema</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resolvido em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-mono">
                    {problem.id.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(problem.date).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getSystemLabel(problem.system)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {problem.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getImpactBadgeClass(problem.impact)}>
                      {getImpactLabel(problem.impact)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(problem.status)}>
                      {getStatusLabel(problem.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {problem.resolvedAt 
                      ? new Date(problem.resolvedAt).toLocaleString('pt-BR')
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Select 
                      value={problem.status}
                      onValueChange={(v: SystemProblem['status']) => updateProblemStatus(problem.id, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detected">Detectado</SelectItem>
                        <SelectItem value="investigating">Investigando</SelectItem>
                        <SelectItem value="fixing">Corrigindo</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                      </SelectContent>
                    </Select>
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

export default AdminProblems;
