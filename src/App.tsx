import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Documentation from "./pages/Documentation";
import Plataforma from "./pages/Plataforma";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminHospitals from "./pages/admin/AdminHospitals";
import AdminTrafficLights from "./pages/admin/AdminTrafficLights";
import AdminAmbulances from "./pages/admin/AdminAmbulances";
import AdminSLA from "./pages/admin/AdminSLA";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminProblems from "./pages/admin/AdminProblems";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/documentacao" element={<Documentation />} />
            <Route path="/plataforma" element={<Plataforma />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="hospitais" element={<AdminHospitals />} />
              <Route path="semaforos" element={<AdminTrafficLights />} />
              <Route path="ambulancias" element={<AdminAmbulances />} />
              <Route path="sla" element={<AdminSLA />} />
              <Route path="reclamacoes" element={<AdminComplaints />} />
              <Route path="problemas" element={<AdminProblems />} />
              <Route path="configuracoes" element={<AdminSettings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
