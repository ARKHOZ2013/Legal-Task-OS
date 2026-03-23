'use client'

import React, { useState, useEffect } from 'react';
import { Task, AppSettings } from '@/types';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  initialTasks: Task[];
  settings: AppSettings;
}

export default function CalendarClient({ initialTasks, settings }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Need this due to hydration mismatch with dates if not careful
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  
  const startDate = new Date(start);
  startDate.setDate(startDate.getDate() - startDate.getDay()); 
  
  const endDate = new Date(end);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); 
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (date: Date) => {
    return initialTasks.filter(t => {
      if (!t.dueDate) return false;
      const tDate = new Date(t.dueDate + "T12:00:00");
      return isSameDay(tDate, date);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  return (
    <div className="p-8 h-full flex flex-col print:p-0 print:h-auto print:bg-white print:text-black">
      <div className="mb-6 flex items-center justify-between no-print flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Calendario de Vencimientos</h1>
          <p className="text-gray-400 text-sm mt-1">Visualiza las fechas límite de todos los procesos</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handlePrint} variant="outline" className="gap-2 bg-[#222] border-[#444] text-white hover:bg-[#333]">
            <Printer size={18} />
            <span className="font-medium">Imprimir A4</span>
          </Button>
          <div className="flex items-center bg-[#1e1e1e] border border-[#333] rounded-md overflow-hidden p-1 shadow-sm">
            <button onClick={prevMonth} className="p-1.5 hover:bg-[#2a2a2a] rounded text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="min-w-[140px] text-center font-bold text-white capitalize tracking-wide">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-[#2a2a2a] rounded text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print-only mb-6 text-center">
        <h1 className="text-2xl font-bold text-black border-b-2 border-black pb-2 capitalize">
          Calendario de Vencimientos - {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h1>
      </div>

      <div className="flex-1 min-h-[500px] border border-[#333] print:border-black rounded-xl overflow-hidden bg-[#1a1a1a] print:bg-white shadow-lg flex flex-col">
        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-[#333] print:border-black bg-[#222] print:bg-gray-100 flex-shrink-0">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="p-3 text-center text-xs font-bold text-gray-400 print:text-black uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7" style={{ gridAutoRows: '1fr' }}>
          {days.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toISOString()} 
                className={`border-b border-r border-[#333] print:border-black p-2 flex flex-col overflow-hidden
                  ${!isCurrentMonth ? 'bg-[#121212]/50 text-gray-600 print:bg-white print:text-gray-400' : 'bg-[#1a1a1a] text-gray-200 print:bg-white print:text-black'}
                  ${i % 7 === 6 ? 'border-r-0' : ''}`}
              >
                <div className="flex justify-between items-center mb-1 flex-shrink-0">
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full print:text-black
                    ${isToday ? 'bg-blue-600 text-white shadow-md print:bg-black print:text-white' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded print:text-black print:border print:border-black">
                      {dayTasks.length} Tareas
                    </span>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="text-xs p-1.5 rounded-md border text-left
                        bg-[#252525] border-[#444] text-gray-300
                        print:border-black print:text-black print:bg-white print:border-b-2 font-medium"
                      title={`${task.title} - ${task.area} - ${task.priority}`}
                    >
                      <div className="flex items-start gap-1.5 font-sans leading-tight">
                        <div className={`mt-[2px] w-2 h-2 flex-shrink-0 rounded-full ${task.priority === 'Crítica' ? 'bg-red-500' : task.priority === 'Alta' ? 'bg-orange-500' : task.priority === 'Media' ? 'bg-blue-500' : 'bg-gray-400'} print:!bg-black`} />
                        <span className="truncate flex-1">{task.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
