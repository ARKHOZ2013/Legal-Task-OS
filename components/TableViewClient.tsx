'use client'

import React, { useState } from 'react';
import { Task, AppSettings } from '@/types';
import { Button } from './ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import TaskModal from './TaskModal';
import { Chip, getAreaColor, getStatusColor, getPriorityColor } from './ui/Chip';
import { deleteTask } from '@/app/actions';

interface Props {
  initialTasks: Task[];
  settings: AppSettings;
}

export default function TableViewClient({ initialTasks, settings }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const removeTask = async (id: string) => {
    if (confirm('¿Eliminar esta tarea?')) {
      await deleteTask(id);
    }
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tabla Principal</h1>
          <p className="text-gray-400 text-sm mt-1">Gestiona todas tus responsabilidades legales</p>
        </div>
        <Button onClick={openNew} className="gap-2 shadow-sm shadow-white/5">
          <Plus size={18} />
          <span>Nueva Tarea</span>
        </Button>
      </div>

      <div className="bg-[#1e1e1e]/60 border border-[#333] rounded-xl overflow-hidden shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#333] bg-[#222]/50">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase">Título</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase">Área</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase">Estado</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase">Prioridad</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase">Vencimiento</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase">Responsable</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase w-32">Notas</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 tracking-wider uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]/50">
              {initialTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-dashed border-gray-600 flex items-center justify-center mb-3">
                        <Plus className="text-gray-500" />
                      </div>
                      <p>No hay tareas registradas.</p>
                      <button onClick={openNew} className="text-white hover:underline mt-1 text-sm">Empieza creando una nueva.</button>
                    </div>
                  </td>
                </tr>
              ) : initialTasks.map(task => (
                <tr key={task.id} className="hover:bg-[#2a2a2a]/60 transition-colors group">
                  <td className="px-5 py-4 text-sm text-gray-200 font-medium">{task.title}</td>
                  <td className="px-5 py-4"><Chip className={getAreaColor(task.area)}>{task.area}</Chip></td>
                  <td className="px-5 py-4"><Chip className={getStatusColor(task.status)}>{task.status}</Chip></td>
                  <td className="px-5 py-4 text-sm font-medium"><span className={getPriorityColor(task.priority)}>{task.priority}</span></td>
                  <td className="px-5 py-4 text-sm text-gray-300 whitespace-nowrap">{new Date(task.dueDate+"T12:00:00").toLocaleDateString('es-ES', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                  <td className="px-5 py-4 text-sm text-gray-300 truncate max-w-[120px]">{task.responsable || '-'}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 truncate max-w-[120px]" title={task.notes}>{task.notes || '-'}</td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(task)} className="h-8 w-8 p-0" title="Editar">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => removeTask(task.id)} className="h-8 w-8 p-0 bg-transparent text-gray-400 hover:text-red-500" title="Eliminar">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={editingTask} settings={settings} />
    </div>
  );
}
