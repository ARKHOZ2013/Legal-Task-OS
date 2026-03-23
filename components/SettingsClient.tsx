'use client'

import React, { useState } from 'react';
import { AppSettings } from '@/types';
import { saveSettings } from '@/app/actions';
import { Button } from './ui/Button';
import { Plus, X } from 'lucide-react';

interface Props {
  initialSettings: AppSettings;
}

export default function SettingsClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newArea, setNewArea] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    await saveSettings(settings);
    setIsSaving(false);
    setSaveMessage('¡Cambios guardados!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const addItem = (key: keyof AppSettings, value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    if (settings[key].includes(value.trim())) return;
    setSettings({ ...settings, [key]: [...settings[key], value.trim()] });
    setValue('');
  };

  const removeItem = (key: keyof AppSettings, valToRemove: string) => {
    setSettings({ ...settings, [key]: settings[key].filter(v => v !== valToRemove) });
  };

  const ListEditor = ({ title, desc, dataKey, val, setVal }: { title: string, desc: string, dataKey: keyof AppSettings, val: string, setVal: React.Dispatch<React.SetStateAction<string>> }) => (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="text-sm text-gray-400 mb-5">{desc}</p>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={val} 
          onChange={e => setVal(e.target.value)} 
          onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addItem(dataKey, val, setVal); } }}
          placeholder="Añadir nuevo..."
          className="flex-1 bg-[#121212] border border-[#444] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-colors text-sm" 
        />
        <Button onClick={() => addItem(dataKey, val, setVal)} size="sm" type="button" className="px-4 gap-1.5 shadow-sm">
          <Plus size={16} /> <span className="hidden sm:inline">Añadir</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 bg-[#121212]/50 p-4 rounded-lg border border-[#333]/50 min-h-[60px] items-center">
        {settings[dataKey].map(item => (
          <div key={item} className="flex items-center gap-1.5 bg-[#2a2a2a] border border-[#444] rounded-full pl-3 pr-1.5 py-1 text-sm text-gray-200">
            <span>{item}</span>
            <button onClick={() => removeItem(dataKey, item)} className="text-gray-400 hover:text-red-400 p-0.5 rounded-full hover:bg-[#3dd] hover:bg-red-500/10 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
        {settings[dataKey].length === 0 && (
          <span className="text-sm text-gray-500 italic w-full text-center">No hay elementos configurados.</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Configuración</h1>
          <p className="text-gray-400 text-sm mt-1">Personaliza los campos dinámicos de tu panel</p>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && <span className="text-emerald-400 text-sm font-medium animate-pulse">{saveMessage}</span>}
          <Button onClick={handleSave} disabled={isSaving} className="shadow-lg shadow-white/5">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 max-w-4xl custom-scrollbar pr-2 pb-12">
        <ListEditor 
          title="Estados (Kanban)" 
          desc="Estos son los estados que aparecen como columnas en tu tablero Kanban. El orden superior define cómo se renderizan de izquierda a derecha."
          dataKey="statuses" 
          val={newStatus} 
          setVal={setNewStatus} 
        />
        <ListEditor 
          title="Niveles de Prioridad" 
          desc="Opciones seleccionables para indicar la prioridad de una tara."
          dataKey="priorities" 
          val={newPriority} 
          setVal={setNewPriority} 
        />
        <ListEditor 
          title="Áreas (Sugerencias)" 
          desc="Áreas predefinidas para el autocompletado rápido. Al guardar una tarea con un área nueva desde el formuario principal, se añadirá aquí de forma automática."
          dataKey="areas" 
          val={newArea} 
          setVal={setNewArea} 
        />
      </div>
    </div>
  );
}
