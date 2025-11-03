import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Previsão de Congestionamento",
      description: "Modelo Random Forest treinado com dados históricos de tráfego, clima e eventos urbanos. Previsão por trecho com intervalo de 15 minutos.",
      benefits: ["95%+ de acurácia", "Atualização contínua", "Múltiplas features (hora, clima, feriados)"]
    },
    {
      title: "Roteamento Dinâmico",
      description: "Grafo da cidade com pesos ajustados em tempo real baseados nas previsões. Algoritmo Dijkstra otimizado para resposta em < 1s.",
      benefits: ["Sub-segundo de latência", "Suporte a restrições de vias", "Priorização de semáforos inteligentes"]
    },
    {
      title: "Integração Multi-órgão",
      description: "APIs REST e webhooks para centrais de emergência, órgãos de trânsito e sistemas hospitalares. Suporte a padrões GeoJSON e GTFS.",
      benefits: ["OAuth2 seguro", "Webhooks bidirecionais", "Compatibilidade com sistemas legados"]
    },
    {
      title: "Telemetria em Tempo Real",
      description: "WebSocket para posicionamento de ambulâncias e atualização de rotas. Stream de eventos via Kafka para processamento distribuído.",
      benefits: ["Latência < 100ms", "Escalabilidade horizontal", "Tolerância a falhas"]
    },
    {
      title: "Painel Operacional",
      description: "Interface web responsiva com mapa interativo, métricas em tempo real e histórico de rotas. Alertas automáticos para eventos críticos.",
      benefits: ["Visualização geoespacial", "Dashboards customizáveis", "Exportação de relatórios"]
    },
    {
      title: "Observabilidade Completa",
      description: "Monitoramento de métricas de performance, logs estruturados e rastreamento distribuído. Alertas proativos para anomalias.",
      benefits: ["SLA tracking", "Análise de causa raiz", "Dashboards Grafana"]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Recursos da Plataforma
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades completas para operação de emergência de próxima geração
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-smooth">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
