import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { business_id, name, message_template, customers } = await req.json();

  const { data: campaign, error } = await supabase.from('campaigns').insert({
    business_id, name, message_template, status: 'draft', total_recipients: customers.length, sent_count: 0,
  }).select().single();
  if (error || !campaign) return NextResponse.json({ error: error?.message }, { status: 500 });

  const rows = customers.map((c: any) => ({
    campaign_id: campaign.id, customer_name: c.name, customer_phone: String(c.phone).replace(/\D/g, ''), status: 'pending',
  }));
  await supabase.from('campaign_messages').insert(rows);
  return NextResponse.json({ campaign });
}
