import { getTasks, getSettings } from '@/app/actions';
import KanbanClient from '@/components/KanbanClient';

export const dynamic = 'force-dynamic';

export default async function Kanban() {
  const tasks = await getTasks();
  const settings = await getSettings();
  return <KanbanClient initialTasks={tasks} settings={settings} />;
}
