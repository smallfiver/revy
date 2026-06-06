import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

function sentiment(r: number) { return r >= 4 ? 'positive' : r === 3 ? 'neutral' : 'negative'; }

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const { business_id, author_name, rating, comment } = body;
  const { data, error } = await supabase.from('reviews').insert({
    business_id, author_name, rating, comment: comment || null,
    sentiment: sentiment(rating), status: 'pending', published_at: new Date().toISOString()
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ review: data });
}

export async function PATCH(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id, reply, status } = await req.json();
  const patch: any = {};
  if (reply !== undefined) { patch.reply = reply; patch.reply_published_at = new Date().toISOString(); }
  if (status) patch.status = status;
  const { error } = await supabase.from('reviews').update(patch).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
