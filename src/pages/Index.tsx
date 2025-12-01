import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import LiveDemoSimulation from "@/components/LiveDemoSimulation";
import Features from "@/components/Features";
import TechStack from "@/components/TechStack";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, FileText, Mail, Ambulance } from "lucide-react";
import facensLogo from "@/assets/facens-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <LiveDemoSimulation />
      <Features />
      <TechStack />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para Transformar Operações de Emergência?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Acesse a plataforma completa de roteamento ou entre em contato para agendar uma demonstração.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/plataforma">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Ambulance className="h-5 w-5" />
                  Acessar Plataforma
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Mail className="h-5 w-5" />
                Contato Comercial
              </Button>
              <Link to="/documentacao">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <FileText className="h-5 w-5" />
                  Documentação
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-5 w-5" />
                GitHub
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Facens Logo */}
            <div className="flex justify-center mb-8 pb-8 border-b">
              <img 
                src={facensLogo} 
                alt="Facens - Faculdade de Engenharia de Sorocaba" 
                className="h-16 object-contain"
              />
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Plataforma</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/plataforma" className="hover:text-foreground transition-colors">
                      Simulador
                    </Link>
                  </li>
                  <li>Recursos</li>
                  <li>Casos de Uso</li>
                  <li>Integrações</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Desenvolvedores</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Documentação</li>
                  <li>API Reference</li>
                  <li>SDKs</li>
                  <li>Status</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Empresa</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Sobre</li>
                  <li>Blog</li>
                  <li>Carreiras</li>
                  <li>Contato</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Privacidade</li>
                  <li>Termos</li>
                  <li>Segurança</li>
                  <li>LGPD</li>
                </ul>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              <p className="mb-2">© 2025 Plataforma de Roteamento Inteligente. Salvando vidas com tecnologia.</p>
              <p className="text-xs">Projeto Acadêmico - Facens - Faculdade de Engenharia de Sorocaba</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
