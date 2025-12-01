import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Activity, TrendingUp, TrendingDown, Clock, Target, Edit, Save } from 'lucide-react';
import { slaRecords, SLARecord, getSLATypeLabel } from '@/data/adminData';
import { toast } from 'sonner';

const AdminSLA = () => {
  const [slas, setSlas] = useState<SLARecord[]>(slaRecords);
  const [editingSla, setEditingSla] = useState<SLARecord | null>(null);
  const [newTarget, setNewTarget] = useState('');

  const handleUpdateTarget = () => {
    if (!editingSla || !newTarget) return;
    
    setSlas(slas.map(sla => 
      sla.id === editingSla.id 
        ? { ...sla, target: Number(newTarget) }
        : sla
    ));
    setEditingSla(null);
    setNewTarget('');
    toast.success('Meta de SLA atualizada');
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-500';
    if (compliance >= 90) return 'text-yellow-500';
    if (compliance >= 80) return 'text-orange-500';
    return 'text-red-500';
  };

  const getComplianceBgColor = (compliance: number) => {
    if (compliance >= 95) return 'bg-green-500';
    if (compliance >= 90) return 'bg-yellow-500';
    if (compliance >= 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Helmet>
        <title>SLA | Admin EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-8 w-8" />
            Gerenciamento de SLA
          </h1>
          <p className="text-muted-foreground">
            Monitore e configure os indicadores de nível de serviço
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slas.map((sla) => (
            <Card key={sla.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{getSLATypeLabel(sla.type)}</p>
                  <p className="text-3xl font-bold">{sla.current} min</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getComplianceBgColor(sla.compliance)}/20`}>
                  {sla.compliance >= 90 ? (
                    <TrendingUp className={`h-8 w-8 ${getComplianceColor(sla.compliance)}`} />
                  ) : (
                    <TrendingDown className={`h-8 w-8 ${getComplianceColor(sla.compliance)}`} />
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conformidade</span>
                  <span className={`text-lg font-bold ${getComplianceColor(sla.compliance)}`}>
                    {sla.compliance}%
                  </span>
                </div>
                <Progress value={sla.compliance} className="h-3" />
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Meta: {sla.target} min</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingSla(sla);
                          setNewTarget(sla.target.toString());
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Meta de SLA</DialogTitle>
                        <DialogDescription>
                          Alterar a meta para {getSLATypeLabel(sla.type)}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nova Meta (minutos)</Label>
                          <Input
                            type="number"
                            value={newTarget}
                            onChange={(e) => setNewTarget(e.target.value)}
                            min="1"
                            max="60"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdateTarget}>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Período: {sla.period}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Historical Data */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Histórico de Conformidade</h3>
          <div className="space-y-4">
            {slas.map((sla) => (
              <div key={sla.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{getSLATypeLabel(sla.type)}</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      Atual: {sla.current} min
                    </Badge>
                    <Badge variant="outline">
                      Meta: {sla.target} min
                    </Badge>
                    <Badge className={getComplianceBgColor(sla.compliance)}>
                      {sla.compliance}%
                    </Badge>
                  </div>
                </div>
                <div className="h-8 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getComplianceBgColor(sla.compliance)} transition-all duration-500`}
                    style={{ width: `${sla.compliance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Thresholds */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Limites de Conformidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-medium text-green-500">Excelente</span>
              </div>
              <p className="text-sm text-muted-foreground">≥ 95% de conformidade</p>
            </div>
            
            <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="font-medium text-yellow-500">Bom</span>
              </div>
              <p className="text-sm text-muted-foreground">90% - 94% de conformidade</p>
            </div>
            
            <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="font-medium text-orange-500">Atenção</span>
              </div>
              <p className="text-sm text-muted-foreground">80% - 89% de conformidade</p>
            </div>
            
            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-medium text-red-500">Crítico</span>
              </div>
              <p className="text-sm text-muted-foreground">&lt; 80% de conformidade</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminSLA;
