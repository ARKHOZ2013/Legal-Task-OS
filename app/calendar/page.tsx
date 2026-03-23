import { getTasks, getSettings } from '@/app/actions';
import CalendarClient from '@/components/CalendarClient';

export const dynamic = 'force-dynamic';

export default async function Calendar() {
  const tasks = await getTasks();
  const settings = await getSettings();
  return <CalendarClient initialTasks={tasks} settings={settings} />;
}
