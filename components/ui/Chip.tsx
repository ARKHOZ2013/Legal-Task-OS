import React from 'react';
import { Area, Status, Priority } from '@/types';
import { cn } from '@/lib/utils';

export const getAreaColor = (area: Area) => {
  switch (area) {
    case 'Litigios': return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'Internacional': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Corporativo y Tributario': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'Administrativo': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    case 'Quick Wins': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'GET': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    case 'Investigar': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

export const getStatusColor = (status: Status) => {
  switch (status) {
    case 'pendiente': return 'bg-slate-800 text-slate-300 border-slate-700';
    case 'en análisis/desarrollo': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
    case 'esperando respuesta/revisión': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    case 'completado': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'Baja': return 'text-slate-400';
    case 'Media': return 'text-blue-400';
    case 'Alta': return 'text-orange-400';
    case 'Crítica': return 'text-red-500 font-bold';
    default: return 'text-gray-400';
  }
};

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className }: ChipProps) {
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center justify-center whitespace-nowrap",
      className
    )}>
      {children}
    </span>
  );
}
