import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the shape of the context
interface ModalContextType {
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

// 2. Create the context with a default value (or null, with a check in the hook)
// We cast 'undefined' to the type, as the provider will supply the real value.
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

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const value = { isContactModalOpen, openContactModal, closeContactModal };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};