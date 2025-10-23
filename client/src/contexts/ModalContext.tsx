import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the shape of the context
interface ModalContextType {
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
  // Add state and functions for the About modal
  isAboutModalOpen: boolean;
  openAboutModal: () => void;
  closeAboutModal: () => void;
}

// 2. Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// 3. Create a custom hook for easy access
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// 4. Define props for the provider
interface ModalProviderProps {
  children: ReactNode;
}

// 5. Create the provider component
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  // Add state for the About modal
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // Add functions for the About modal
  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  // Add the new state and functions to the context value
  const value = { 
    isContactModalOpen, 
    openContactModal, 
    closeContactModal,
    isAboutModalOpen,
    openAboutModal,
    closeAboutModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};