'use client'

import React, { useState, useEffect } from 'react';
import { Task, AppSettings } from '@/types';
import { Button } from './ui/Button';
import { saveTask } from '@/app/actions';
import { X } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  settings: AppSettings;
}

export default function TaskModal({ isOpen, onClose, task, settings }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '', area: settings.areas[0] || '', status: settings.statuses[0] || '', priority: settings.priorities[0] || '', dueDate: '', notes: '', responsable: ''
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({ 
        title: '', 
        area: settings.areas[0] || '', 
        status: settings.statuses[0] || '', 
        priority: settings.priorities[0] || '', 
        dueDate: '', 
        notes: '',
        responsable: ''
      });
    }
  }, [task, isOpen, settings]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: task?.id || Math.random().toString(36).substring(2, 9),
      title: formData.title || '',
      area: formData.area || '',
      status: formData.status || '',
      priority: formData.priority || '',
      dueDate: formData.dueDate || '',
      notes: formData.notes || '',
      responsable: formData.responsable || ''
    };
    await saveTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-lg font-semibold text-white">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#121212] border border-[#555] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors shadow-inner" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Área</label>
                <input required list="areas-list" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Escribe o selecciona..."
                  className="w-full bg-[#121212] border border-[#555] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-colors shadow-inner" />
                <datalist id="areas-list">
                  {settings.areas.map(a => <option key={a} value={a} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-[#121212] border border-[#555] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-colors shadow-inner">
                  {settings.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Prioridad</label>
                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                  className="w-full bg-[#121212] border border-[#555] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-colors shadow-inner">
                  {settings.priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Responsable / Link</label>
                <input type="text" value={formData.responsable || ''} onChange={e => setFormData({...formData, responsable: e.target.value})} placeholder="Ej: Link Expediente o Nombre"
                  className="w-full bg-[#121212] border border-[#555] rounded-md px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors shadow-inner" />
              </div>
            </div>

            <div className="grid grid-cols-1">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Vencimiento Estricto</label>
                <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full bg-[#121212] border border-[#555] rounded-md px-3 py-2 text-white hover:border-white focus:outline-none focus:border-white transition-colors shadow-inner" style={{colorScheme: 'dark'}} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Notas Cortas</label>
              <textarea value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2}
                className="w-full bg-[#121212] border border-[#555] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-colors resize-none shadow-inner" placeholder="Añade observaciones clave..." />
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-[#333] bg-[#1aaa1a]/10 bg-[#1a1a1a] flex justify-end gap-3 rounded-b-xl w-full flex-shrink-0">
          <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
          <Button form="task-form" type="submit">Guardar Tarea</Button>
        </div>
      </div>
    </div>
  );
}
