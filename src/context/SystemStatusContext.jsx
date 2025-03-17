"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SystemStatusContext = createContext();

export function SystemStatusProvider({ children }) {
  const [status, setStatus] = useState("unknown");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await axios.get(
          `/api/proxy/system-status`
        );
        setStatus(response.data.status);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'état du système:", error);
        setStatus("unknown");
        setIsLoading(false);
      }
    };

    fetchSystemStatus();
    const intervalId = setInterval(fetchSystemStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "optimal":
        return "bg-green-500";
      case "normal":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "optimal":
        return "Disponibilité optimale";
      case "normal":
        return "Disponibilité normale";
      case "warning":
        return "Disponibilité réduite";
      case "critical":
        return "Disponibilité critique";
      default:
        return "État inconnu";
    }
  };

  return (
    <SystemStatusContext.Provider value={{ status, isLoading, getStatusColor, getStatusText }}>
      {children}
    </SystemStatusContext.Provider>
  );
}

export function useSystemStatus() {
  const context = useContext(SystemStatusContext);
  if (!context) {
    throw new Error('useSystemStatus must be used within a SystemStatusProvider');
  }
  return context;
} 