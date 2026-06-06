import { getCurrentBusiness } from '@/lib/getBusiness';
import { redirect } from 'next/navigation';
import { FeedbackClient } from './FeedbackClient';

export const dynamic = 'force-dynamic';

export default async function FeedbackPage() {
  const { business, supabase } = await getCurrentBusiness();
  if (!business) redirect('/onboarding');
  const { data: feedback } = await supabase!.from('feedback').select('*').eq('business_id', business.id).order('created_at', { ascending: false });
  const url = process.env.NEXT_PUBLIC_APP_URL || '';
  return <FeedbackClient initial={feedback || []} business={business} publicUrl={`${url}/f/${business.id}`} />;
}
