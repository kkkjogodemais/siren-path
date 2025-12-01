import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { systemConfigs, SystemConfig } from '@/data/adminData';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>(systemConfigs);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (key: string, value: string | number | boolean) => {
    setConfigs(configs.map(c => 
      c.key === key ? { ...c, value } : c
    ));
    setHasChanges(true);
  };

  const saveChanges = () => {
    toast.success('Configurações salvas com sucesso');
    setHasChanges(false);
  };

  const resetChanges = () => {
    setConfigs(systemConfigs);
    setHasChanges(false);
    toast.info('Configurações restauradas');
  };

  const maintenanceMode = configs.find(c => c.key === 'maintenance_mode')?.value as boolean;

  return (
    <>
      <Helmet>
        <title>Configurações | Admin EmergênciaRoutes</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="h-8 w-8" />
              Configurações do Sistema
            </h1>
            <p className="text-muted-foreground">
              Gerencie as configurações gerais do sistema
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                Alterações não salvas
              </Badge>
            )}
            <Button variant="outline" onClick={resetChanges} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button onClick={saveChanges} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Maintenance Mode Warning */}
        {maintenanceMode && (
          <Card className="p-4 border-yellow-500 bg-yellow-500/10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-semibold text-yellow-500">Modo Manutenção Ativo</p>
                <p className="text-sm text-muted-foreground">
                  O sistema está em modo de manutenção. Algumas funcionalidades podem estar indisponíveis.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SLA Settings */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Configurações de SLA</h3>
            <div className="space-y-4">
              {configs.filter(c => c.key.includes('time')).map((config) => (
                <div key={config.key} className="space-y-2">
                  <Label htmlFor={config.key}>{config.label}</Label>
                  <Input
                    id={config.key}
                    type="number"
                    value={config.value as number}
                    onChange={(e) => updateConfig(config.key, Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* System Settings */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Configurações do Sistema</h3>
            <div className="space-y-4">
              {configs.filter(c => c.type === 'boolean').map((config) => (
                <div key={config.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={config.key}>{config.label}</Label>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                  <Switch
                    id={config.key}
                    checked={config.value as boolean}
                    onCheckedChange={(checked) => updateConfig(config.key, checked)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Algorithm Settings */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Configurações de Algoritmo</h3>
            <div className="space-y-4">
              {configs.filter(c => c.type === 'select').map((config) => (
                <div key={config.key} className="space-y-2">
                  <Label htmlFor={config.key}>{config.label}</Label>
                  <Select
                    value={config.value as string}
                    onValueChange={(value) => updateConfig(config.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.toUpperCase().replace('_', ' + ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Configurações de Notificação</h3>
            <div className="space-y-4">
              {configs.filter(c => c.key.includes('email') || c.key.includes('notification')).map((config) => (
                <div key={config.key} className="space-y-2">
                  <Label htmlFor={config.key}>{config.label}</Label>
                  <Input
                    id={config.key}
                    type={config.key.includes('email') ? 'email' : 'text'}
                    value={config.value as string}
                    onChange={(e) => updateConfig(config.key, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Info */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Informações do Sistema</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Versão</p>
              <p className="font-semibold">v1.0.0</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Ambiente</p>
              <p className="font-semibold">Produção</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Última Atualização</p>
              <p className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="bg-green-500">Operacional</Badge>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminSettings;
