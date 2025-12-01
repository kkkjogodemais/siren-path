import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  CloudRain, 
  CloudFog, 
  Sun, 
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Gauge,
  Clock,
  Zap
} from 'lucide-react';
import { 
  TrafficData, 
  getCongestionColor,
  formatWeatherCondition 
} from '@/services/trafficSimulationService';

interface TrafficPanelProps {
  trafficData: TrafficData;
  isLoading: boolean;
  lastUpdate: Date;
  onRefresh: () => void;
  onSimulateSpike?: () => void;
}

const TrafficPanel = ({ 
  trafficData, 
  isLoading, 
  lastUpdate, 
  onRefresh,
  onSimulateSpike 
}: TrafficPanelProps) => {
  
  const getWeatherIcon = () => {
    switch (trafficData.weatherCondition) {
      case 'clear': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'rain': return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'heavy_rain': return <CloudRain className="h-5 w-5 text-blue-600" />;
      case 'fog': return <CloudFog className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCongestionBadgeClass = () => {
    switch (trafficData.congestionLevel) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getCongestionLabel = () => {
    switch (trafficData.congestionLevel) {
      case 'low': return 'Trânsito Livre';
      case 'medium': return 'Moderado';
      case 'high': return 'Congestionado';
      case 'critical': return 'Crítico';
    }
  };

  const getDayTypeLabel = () => {
    switch (trafficData.dayType) {
      case 'weekday': return 'Dia Útil';
      case 'weekend': return 'Fim de Semana';
      case 'holiday': return 'Feriado';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Dados de Tráfego
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {getDayTypeLabel()}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Indicador de Congestionamento Principal */}
      <div className="mb-4 p-3 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Congestionamento Geral</span>
          <Badge className={getCongestionBadgeClass()}>
            {getCongestionLabel()}
          </Badge>
        </div>
        <Progress 
          value={trafficData.overallCongestion} 
          className="h-3"
          style={{
            ['--progress-color' as string]: getCongestionColor(trafficData.congestionLevel)
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0%</span>
          <span className="text-sm font-semibold">{trafficData.overallCongestion}%</span>
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Velocidade Média</span>
          </div>
          <p className="text-lg font-semibold">{trafficData.averageSpeed} km/h</p>
        </div>
        
        <div className="p-2 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            {getWeatherIcon()}
            <span className="text-xs text-muted-foreground">Clima</span>
          </div>
          <p className="text-sm font-medium">
            {formatWeatherCondition(trafficData.weatherCondition).split(' ')[0]}
          </p>
        </div>
      </div>

      {/* Status do Horário */}
      {trafficData.isRushHour && (
        <div className="mb-4 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-orange-400 font-medium">
              Horário de Pico Ativo
            </span>
          </div>
        </div>
      )}

      {/* Incidentes */}
      {trafficData.incidents.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Incidentes Ativos ({trafficData.incidents.length})
          </h4>
          <div className="space-y-2">
            {trafficData.incidents.map((incident, idx) => (
              <div 
                key={idx}
                className="p-2 rounded bg-muted/30 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span>{incident.description}</span>
                  <Badge variant="outline" className="text-xs">
                    +{incident.delay} min
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Segmentos de Ruas */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Principais Vias</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {trafficData.segments.slice(0, 5).map(segment => (
            <div 
              key={segment.id}
              className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/20"
            >
              <span className="truncate flex-1">{segment.name}</span>
              <div 
                className="w-16 h-2 rounded-full overflow-hidden bg-muted"
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${segment.congestionFactor * 100}%`,
                    backgroundColor: getCongestionColor(
                      segment.congestionFactor < 0.25 ? 'low' :
                      segment.congestionFactor < 0.5 ? 'medium' :
                      segment.congestionFactor < 0.75 ? 'high' : 'critical'
                    )
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de Simulação de Pico */}
      {onSimulateSpike && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSimulateSpike}
          className="w-full"
        >
          <Zap className="h-4 w-4 mr-2" />
          Simular Pico de Tráfego
        </Button>
      )}

      {/* Última Atualização */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
      </p>
    </Card>
  );
};

export default TrafficPanel;
