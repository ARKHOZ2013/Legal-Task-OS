import { getSettings } from '@/app/actions';
import SettingsClient from '@/components/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function Settings() {
  const settings = await getSettings();
  return <SettingsClient initialSettings={settings} />;
}
