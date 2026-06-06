import { getCurrentBusiness } from '@/lib/getBusiness';
import { redirect } from 'next/navigation';
import { ReviewsClient } from './ReviewsClient';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const { business, supabase } = await getCurrentBusiness();
  if (!business) redirect('/onboarding');
  const { data: reviews } = await supabase!
    .from('reviews').select('*').eq('business_id', business.id)
    .order('created_at', { ascending: false }).limit(200);
  return <ReviewsClient initial={reviews || []} businessId={business.id} />;
}
