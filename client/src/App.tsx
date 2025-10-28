import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { ModalProvider } from "./contexts/ModalContext";
import ContactModal from "./pages/ContactModal";
import AboutModal from "./pages/AboutModal";

import Index from "./pages/Index";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import LoginSignup from "./pages/LoginSignup";
import OtpPage from "./pages/OtpPage";
import JobPage from "./pages/JobPage";
import Contact from "./pages/contact";
import About from "./pages/About";

const queryClient = new QueryClient();

/**
 * 🧭 AppRoutes Component
 * Handles all page routes and authentication logic
 */
const AppRoutes = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const location = useLocation();

  // ✅ Listen for token changes across tabs
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Update token on navigation within same tab
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken !== token) setToken(currentToken);
  }, [location]);

  return (
    <Routes>
      {/* ✅ Landing page (if logged out) or Job Page (if logged in) */}
      <Route path="/" element={token ? <JobPage /> : <Index />} />

      {/* ✅ Auth routes */}
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/signup" element={<LoginSignup />} />
      <Route path="/otp" element={<OtpPage />} />

      {/* ✅ Protected routes */}
      <Route path="/jobPage" element={token ? <JobPage /> : <Navigate to="/" />} />
      <Route path="/job/:id" element={<JobDetail />} />

      {/* ✅ Public pages */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />

      {/* ✅ 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * 🌍 Main App Component
 * Wraps everything with providers (QueryClient, Modals, Tooltips, Toasters)
 */
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ModalProvider>
        <BrowserRouter>
          {/* ✅ Global Toasters */}
          <Toaster /> {/* For Shadcn UI alerts */}
          <Sonner />  {/* For success/error toast notifications */}

          {/* ✅ App Routes */}
          <AppRoutes />

          {/* ✅ Global Modals */}
          <ContactModal />
          <AboutModal />
        </BrowserRouter>
      </ModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
