import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { EmployeeProvider } from "./contexts/EmployeeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import ReceiptGenerator from "./pages/ReceiptGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Carregando...</p>
          <p className="text-sm text-muted-foreground">Aguarde um momento, por favor.</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/employee/:id" element={session ? <EmployeeProfile /> : <Navigate to="/" />} />
      <Route path="/receipts" element={session ? <ReceiptGenerator /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <EmployeeProvider>
          <TooltipProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </EmployeeProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;