'use server'

import { kv } from '@vercel/kv';
import { Task, AppSettings } from '@/types';
import { revalidatePath } from 'next/cache';

const defaultSettings: AppSettings = {
  areas: ['Litigios', 'Internacional', 'Corporativo y Tributario', 'Administrativo', 'Quick Wins', 'GET', 'Investigar'],
  statuses: ['pendiente', 'en análisis/desarrollo', 'esperando respuesta/revisión', 'completado'],
  priorities: ['Baja', 'Media', 'Alta', 'Crítica']
};

interface AppData {
  tasks: Task[];
  settings: AppSettings;
}

// Fallback logic in case KV vars are not configured during local development preview
const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

// Extremely simplified local unpersisted fallback if Vercel KV is not yet connected
let localFallbackData: AppData = { tasks: [], settings: defaultSettings };

async function getRawData(): Promise<AppData> {
  if (!hasKV) {
    console.warn('Vercel KV no configurado. Usando almacenamiento temporal.');
    return localFallbackData;
  }
  
  try {
    const data = await kv.get<AppData>('app_data');
    if (!data) return { tasks: [], settings: defaultSettings };
    
    return {
      tasks: data.tasks || [],
      settings: data.settings || defaultSettings
    };
  } catch (error) {
    console.error('Error fetching from KV:', error);
    return { tasks: [], settings: defaultSettings };
  }
}

async function saveRawData(tasks: Task[], settings: AppSettings) {
  if (!hasKV) {
    localFallbackData = { tasks, settings };
    revalidatePath('/');
    revalidatePath('/kanban');
    revalidatePath('/calendar');
    revalidatePath('/settings');
    return;
  }

  try {
    await kv.set('app_data', { tasks, settings });
    revalidatePath('/');
    revalidatePath('/kanban');
    revalidatePath('/calendar');
    revalidatePath('/settings');
  } catch (error) {
    console.error('Error saving to KV:', error);
    throw new Error('No se pudo guardar la información en Vercel KV');
  }
}

export async function getTasks(): Promise<Task[]> {
  const data = await getRawData();
  return data.tasks;
}

export async function getSettings(): Promise<AppSettings> {
  const data = await getRawData();
  return data.settings;
}

export async function saveTask(task: Task) {
  const data = await getRawData();
  const existingIndex = data.tasks.findIndex(t => t.id === task.id);
  
  if (task.area && !data.settings.areas.includes(task.area)) {
    data.settings.areas.push(task.area);
  }
  
  if (existingIndex >= 0) {
    data.tasks[existingIndex] = task;
  } else {
    data.tasks.push(task);
  }
  
  await saveRawData(data.tasks, data.settings);
}

export async function deleteTask(id: string) {
  const data = await getRawData();
  const filteredTasks = data.tasks.filter(t => t.id !== id);
  await saveRawData(filteredTasks, data.settings);
}

export async function updateTaskStatus(id: string, status: string) {
  const data = await getRawData();
  const task = data.tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    await saveRawData(data.tasks, data.settings);
  }
}

export async function saveSettings(settings: AppSettings) {
  const data = await getRawData();
  await saveRawData(data.tasks, settings);
}
