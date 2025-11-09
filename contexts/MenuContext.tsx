import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const value: MenuContextType = {
    isMenuOpen,
    setIsMenuOpen,
    closeMenu,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
