import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ambulance, MapPin, Clock, Radio, Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import AmbulanceSimulator from '@/components/routing/AmbulanceSimulator';
import facensLogo from '@/assets/facens-logo.png';

const Plataforma = () => {
  return (
    <>
      <Helmet>
        <title>Plataforma de Roteamento | EmergênciaRoutes Sorocaba</title>
        <meta 
          name="description" 
          content="Plataforma de roteamento em tempo real para ambulâncias em Sorocaba. Sistema inteligente com semáforos conectados e cálculo otimizado de rotas."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ambulance className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg">EmergênciaRoutes</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="hidden sm:flex">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Sistema Online
                </Badge>
                <img src={facensLogo} alt="Facens" className="h-8" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <Badge className="mb-4">Simulador em Tempo Real</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Plataforma de Roteamento Inteligente
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Simulador completo de rotas para ambulâncias em Sorocaba/SP. 
              Visualize hospitais, semáforos inteligentes e acompanhe métricas em tempo real.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Hospitais</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Radio className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Semáforos</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">-30%</p>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Simulator */}
          <AmbulanceSimulator />

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Activity className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Algoritmo Dijkstra + ML</h3>
              <p className="text-sm text-muted-foreground">
                Combinação de algoritmo clássico de caminho mínimo com previsões de 
                Machine Learning para otimização em tempo real.
              </p>
            </Card>
            
            <Card className="p-6">
              <Radio className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="font-semibold mb-2">Semáforos Inteligentes</h3>
              <p className="text-sm text-muted-foreground">
                Integração com a rede de semáforos da cidade para abertura automática 
                de corredores de emergência.
              </p>
            </Card>
            
            <Card className="p-6">
              <MapPin className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="font-semibold mb-2">Mapa OpenStreetMap</h3>
              <p className="text-sm text-muted-foreground">
                Utilização de dados abertos e gratuitos do OpenStreetMap para 
                visualização detalhada das ruas de Sorocaba.
              </p>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2024 EmergênciaRoutes - Projeto acadêmico Facens</p>
            <p className="mt-1">Sistema de demonstração - Dados simulados</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Plataforma;
