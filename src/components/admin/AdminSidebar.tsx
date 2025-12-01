import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  TrafficCone,
  Ambulance,
  ClipboardList,
  AlertTriangle,
  Settings,
  ArrowLeft,
  Activity,
  FileWarning
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import facensLogo from '@/assets/facens-logo.png';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Usuários', href: '/admin/usuarios', icon: Users },
  { title: 'Hospitais', href: '/admin/hospitais', icon: Building2 },
  { title: 'Semáforos', href: '/admin/semaforos', icon: TrafficCone },
  { title: 'Ambulâncias', href: '/admin/ambulancias', icon: Ambulance },
  { title: 'SLA', href: '/admin/sla', icon: Activity },
  { title: 'Reclamações', href: '/admin/reclamacoes', icon: ClipboardList },
  { title: 'Problemas', href: '/admin/problemas', icon: FileWarning },
  { title: 'Configurações', href: '/admin/configuracoes', icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Ambulance className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-bold text-sm">EmergênciaRoutes</span>
            <p className="text-xs text-muted-foreground">Painel Admin</p>
          </div>
        </div>
        <Link to="/plataforma">
          <Button variant="outline" size="sm" className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Plataforma
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Facens © 2024</span>
          <img src={facensLogo} alt="Facens" className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
