import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, Zap, Network, Shield, BarChart3 } from "lucide-react";

const TechStack = () => {
  const technologies = [
    {
      icon: Brain,
      title: "Machine Learning",
      description: "Random Forest com scikit-learn para previsão de congestionamento",
      tags: ["Python", "scikit-learn", "MLFlow"],
      color: "text-purple-500"
    },
    {
      icon: Network,
      title: "Roteamento Inteligente",
      description: "Algoritmos de grafo (Dijkstra/A*) com networkx para cálculo otimizado",
      tags: ["NetworkX", "OSMnx", "PostGIS"],
      color: "text-secondary"
    },
    {
      icon: Database,
      title: "Armazenamento",
      description: "PostgreSQL com PostGIS para dados geoespaciais e Redis para cache",
      tags: ["PostgreSQL", "PostGIS", "Redis"],
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Processamento Real-time",
      description: "Ingestão e processamento de telemetria via streaming",
      tags: ["Kafka", "FastAPI", "WebSocket"],
      color: "text-warning"
    },
    {
      icon: Shield,
      title: "APIs & Integrações",
      description: "RESTful APIs e webhooks para órgãos públicos e sistemas de emergência",
      tags: ["FastAPI", "OAuth2", "OpenAPI"],
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "Observabilidade",
      description: "Monitoramento completo com métricas, logs e alertas",
      tags: ["Prometheus", "Grafana", "Sentry"],
      color: "text-destructive"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Arquitetura</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Stack Tecnológico de Produção
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Infraestrutura escalável e robusta para operação 24/7 em ambientes críticos
            </p>
          </div>

          {/* Tech grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-smooth border-2 hover:border-primary/20">
                  <Icon className={`h-10 w-10 mb-4 ${tech.color}`} />
                  <h3 className="font-semibold text-lg mb-2">{tech.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tech.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Architecture diagram */}
          <Card className="p-8 bg-muted/30">
            <h3 className="font-semibold text-xl mb-6 text-center">Fluxo de Dados</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg min-w-[140px]">
                <Database className="h-8 w-8 text-secondary mb-2" />
                <div className="font-semibold">Fontes de Dados</div>
                <div className="text-xs text-muted-foreground mt-1">Telemetria, APIs, Sensores</div>
              </div>
              
              <div className="hidden md:block text-2xl text-muted-foreground">→</div>
              
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg min-w-[140px]">
                <Zap className="h-8 w-8 text-warning mb-2" />
                <div className="font-semibold">Processamento</div>
                <div className="text-xs text-muted-foreground mt-1">Stream & Batch</div>
              </div>
              
              <div className="hidden md:block text-2xl text-muted-foreground">→</div>
              
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg min-w-[140px]">
                <Brain className="h-8 w-8 text-purple-500 mb-2" />
                <div className="font-semibold">ML Inference</div>
                <div className="text-xs text-muted-foreground mt-1">Previsão RF</div>
              </div>
              
              <div className="hidden md:block text-2xl text-muted-foreground">→</div>
              
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg min-w-[140px]">
                <Network className="h-8 w-8 text-accent mb-2" />
                <div className="font-semibold">Roteamento</div>
                <div className="text-xs text-muted-foreground mt-1">Dijkstra/A*</div>
              </div>
              
              <div className="hidden md:block text-2xl text-muted-foreground">→</div>
              
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg min-w-[140px]">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <div className="font-semibold">API/WebSocket</div>
                <div className="text-xs text-muted-foreground mt-1">Entrega em tempo real</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
