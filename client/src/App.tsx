import React from 'react'; // Import React
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Import the provider and the new modal
import { ModalProvider } from './contexts/ModalContext'; // .tsx extension is implied
import ContactModal from './pages/ContactModal'; // .tsx extension is implied

import Index from "./pages/Index";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import LoginSignup from "./pages/LoginSignup";
import OtpPage from "./pages/OtpPage";
import JobPage from "./pages/JobPage";
import Contact from "./pages/contact";

const queryClient = new QueryClient();

// 2. Type the component as a React Functional Component
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ModalProvider> 
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/signup" element={<LoginSignup />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/jobPage" element={<JobPage />} />
            <Route path="/contact" element={<Contact />} />
            {/* The /contact route is removed */}
          </Routes>
        </BrowserRouter>
        
        <ContactModal />
      </ModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;