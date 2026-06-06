import { getCurrentBusiness } from '@/lib/getBusiness';
import { redirect } from 'next/navigation';
import { SettingsClient } from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const { business, supabase } = await getCurrentBusiness();
  if (!business) redirect('/onboarding');
  const { data: settings } = await supabase!.from('settings').select('*').eq('business_id', business.id).maybeSingle();
  return <SettingsClient business={business} settings={settings || {}} />;
}
