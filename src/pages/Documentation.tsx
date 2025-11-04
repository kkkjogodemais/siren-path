import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Heart, TrendingUp, Code, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  const developers = [
    { name: "Amanda Gabrielly Lemes de Carvalho", ra: "247921" },
    { name: "João Vitor de Oliveira Mendes", ra: "247904" },
    { name: "Guilherme Vincolletti Cosimato", ra: "248451" },
    { name: "Matheus Leonardo Guia", ra: "248543" },
    { name: "Adriano Donizete de Souza", ra: "248350" },
    { name: "Guilherme Corrêa de Sojo", ra: "235652" },
  ];

  const technologies = [
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Vite"] },
    { category: "Mapeamento", items: ["Leaflet", "OpenStreetMap"] },
    { category: "Backend (Proposto)", items: ["Python", "FastAPI"] },
    { category: "Machine Learning", items: ["scikit-learn", "Random Forest", "TensorFlow"] },
    { category: "Banco de Dados", items: ["PostgreSQL", "PostGIS", "Redis"] },
    { category: "Infraestrutura", items: ["Docker", "Kubernetes", "Kafka"] },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Documentação Técnica
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              Plataforma de Roteamento Inteligente para Emergências
            </h1>
            <p className="text-xl text-white/90">
              Salvando vidas através da tecnologia e inovação
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Ideal */}
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Ideal do Projeto</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Criar uma plataforma inteligente que revolucione o atendimento de emergências médicas
                    através da previsão de congestionamentos e otimização de rotas em tempo real. Nosso ideal
                    é reduzir drasticamente o tempo de resposta de ambulâncias, aumentando as chances de
                    salvamento de vidas em situações críticas.
                  </p>
                </div>
              </div>
            </Card>

            {/* Missão */}
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Missão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Fornecer aos serviços de emergência uma ferramenta tecnológica que integra Machine Learning,
                    dados em tempo real e algoritmos de roteamento avançados para calcular as rotas mais rápidas
                    e eficientes. Nossa missão é transformar dados complexos em decisões que salvam vidas,
                    garantindo que cada segundo conte no atendimento de emergências.
                  </p>
                </div>
              </div>
            </Card>

            {/* Valor e Diferenciais */}
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Valor Agregado e Diferenciais</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Valor para a Sociedade:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Redução de até 40% no tempo de chegada de ambulâncias</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Aumento significativo na taxa de sobrevivência em emergências</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Otimização de recursos públicos de saúde e trânsito</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Diferenciais Tecnológicos:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>Previsão de congestionamento com 95%+ de precisão usando Random Forest</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>Algoritmo Dijkstra otimizado com pesos dinâmicos em tempo real</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>Integração nativa com órgãos públicos via APIs REST e webhooks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>Processamento de telemetria em tempo real com latência inferior a 100ms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>100% baseado em tecnologias open source e gratuitas</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stack Tecnológica */}
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Code className="h-8 w-8 text-warning" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-6">Linguagens e Tecnologias</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {technologies.map((tech, index) => (
                      <div key={index}>
                        <h3 className="font-semibold mb-3 text-primary">{tech.category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {tech.items.map((item, itemIndex) => (
                            <Badge key={itemIndex} variant="secondary">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Linguagens Principais:</strong> TypeScript, Python, SQL
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Equipe de Desenvolvimento */}
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-6">Equipe de Desenvolvimento</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {developers.map((dev, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:border-primary/50 transition-smooth"
                      >
                        <h3 className="font-semibold mb-1">{dev.name}</h3>
                        <p className="text-sm text-muted-foreground">RA: {dev.ra}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Projeto desenvolvido com dedicação e comprometimento com a inovação em serviços de emergência
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="text-center py-8">
              <Link to="/">
                <Button size="lg" className="gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  Voltar para a Plataforma
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
