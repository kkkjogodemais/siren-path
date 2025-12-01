import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ClipboardList, Search, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { complaints, Complaint, getComplaintTypeLabel, getStatusLabel, getPriorityLabel } from '@/data/adminData';
import { toast } from 'sonner';

const AdminComplaints = () => {
  const [complaintsList, setComplaintsList] = useState<Complaint[]>(complaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState('');
  const [newStatus, setNewStatus] = useState<Complaint['status']>('open');

  const filteredComplaints = complaintsList.filter(complaint =>
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateComplaint = () => {
    if (!selectedComplaint) return;
    
    setComplaintsList(complaintsList.map(c => 
      c.id === selectedComplaint.id 
        ? { ...c, status: newStatus, resolution: resolution || c.resolution }
        : c
    ));
    setSelectedComplaint(null);
    setResolution('');
    toast.success('Reclamação atualizada');
  };

  const getStatusBadgeClass = (status: Complaint['status']) => {
    switch (status) {
      case 'open': return 'bg-red-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
    }
  };

  const getPriorityBadgeClass = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 text-red-500';
      case 'high': return 'border-orange-500 text-orange-500';
      case 'medium': return 'border-yellow-500 text-yellow-500';
      case 'low': return 'border-green-500 text-green-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>Reclamações | Admin EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ClipboardList className="h-8 w-8" />
            Gerenciamento de Reclamações
          </h1>
          <p className="text-muted-foreground">
            Gerencie e resolva reclamações do sistema
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {complaintsList.filter(c => c.status === 'open').length}
                </p>
                <p className="text-sm text-muted-foreground">Abertas</p>
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
                  {complaintsList.filter(c => c.status === 'in_progress').length}
                </p>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
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
                  {complaintsList.filter(c => c.status === 'resolved').length}
                </p>
                <p className="text-sm text-muted-foreground">Resolvidas</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {complaintsList.filter(c => c.status === 'closed').length}
                </p>
                <p className="text-sm text-muted-foreground">Fechadas</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar reclamações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {filteredComplaints.length} reclamações
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-mono">
                    {complaint.id.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(complaint.date).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getComplaintTypeLabel(complaint.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {complaint.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityBadgeClass(complaint.priority)}>
                      {getPriorityLabel(complaint.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(complaint.status)}>
                      {getStatusLabel(complaint.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {complaint.assignedTo || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setNewStatus(complaint.status);
                        setResolution(complaint.resolution || '');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes da Reclamação</DialogTitle>
              <DialogDescription>
                {selectedComplaint?.id.toUpperCase()}
              </DialogDescription>
            </DialogHeader>
            
            {selectedComplaint && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Tipo</Label>
                    <p className="font-medium">{getComplaintTypeLabel(selectedComplaint.type)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Prioridade</Label>
                    <Badge variant="outline" className={getPriorityBadgeClass(selectedComplaint.priority)}>
                      {getPriorityLabel(selectedComplaint.priority)}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="text-sm">{selectedComplaint.description}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newStatus} onValueChange={(v: Complaint['status']) => setNewStatus(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="resolved">Resolvido</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Resolução</Label>
                  <Textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Descreva a resolução..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateComplaint}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminComplaints;
