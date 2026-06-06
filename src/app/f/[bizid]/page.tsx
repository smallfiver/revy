import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PublicFeedbackForm } from './FeedbackForm';

export const dynamic = 'force-dynamic';

export default async function PublicFeedbackPage({ params }: { params: { bizid: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: business } = await supabase.from('businesses').select('id, name, rating_threshold').eq('id', params.bizid).maybeSingle();
  const { data: settings } = await supabase.from('settings').select('google_review_link').eq('business_id', params.bizid).maybeSingle();

  if (!business) return <div className="min-h-screen grid place-items-center p-8 text-center"><p>Negócio não encontrado.</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-revy/5 via-white to-revy-gold/5 grid place-items-center p-4">
      <PublicFeedbackForm businessId={business.id} businessName={business.name} threshold={business.rating_threshold || 4} googleLink={settings?.google_review_link || null} />
    </div>
  );
}
