import { getTasks, getSettings } from '@/app/actions';
import TableViewClient from '@/components/TableViewClient';

// Prevent Next.js from aggressively caching this route so updates show up immediately
export const dynamic = 'force-dynamic';

export default async function Home() {
  const tasks = await getTasks();
  const settings = await getSettings();
  return <TableViewClient initialTasks={tasks} settings={settings} />;
}
