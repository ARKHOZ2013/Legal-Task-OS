'use client'

import React, { useState, useEffect } from 'react';
import { Task, AppSettings } from '@/types';
import { updateTaskStatus } from '@/app/actions';
import { Chip, getAreaColor, getPriorityColor } from './ui/Chip';

interface Props {
  initialTasks: Task[];
  settings: AppSettings;
}

export default function KanbanClient({ initialTasks, settings }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns = settings.statuses.map(s => ({
    id: s,
    title: s.charAt(0).toUpperCase() + s.slice(1),
    color: 'border-slate-700'
  }));

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires some data to be set
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const taskId = draggedTaskId;
    
    // Optimistically update UI
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    setDraggedTaskId(null);

    // Persist
    await updateTaskStatus(taskId, status);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white tracking-tight">Tablero Kanban</h1>
        <p className="text-gray-400 text-sm mt-1">Arrastra y suelta las tareas para cambiar su estado (HTML5 Drag & Drop)</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
        {columns.map(col => (
          <div 
            key={col.id} 
            className={`flex-shrink-0 w-80 bg-[#1e1e1e]/80 rounded-xl border-t-4 ${col.color} flex flex-col shadow-lg max-h-full`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#333]/50">
              <h3 className="font-semibold text-gray-200">{col.title}</h3>
              <span className="bg-[#2a2a2a] text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[150px]">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-[#252525] p-4 rounded-lg border border-[#3a3a3a] shadow-sm cursor-grab active:cursor-grabbing hover:border-gray-400 transition-all ${draggedTaskId === task.id ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <Chip className={getAreaColor(task.area)}>{task.area}</Chip>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-100 mb-3 leading-snug">{task.title}</h4>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-xs font-medium text-gray-400 bg-[#1a1a1a] px-2 py-1 rounded">
                      <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(task.dueDate+"T12:00:00").toLocaleDateString('es-ES', {month: 'short', day: 'numeric'})}
                    </div>
                  </div>
                  {task.responsable && (
                    <div className="mt-3 text-xs text-gray-500 bg-[#1a1a1a] p-1.5 rounded truncate">
                      Resp: {task.responsable}
                    </div>
                  )}
                </div>
              ))}
              
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div className="h-24 border-2 border-dashed border-[#333] rounded-lg flex items-center justify-center text-gray-500 text-sm">
                  Arrastra aquí
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
