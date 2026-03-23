export type Area = string;
export type Status = string;
export type Priority = string;

export interface AppSettings {
  areas: string[];
  statuses: string[];
  priorities: string[];
}

export interface Task {
  id: string;
  title: string;
  area: Area;
  status: Status;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  notes: string;
  responsable?: string;
}
