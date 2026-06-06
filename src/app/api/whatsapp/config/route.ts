import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { business_id, instance_id, phone } = await req.json();
  const { error } = await supabase.from('businesses').update({
    whatsapp_instance_id: instance_id || null,
    whatsapp_phone: phone || null,
    whatsapp_connected: !!(instance_id && process.env.ZAPI_TOKEN),
  }).eq('id', business_id).eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
