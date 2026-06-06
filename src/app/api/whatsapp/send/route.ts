import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { business_id, phone, message } = await req.json();

  const { data: business } = await supabase.from('businesses').select('whatsapp_instance_id, user_id').eq('id', business_id).single();
  if (!business || business.user_id !== user.id) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const instance = business.whatsapp_instance_id;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;
  if (!instance || !token) return NextResponse.json({ error: 'Configure ZAPI_TOKEN nas variáveis de ambiente e o ID da instância nas configurações.' }, { status: 400 });

  const cleanPhone = String(phone).replace(/\D/g, '');
  const url = `https://api.z-api.io/instances/${instance}/token/${token}/send-text`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(clientToken ? { 'Client-Token': clientToken } : {}) },
    body: JSON.stringify({ phone: cleanPhone, message }),
  });
  if (!r.ok) { const t = await r.text(); return NextResponse.json({ error: `Z-API: ${t}` }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
