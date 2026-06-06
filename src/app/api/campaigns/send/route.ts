import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { campaign_id } = await req.json();

  const { data: campaign } = await supabase.from('campaigns').select('*, businesses(*)').eq('id', campaign_id).single();
  if (!campaign) return NextResponse.json({ error: 'campaign not found' }, { status: 404 });
  const business = (campaign as any).businesses;
  if (business.user_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const instance = business.whatsapp_instance_id;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;
  if (!instance || !token) return NextResponse.json({ error: 'Configure WhatsApp/Z-API antes de iniciar a campanha.' }, { status: 400 });

  const { data: messages } = await supabase.from('campaign_messages').select('*').eq('campaign_id', campaign_id).eq('status', 'pending');
  let sent = 0;
  for (const m of messages || []) {
    const text = campaign.message_template.replaceAll('{nome}', m.customer_name);
    const r = await fetch(`https://api.z-api.io/instances/${instance}/token/${token}/send-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(clientToken ? { 'Client-Token': clientToken } : {}) },
      body: JSON.stringify({ phone: m.customer_phone, message: text }),
    });
    if (r.ok) {
      sent++;
      await supabase.from('campaign_messages').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', m.id);
    } else {
      await supabase.from('campaign_messages').update({ status: 'failed' }).eq('id', m.id);
    }
  }
  await supabase.from('campaigns').update({ status: 'sent', sent_count: sent }).eq('id', campaign_id);
  return NextResponse.json({ sent });
}
