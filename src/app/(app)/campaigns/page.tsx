import { getCurrentBusiness } from '@/lib/getBusiness';
import { redirect } from 'next/navigation';
import { CampaignsClient } from './CampaignsClient';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const { business, supabase } = await getCurrentBusiness();
  if (!business) redirect('/onboarding');
  const { data: campaigns } = await supabase!.from('campaigns').select('*').eq('business_id', business.id).order('created_at', { ascending: false });
  return <CampaignsClient initial={campaigns || []} business={business} />;
}
