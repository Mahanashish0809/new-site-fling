import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { ModalProvider } from "./contexts/ModalContext";
import ContactModal from "./pages/ContactModal";
import AboutModal from "./pages/AboutModal"; // 1. Import AboutModal

import Index from "./pages/Index";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import LoginSignup from "./pages/LoginSignup";
import OtpPage from "./pages/OtpPage";
import JobPage from "./pages/JobPage";
import Contact from "./pages/contact";
import About from "./pages/About";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const location = useLocation();

  // Watch for token changes from anywhere in the app
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update token on login/logout within same tab
  useEffect(() => {
    const tokenNow = localStorage.getItem("token");
    if (tokenNow !== token) setToken(tokenNow);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={token ? <JobPage /> : <Index />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/signup" element={<LoginSignup />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/jobPage" element={token ? <JobPage /> : <Navigate to="/" />} />
      <Route path="/job/:id" element={<JobDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} /> {/* This route still works for the page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ModalProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
          <ContactModal />
          <AboutModal /> {/* 2. Render AboutModal here */}
        </BrowserRouter>
      </ModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;