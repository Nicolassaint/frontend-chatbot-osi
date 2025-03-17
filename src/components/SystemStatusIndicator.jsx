"use client";

import { useSystemStatus } from '../context/SystemStatusContext';

export default function SystemStatusIndicator({ showText = false }) {
  const { status, isLoading, getStatusColor, getStatusText } = useSystemStatus();

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`h-2.5 w-2.5 rounded-full ${getStatusColor()} ${isLoading ? 'animate-pulse' : ''}`}
        title={getStatusText()}
      ></div>
      {showText && (
        <span className="text-xs hidden sm:inline">
          {getStatusText()}
        </span>
      )}
    </div>
  );
} 