import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { EmployeeProvider } from "./contexts/EmployeeProvider";
import Dashboard from "./pages/Dashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import ReceiptGenerator from "./pages/ReceiptGenerator";
import NotFound from "./pages/NotFound";
import { ShepherdJourneyProvider } from 'react-shepherd';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <EmployeeProvider>
        <TooltipProvider>
          <ShepherdJourneyProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employee/:id" element={<EmployeeProfile />} />
                <Route path="/receipts" element={<ReceiptGenerator />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ShepherdJourneyProvider>
        </TooltipProvider>
      </EmployeeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;