
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import NGODashboard from "./pages/NGODashboard";
import ReportIssue from "./pages/ReportIssue";
import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/citizen/*"
              element={
                <PrivateRoute userType="citizen">
                  <Routes>
                    <Route path="dashboard" element={<CitizenDashboard />} />
                    <Route path="report" element={<ReportIssue />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route
              path="/ngo/*"
              element={
                <PrivateRoute userType="ngo">
                  <Routes>
                    <Route path="dashboard" element={<NGODashboard />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
