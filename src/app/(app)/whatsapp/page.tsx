import { getCurrentBusiness } from '@/lib/getBusiness';
import { redirect } from 'next/navigation';
import { WhatsAppClient } from './WhatsAppClient';

export const dynamic = 'force-dynamic';

export default async function WhatsAppPage() {
  const { business } = await getCurrentBusiness();
  if (!business) redirect('/onboarding');
  return <WhatsAppClient business={business} />;
}
