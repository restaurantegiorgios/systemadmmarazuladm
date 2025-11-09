import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { EmployeeProvider } from "./contexts/EmployeeProvider";
import React, { Suspense } from "react";
import PWAFeatures from "./components/PWAFeatures";

// Lazy-loaded pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const EmployeeProfile = React.lazy(() => import("./pages/EmployeeProfile"));
const ReceiptGenerator = React.lazy(() => import("./pages/ReceiptGenerator"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <EmployeeProvider>
        <TooltipProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Toaster />
            <Sonner />
            <PWAFeatures />
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen text-lg text-muted-foreground">
                Carregando...
              </div>
            }>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employee/:id" element={<EmployeeProfile />} />
                <Route path="/receipts" element={<ReceiptGenerator />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </EmployeeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;