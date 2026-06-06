import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const { business_id, ...rest } = body;

  const { data: biz } = await supabase.from('businesses').select('user_id').eq('id', business_id).single();
  if (!biz || biz.user_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { error } = await supabase.from('settings').upsert({ business_id, ...rest }, { onConflict: 'business_id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
