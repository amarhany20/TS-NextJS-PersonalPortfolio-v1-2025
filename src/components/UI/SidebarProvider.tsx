"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  closeAllSidebars: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
    setRightSidebarOpen(false); // Close right sidebar when opening left
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
    setLeftSidebarOpen(false); // Close left sidebar when opening right
  };

  const closeAllSidebars = () => {
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  // Close sidebars on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        closeAllSidebars();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebars on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllSidebars();
      }
    };

    if (leftSidebarOpen || rightSidebarOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [leftSidebarOpen, rightSidebarOpen]);

  return (
    <SidebarContext.Provider
      value={{
        leftSidebarOpen,
        rightSidebarOpen,
        toggleLeftSidebar,
        toggleRightSidebar,
        closeAllSidebars,
      }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
